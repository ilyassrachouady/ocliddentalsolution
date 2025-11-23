import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { api } from '@/lib/api';
import { demoDentist } from '@/lib/mock-data';
import { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarScheduler } from '@/components/ui/calendar-scheduler';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  Calendar as CalendarIcon,
  User,
  CheckCircle2,
  Stethoscope,
  Check,
  Clock,
  ArrowRight,
  ArrowLeft,
  Star,
  Phone,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeSlot {
  time: string;
  capacity: number;
  remaining: number;
  isAvailable: boolean;
}

export interface BookingData {
  service: Service | null;
  date: Date | null;
  timeSlot: TimeSlot | null;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  notes: string;
  saveInfo: boolean;
  appointmentId?: string | null;
}

interface QuizStyleBookingProps {
  onSuccess?: (bookingData: BookingData) => void;
  onCancel?: () => void;
  className?: string;
}

const STEPS = [
  { id: 1, name: 'Service', title: 'Quel type de soin recherchez-vous ?', icon: Stethoscope },
  { id: 2, name: 'Date', title: 'Quand souhaitez-vous venir ?', icon: CalendarIcon },
  { id: 3, name: 'Informations', title: 'Comment vous contacter ?', icon: User },
  { id: 4, name: 'Confirmation', title: 'Tout est-il correct ?', icon: CheckCircle2 },
];

