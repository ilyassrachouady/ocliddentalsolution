"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarScheduler } from "@/components/ui/calendar-scheduler";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Stethoscope,
  Check,
  Sparkles,
  X
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  icon?: React.ReactNode;
  duration: string;
  price: string;
  description?: string;
}

interface TimeSlot {
  time: string;
  capacity: number;
  remaining: number;
  isAvailable: boolean;
}

interface ModernAppointmentModalV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (data: AppointmentData) => void;
  dentistId?: string;
  services?: Service[];
}

interface AppointmentData {
  service: Service | null;
  date: Date | undefined;
  timeSlot: TimeSlot | null;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  notes: string;
  saveInfo: boolean;
}

const STEPS = [
  { id: 1, name: 'Service', icon: Stethoscope },
  { id: 2, name: 'Date & Heure', icon: Calendar },
  { id: 3, name: 'Détails', icon: User },
  { id: 4, name: 'Confirmation', icon: CheckCircle2 },
];

const DEFAULT_SERVICES: Service[] = [
  {
    id: "consultation",
    name: "Consultation",
    duration: "30 min",
    price: "50",
    description: "Examen dentaire complet",
  },
  {
    id: "cleaning",
    name: "Détartrage",
    duration: "45 min",
    price: "80",
    description: "Nettoyage professionnel",
  },
  {
    id: "filling",
    name: "Plombage",
    duration: "60 min",
    price: "120",
    description: "Traitement de carie",
  },
  {
    id: "extraction",
    name: "Extraction",
    duration: "45 min",
    price: "150",
    description: "Extraction dentaire",
  },
];