export default function QuizStyleBooking({
  onSuccess,
  onCancel,
  className
}: QuizStyleBookingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [booking, setBooking] = useState<BookingData>({
    service: null,
    date: null,
    timeSlot: null,
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    notes: '',
    saveInfo: false,
  });

  const dentist = demoDentist;

  // Load saved info
  useEffect(() => {
    const saved = localStorage.getItem('patientInfo');
    if (saved) {
      const info = JSON.parse(saved);
      setBooking(prev => ({
        ...prev,
        patientName: info.name || '',
        patientPhone: info.phone || '',
        patientEmail: info.email || '',
      }));
    }
  }, []);

  // Load time slots when service and date selected
  useEffect(() => {
    if (booking.service && selectedDate) {
      loadTimeSlots();
    } else {
      setAvailableSlots([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, booking.service]);

  const loadTimeSlots = async () => {
    if (!selectedDate || !dentist || !booking.service) {
      setAvailableSlots([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const slots = await api.getAvailableSlots(dentist.id, selectedDate);
      
      if (!slots || slots.length === 0) {
        setAvailableSlots([]);
        setIsLoading(false);
        return;
      }
      
      const day = selectedDate.getDay();
      const filteredSlots = slots.filter(time => {
        if (day === 0) return false; // Sunday disabled
        if (day === 6) { // Saturday morning only
          const hour = parseInt(time.split(':')[0]);
          return hour < 12;
        }
        return true;
      });

      const timeSlots: TimeSlot[] = filteredSlots.map(time => {
        const capacity = Math.floor(Math.random() * 4) + 3;
        const remaining = Math.floor(Math.random() * capacity) + 1;
        return {
          time,
          capacity,
          remaining,
          isAvailable: remaining > 0,
        };
      });
      
      setAvailableSlots(timeSlots);
    } catch (err) {
      console.error('Error loading time slots:', err);
      setAvailableSlots([]);
      toast.error('Erreur lors du chargement des créneaux');
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setBooking(prev => ({ ...prev, service }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setBooking(prev => ({ ...prev, date, timeSlot: null }));
    }
  };


  const handleNext = () => {
    // Special handling for step 2 (date/time) - confirm the selection
    if (currentStep === 2 && booking.date && booking.timeSlot) {
      // Confirm the time slot selection
      setCurrentStep(3);
      return;
    }
    
    const nextStep = currentStep + 1;
    if (nextStep <= STEPS.length) {
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    const prevStep = currentStep - 1;
    if (prevStep >= 1) {
      setCurrentStep(prevStep);
    }
  };

  const handleSubmit = async () => {
    if (!booking.service || !booking.date || !booking.timeSlot || !booking.patientName || !booking.patientPhone) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);
    try {
      const appointment = await api.bookAppointment({
        dentistId: dentist.id,
        serviceId: booking.service.id,
        date: booking.date.toISOString(),
        time: booking.timeSlot.time,
        patientName: booking.patientName,
        patientPhone: booking.patientPhone,
        patientEmail: booking.patientEmail || undefined,
        notes: booking.notes || undefined,
      });

      const finalBooking = { ...booking, appointmentId: appointment.id };
      setBooking(finalBooking);

      if (booking.saveInfo) {
        localStorage.setItem('patientInfo', JSON.stringify({
          name: booking.patientName,
          phone: booking.patientPhone,
          email: booking.patientEmail,
        }));
      }

      setShowSuccess(true);
      toast.success('Rendez-vous confirmé! Un message a été envoyé à ' + booking.patientPhone);
      
      if (onSuccess) {
        onSuccess(finalBooking);
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
      toast.error('Erreur lors de la réservation');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('212')) {
      return `+212 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
    }
    return cleaned;
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return !!booking.service;
      case 2: return !!(booking.date && booking.timeSlot);
      case 3: return !!(booking.patientName && booking.patientPhone);
      default: return false;
    }
  };

  const currentStepData = STEPS[currentStep - 1];

  if (showSuccess) {
    return (
      <div className={cn("w-full max-w-4xl mx-auto", className)}>
        <Card className="border-0 shadow-xl bg-white overflow-hidden">
          <CardContent className="p-12">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Rendez-vous confirmé!</h1>
              <p className="text-gray-600">Merci de votre confiance</p>
            </div>

            {/* Appointment ID Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
              <div className="text-center">
                <div className="text-sm text-green-600 font-semibold mb-2">Numéro de rendez-vous</div>
                <div className="text-4xl font-bold text-green-900 font-mono mb-3">{booking.appointmentId}</div>
                <p className="text-xs text-green-600">Conservez ce numéro pour toute modification ou annulation</p>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 mb-8">
              {booking.service && (
                <div className="flex justify-between items-start pb-4 border-b">
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-semibold">SERVICE</div>
                    <div className="font-semibold text-gray-900">{booking.service.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-blue-600">{booking.service.price} MAD</div>
                  </div>
                </div>
              )}

              {booking.date && booking.timeSlot && (
                <div className="flex justify-between items-start pb-4 border-b">
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-semibold">DATE & HEURE</div>
                    <div className="font-semibold text-gray-900">
                      {format(booking.date, 'EEEE d MMMM yyyy', { locale: fr })}
                    </div>
                    <div className="text-sm font-semibold text-blue-600 mt-1">{booking.timeSlot.time}</div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-gray-500 mb-1 font-semibold">PATIENT</div>
                  <div className="font-semibold text-gray-900">{booking.patientName}</div>
                  <div className="text-xs text-gray-600">{booking.patientPhone}</div>
                  {booking.patientEmail && (
                    <div className="text-xs text-gray-600">{booking.patientEmail}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => {
                  if (!booking.date || !booking.timeSlot || !booking.service) return;

                  // Create Google Calendar link
                  const startDateTime = new Date(`${format(booking.date, 'yyyy-MM-dd')}T${booking.timeSlot.time}`);
                  const endDateTime = new Date(startDateTime.getTime() + 60 * 60000); // Default 60 minutes

                  const formatGoogleDate = (date: Date) => {
                    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                  };

                  const eventTitle = `${booking.service.name} - ${dentist.name}`;
                  const eventDescription = `Service: ${booking.service.name}\nPatient: ${booking.patientName}\nTéléphone: ${booking.patientPhone}${booking.patientEmail ? `\nEmail: ${booking.patientEmail}` : ''}${booking.notes ? `\nNotes: ${booking.notes}` : ''}`;
                  const eventLocation = `${dentist.address}, ${dentist.city}`;

                  const googleCalendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(eventTitle)}&dates=${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}`;

                  window.open(googleCalendarUrl, '_blank');
                }}
                className="w-full rounded-xl h-12"
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                Ajouter au Google Calendar
              </Button>

              <Button
                onClick={() => {
                  // Reschedule: go back to date/time step
                  setShowSuccess(false);
                  setCurrentStep(2);
                  setBooking(prev => ({ ...prev, date: null, timeSlot: null }));
                  setSelectedDate(undefined);
                  toast('Vous pouvez choisir une nouvelle date et un créneau', { icon: '⏰' });
                }}
                className="w-full rounded-xl h-12 bg-blue-600 hover:bg-blue-700"
              >
                Replanifier ce rendez-vous
              </Button>

              <Button
                variant="destructive"
                onClick={async () => {
                  if (!booking.appointmentId) {
                    toast.error('Aucun ID de rendez-vous disponible');
                    return;
                  }
                  try {
                    await api.deleteAppointment(booking.appointmentId, dentist.id);
                    setShowSuccess(false);
                    toast.success('Rendez-vous annulé');
                    // Reset to beginning
                    setCurrentStep(1);
                    setBooking({
                      service: null,
                      date: null,
                      timeSlot: null,
                      patientName: booking.patientName,
                      patientPhone: booking.patientPhone,
                      patientEmail: booking.patientEmail,
                      notes: '',
                      saveInfo: booking.saveInfo,
                      appointmentId: null,
                    });
                  } catch {
                    toast.error('Erreur lors de l\'annulation');
                  }
                }}
                className="w-full rounded-xl h-12"
              >
                Annuler ce rendez-vous
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      <div className="flex flex-col h-full overflow-hidden bg-white rounded-lg shadow-sm">
        {/* Compact Progress Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            {/* Progress Steps */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all",
                    index + 1 < currentStep ? "bg-white text-teal-600" :
                    index + 1 === currentStep ? "bg-white text-teal-600" :
                    "bg-teal-500 text-teal-100"
                  )}>
                    {index + 1 < currentStep ? (
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={cn(
                      "w-4 sm:w-6 md:w-8 lg:w-12 h-0.5 mx-1 sm:mx-1.5 md:mx-2",
                      index + 1 < currentStep ? "bg-white" : "bg-teal-400"
                    )} />
                  )}
                </div>
              ))}
            </div>
            
            {/* Step Title */}
            <div className="text-right hidden md:block">
              <div className="text-blue-100 text-xs lg:text-sm">{currentStepData.name}</div>
              <h1 className="text-sm lg:text-base xl:text-lg font-bold text-white">{currentStepData.title}</h1>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-3 sm:p-4 md:p-6">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {dentist.services.map((service: Service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={cn(
                    "p-2 sm:p-3 md:p-4 rounded-lg md:rounded-xl border-2 text-left transition-all hover:shadow-md h-full flex flex-col",
                    booking.service?.id === service.id
                      ? "border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  )}
                >
                  <div className="flex items-start justify-between mb-1.5 sm:mb-2 md:mb-3">
                    <div className="font-semibold text-xs sm:text-sm md:text-base text-gray-900">{service.name}</div>
                    {service.id === 's1' && (
                      <Badge className="bg-orange-100 text-orange-700 text-[10px] sm:text-xs">
                        <Star className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                        Top
                      </Badge>
                    )}
                  </div>
                  
                  {service.description && (
                    <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-2 sm:mb-3 md:mb-4 flex-grow line-clamp-2">{service.description}</div>
                  )}
                  
                  <div className="mt-auto space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-end">
                      <div className="font-bold text-xs sm:text-sm md:text-base text-blue-600">{service.price} MAD</div>
                    </div>

                    {booking.service?.id === service.id && (
                      <div className="flex items-center justify-center text-blue-600 text-sm">
                        <Check className="w-4 h-4 mr-1" />
                        <span className="font-medium">Sélectionné</span>
                      </div>
                    )}
                  </div>
                </button>
                ))}
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {booking.service && (
                <div className="flex items-center justify-center">
                  <div className="inline-flex items-center gap-2 bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                    <Stethoscope className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    <span className="text-xs sm:text-sm text-blue-800 font-medium">{booking.service.name}</span>
                  </div>
                </div>
              )}

              <div className="w-full max-w-5xl mx-auto">
                <CalendarScheduler
                  timeSlots={availableSlots.map(s => s.time)}
                  disabledDates={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today || date.getDay() === 0;
                  }}
                  onDateChange={handleDateSelect}
                  onTimeSelect={(time) => {
                    if (selectedDate && time) {
                      const slot = availableSlots.find(s => s.time === time);
                      if (slot) {
                        setBooking(prev => ({ ...prev, timeSlot: slot }));
                      }
                    }
                  }}
                  showButtons={false}
                />
              </div>

              {booking.date && booking.timeSlot && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-green-50 px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 border-green-200">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <span className="text-xs sm:text-sm text-green-800 font-medium">
                      {format(booking.date, 'EEEE d MMMM', { locale: fr })} à {booking.timeSlot.time}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Patient Details */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Form Column */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2">
                      Nom complet *
                      {booking.patientName && <Check className="w-4 h-4 text-green-500" />}
                    </Label>
                    <Input
                      id="name"
                      value={booking.patientName}
                      onChange={(e) => setBooking(prev => ({ ...prev, patientName: e.target.value }))}
                      className="rounded-lg h-10"
                      placeholder="Votre nom complet"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      Téléphone *
                      {booking.patientPhone && <Check className="w-4 h-4 text-green-500" />}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={booking.patientPhone}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        setBooking(prev => ({ ...prev, patientPhone: formatted }));
                      }}
                      className="rounded-lg h-10"
                      placeholder="+212 6 12 34 56 78"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    Email (optionnel)
                    {booking.patientEmail && <Check className="w-4 h-4 text-green-500" />}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={booking.patientEmail}
                    onChange={(e) => setBooking(prev => ({ ...prev, patientEmail: e.target.value }))}
                    className="rounded-lg h-10"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Textarea
                    id="notes"
                    value={booking.notes}
                    onChange={(e) => setBooking(prev => ({ ...prev, notes: e.target.value }))}
                    className="rounded-lg"
                    placeholder="Informations supplémentaires..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveInfo"
                    checked={booking.saveInfo}
                    onCheckedChange={(checked) =>
                      setBooking(prev => ({ ...prev, saveInfo: checked as boolean }))
                    }
                  />
                  <Label htmlFor="saveInfo" className="text-sm text-gray-600 cursor-pointer">
                    Enregistrer mes informations
                  </Label>
                </div>
              </div>
              
              {/* Preview Column */}
              <div className="space-y-4">
                {/* Selection Preview */}
                {(booking.service || booking.date || booking.timeSlot) && (
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-blue-900 mb-4">Votre sélection</h3>
                      <div className="space-y-3">
                        {booking.service && (
                          <div>
                            <div className="text-sm text-blue-600 mb-1">Service</div>
                            <div className="font-medium text-blue-900">{booking.service.name}</div>
                            <div className="text-sm text-blue-700">{booking.service.price} MAD</div>
                          </div>
                        )}
                        {booking.date && booking.timeSlot && (
                          <div>
                            <div className="text-sm text-blue-600 mb-1">Date & Heure</div>
                            <div className="font-medium text-blue-900">
                              {format(booking.date, 'EEEE d MMMM', { locale: fr })}
                            </div>
                            <div className="text-sm text-blue-700">{booking.timeSlot.time}</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Tips */}
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-amber-900 mb-3">💡 Conseils</h3>
                    <div className="space-y-2 text-sm text-amber-800">
                      <p>• Arrivez 10 minutes avant votre rendez-vous</p>
                      <p>• Apportez une pièce d'identité</p>
                      <p>• Mentionnez vos allergies dans les notes</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="h-[60vh] overflow-auto">
              <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-center text-gray-900 mb-6">Récapitulatif de votre réservation</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {booking.service && (
                        <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                          <div className="text-sm text-blue-600 mb-1 font-medium">SERVICE</div>
                          <div className="font-semibold text-gray-900">{booking.service.name}</div>
                          <div className="font-bold text-lg text-blue-600 mt-2">{booking.service.price} MAD</div>
                        </div>
                      )}
                      
                      {booking.date && booking.timeSlot && (
                        <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                          <div className="text-sm text-green-600 mb-1 font-medium">DATE & HEURE</div>
                          <div className="font-semibold text-gray-900">
                            {format(booking.date, 'EEEE d MMMM yyyy', { locale: fr })}
                          </div>
                          <div className="text-green-600 font-semibold flex items-center gap-1 text-sm">
                            <Clock className="w-3 h-3" />
                            {booking.timeSlot.time}
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
                        <div className="text-sm text-purple-600 mb-1 font-medium">PATIENT</div>
                        <div className="font-semibold text-gray-900">{booking.patientName}</div>
                        <div className="text-gray-600 flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {booking.patientPhone}
                        </div>
                        {booking.patientEmail && (
                          <div className="text-gray-600 flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {booking.patientEmail}
                          </div>
                        )}
                      </div>
                    </div>
                    
                  {booking.notes && (
                    <div className="bg-white p-4 rounded-lg border col-span-full">
                      <div className="text-sm text-gray-500 mb-1 font-medium">NOTES</div>
                      <div className="text-gray-700 text-sm">{booking.notes}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 h-14 font-bold text-lg mt-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Confirmation en cours...
                  </>
                ) : (
                  <>
                    Confirmer la réservation
                    <CheckCircle2 className="ml-3 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
        </div>

        {/* Navigation Footer */}
        {currentStep < 4 && (
          <div className="border-t bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex-shrink-0">
            <div className="flex justify-between items-center gap-2">
              <Button
                onClick={handleBack}
                variant="outline"
                className="rounded-lg sm:rounded-xl h-8 sm:h-10 px-3 sm:px-4 md:px-6 bg-white/80 backdrop-blur-sm hover:bg-white border-0 shadow-md hover:shadow-lg transition-all font-semibold text-xs sm:text-sm"
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Retour
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className="rounded-lg sm:rounded-xl h-8 sm:h-10 px-3 sm:px-4 md:px-6 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all transform hover:scale-105 font-bold text-xs sm:text-sm"
              >
                {currentStep === 1 && 'Continuer'}
                {currentStep === 2 && 'Continuer'}
                {currentStep === 3 && 'Vers la confirmation'}
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              </Button>
            </div>
          </div>
        )}
        
        {currentStep === 4 && onCancel && (
          <div className="border-t bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex-shrink-0">
            <div className="flex justify-center">
              <Button
                onClick={onCancel}
                variant="outline"
                className="rounded-lg sm:rounded-xl h-8 sm:h-10 px-3 sm:px-4 md:px-6 bg-white/80 backdrop-blur-sm hover:bg-white border-0 shadow-md hover:shadow-lg transition-all font-semibold text-xs sm:text-sm"
              >
                Annuler
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}