export function ModernAppointmentModalV2({
  open,
  onOpenChange,
  onConfirm,
  dentistId,
  services = DEFAULT_SERVICES,
}: ModernAppointmentModalV2Props) {
  const [step, setStep] = React.useState(1);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = React.useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const [appointmentData, setAppointmentData] = React.useState<AppointmentData>({
    service: null,
    date: undefined,
    timeSlot: null,
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    notes: "",
    saveInfo: false,
  });

  const totalSteps = 4;

  // Load saved patient info
  React.useEffect(() => {
    const saved = localStorage.getItem('patientInfo');
    if (saved) {
      const info = JSON.parse(saved);
      setAppointmentData(prev => ({
        ...prev,
        patientName: info.name || '',
        patientPhone: info.phone || '',
        patientEmail: info.email || '',
      }));
    }
  }, []);

  // Load time slots when service and date selected
  React.useEffect(() => {
    if (appointmentData.service && selectedDate && dentistId) {
      loadTimeSlots();
    } else {
      setAvailableSlots([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, appointmentData.service]);

  const loadTimeSlots = async () => {
    if (!selectedDate || !dentistId || !appointmentData.service) {
      setAvailableSlots([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const slots = await api.getAvailableSlots(dentistId, selectedDate);
      
      if (!slots || slots.length === 0) {
        setAvailableSlots([]);
        setIsLoading(false);
        return;
      }
      
      // Filter slots for weekends and generate capacity
      const day = selectedDate.getDay();
      const filteredSlots = slots.filter(time => {
        if (day === 0) return false; // Sunday disabled
        if (day === 6) {
          const hour = parseInt(time.split(':')[0]);
          return hour < 12; // Saturday morning only
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

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('212')) {
      return `+212 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
    }
    return cleaned;
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setAppointmentData({ ...appointmentData, service });
    setStep(2);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setAppointmentData({ ...appointmentData, date });
    }
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (!slot.isAvailable) return;
    setAppointmentData({ ...appointmentData, timeSlot: slot });
    setStep(3);
  };

  const handleConfirm = async () => {
    if (!appointmentData.service || !appointmentData.date || !appointmentData.timeSlot || !appointmentData.patientName || !appointmentData.patientPhone) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);
    try {
      // Save info if requested
      if (appointmentData.saveInfo) {
        localStorage.setItem('patientInfo', JSON.stringify({
          name: appointmentData.patientName,
          phone: appointmentData.patientPhone,
          email: appointmentData.patientEmail,
        }));
      }

      onConfirm?.(appointmentData);
      onOpenChange(false);
      toast.success('Rendez-vous confirmé! Un message a été envoyé à ' + appointmentData.patientPhone);
      
      // Reset
      setStep(1);
      setAppointmentData({
        service: null,
        date: undefined,
        timeSlot: null,
        patientName: "",
        patientPhone: "",
        patientEmail: "",
        notes: "",
        saveInfo: false,
      });
    } catch (err) {
      console.error('Error submitting booking:', err);
      toast.error('Erreur lors de la réservation');
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return appointmentData.service !== null;
      case 2:
        return appointmentData.date !== undefined && appointmentData.timeSlot !== null;
      case 3:
        return (
          appointmentData.patientName.trim() !== "" &&
          appointmentData.patientPhone.trim() !== ""
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  const isStepCompleted = (stepNumber: number): boolean => {
    // Une étape est complétée seulement si on l'a dépassée ET qu'elle contient des données valides
    if (step <= stepNumber) {
      return false; // L'étape actuelle ou future n'est jamais "complétée"
    }
    
    switch (stepNumber) {
      case 1:
        return appointmentData.service !== null;
      case 2:
        return appointmentData.date !== undefined && appointmentData.timeSlot !== null;
      case 3:
        return appointmentData.patientName.trim() !== "" && appointmentData.patientPhone.trim() !== "";
      case 4:
        return false; // L'étape 4 n'est jamais "complétée" car c'est la dernière
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideCloseButton className="w-[96vw] sm:w-[90vw] md:w-[85vw] lg:w-[75vw] max-w-4xl h-[92vh] p-0 overflow-hidden flex flex-col gap-0">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -translate-y-20 translate-x-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-500/10 to-blue-500/10 rounded-full translate-y-16 -translate-x-16 pointer-events-none"></div>
        
        {/* Header */}
        <DialogHeader className="flex-shrink-0 bg-gradient-to-r from-teal-500 to-blue-600 px-4 py-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <DialogTitle className="text-base sm:text-lg font-bold text-white">
                  Nouveau Rendez-vous
                </DialogTitle>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {STEPS.map((s, index) => {
                const Icon = s.icon;
                const isCompleted = isStepCompleted(s.id);
                const isCurrent = step === s.id;
                
                return (
                  <React.Fragment key={s.id}>
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all",
                        isCompleted && "bg-white text-teal-600",
                        isCurrent && !isCompleted && "bg-white/30 text-white ring-2 ring-white",
                        !isCurrent && !isCompleted && "bg-white/10 text-white/60"
                      )}>
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <span className={cn(
                        "hidden sm:inline text-xs sm:text-sm font-medium transition-all",
                        (isCompleted || isCurrent) ? "text-white" : "text-white/60"
                      )}>
                        {s.name}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={cn(
                        "flex-1 h-0.5 sm:h-1 rounded-full transition-all max-w-[20px] sm:max-w-[40px]",
                        isCompleted ? "bg-white" : "bg-white/20"
                      )}></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 mb-1">Choisissez un service</h2>
                <p className="text-xs sm:text-sm text-slate-600">Sélectionnez le type de consultation souhaité</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className={cn(
                      "p-3 sm:p-4 rounded-xl border-2 text-left transition-all hover:shadow-lg",
                      appointmentData.service?.id === service.id
                        ? "border-teal-600 bg-teal-50 shadow-md scale-[1.02]"
                        : "border-slate-200 hover:border-slate-300 bg-white/80"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className={cn(
                        "p-2 rounded-lg transition-all",
                        appointmentData.service?.id === service.id
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      )}>
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      {appointmentData.service?.id === service.id && (
                        <CheckCircle2 className="w-5 h-5 text-teal-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm sm:text-base text-slate-900">
                        {service.name}
                      </h3>
                      <span className="font-bold text-sm sm:text-base text-teal-600">
                        {service.price} MAD
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && appointmentData.service && (
            <div className="space-y-3">
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 mb-1">Choisissez date & heure</h2>
                <p className="text-xs sm:text-sm text-slate-600">Sélectionnez une date puis choisissez un créneau horaire</p>
              </div>

              {/* Calendar */}
              <div className="w-full">
                <CalendarScheduler
                  timeSlots={availableSlots.length > 0 ? availableSlots.map(s => s.time) : []}
                  disabledDates={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today || date.getDay() === 0;
                  }}
                  onDateChange={(date) => {
                    handleDateSelect(date);
                  }}
                  onTimeSelect={(time) => {
                    const slot = availableSlots.find(s => s.time === time);
                    if (slot) {
                      handleTimeSlotSelect(slot);
                    }
                  }}
                  showButtons={false}
                />
              </div>

              {appointmentData.date && appointmentData.timeSlot && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <span className="font-semibold text-green-900">Rendez-vous sélectionné:</span>
                        <br />
                        <span className="text-green-800">
                          {format(appointmentData.date, "EEEE d MMMM yyyy", { locale: fr })} à{" "}
                          {appointmentData.timeSlot.time}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Patient Information */}
          {step === 3 && (
            <div className="space-y-3">
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 mb-1">Vos informations</h2>
                <p className="text-xs sm:text-sm text-slate-600">Remplissez vos coordonnées</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                    Nom complet *
                    {appointmentData.patientName && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </Label>
                  <Input
                    id="name"
                    value={appointmentData.patientName}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, patientName: e.target.value }))}
                    className="rounded-lg h-10 sm:h-11 text-sm"
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                    Téléphone *
                    {appointmentData.patientPhone && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={appointmentData.patientPhone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setAppointmentData(prev => ({ ...prev, patientPhone: formatted }));
                    }}
                    className="rounded-lg h-9 text-sm"
                    placeholder="06 12 34 56 78"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    Email (optionnel)
                    {appointmentData.patientEmail && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={appointmentData.patientEmail}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, patientEmail: e.target.value }))}
                    className="rounded-lg h-10 sm:h-11 text-sm"
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notes" className="text-sm font-medium">Notes (optionnel)</Label>
                  <Textarea
                    id="notes"
                    value={appointmentData.notes}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, notes: e.target.value }))}
                    className="rounded-xl text-sm"
                    placeholder="Informations supplémentaires..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-3">
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 mb-1">Confirmer la réservation</h2>
                <p className="text-xs sm:text-sm text-slate-600">Vérifiez les détails de votre rendez-vous</p>
              </div>

              <Card className="bg-gradient-to-br from-slate-50 to-blue-50/50 border-2 border-slate-200 shadow-lg">
                <CardContent className="p-4 sm:p-5 space-y-4">
                  {appointmentData.service && (
                    <div className="pb-4 border-b">
                      <div className="flex items-center gap-2 mb-2">
                        <Stethoscope className="w-4 h-4 text-slate-600" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">Service</span>
                      </div>
                      <div className="font-bold text-base sm:text-lg text-slate-900">{appointmentData.service.name}</div>
                      <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm text-slate-600">
                        <span>{appointmentData.service.duration}</span>
                        <Badge className="bg-teal-600">{appointmentData.service.price} MAD</Badge>
                      </div>
                    </div>
                  )}
                  
                  {appointmentData.date && appointmentData.timeSlot && (
                    <div className="pb-4 border-b">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-slate-600" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">Date et heure</span>
                      </div>
                      <div className="font-bold text-base sm:text-lg text-slate-900">
                        {format(appointmentData.date, "EEEE d MMMM yyyy", { locale: fr })}
                      </div>
                      <div className="text-sm sm:text-base text-slate-600 mt-1">à {appointmentData.timeSlot.time}</div>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-slate-600" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">Patient</span>
                    </div>
                    <div className="font-bold text-base sm:text-lg text-slate-900">{appointmentData.patientName}</div>
                    <div className="space-y-1.5 mt-2 text-xs sm:text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {appointmentData.patientPhone}
                      </div>
                      {appointmentData.patientEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {appointmentData.patientEmail}
                        </div>
                      )}
                    </div>
                    {appointmentData.notes && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="flex items-start gap-2">
                          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 mt-0.5" />
                          <div>
                            <span className="text-xs sm:text-sm font-medium text-slate-700">Notes:</span>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1">{appointmentData.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex-shrink-0 border-t bg-slate-50/80 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            {step > 1 && step <= 4 ? (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="h-10 sm:h-11 px-4 sm:px-5 text-sm rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Précédent
              </Button>
            ) : (
              <div></div>
            )}

            <div className="text-sm text-gray-500 font-medium">
              {step} / {totalSteps}
            </div>

            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="h-10 sm:h-11 px-5 sm:px-6 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-sm rounded-xl font-semibold"
              >
                Suivant
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleConfirm}
                disabled={!isStepValid() || isLoading}
                className="h-10 sm:h-11 px-5 sm:px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-sm rounded-xl font-semibold"
              >
                {isLoading ? (
                  <>Confirmation...</>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Confirmer
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
