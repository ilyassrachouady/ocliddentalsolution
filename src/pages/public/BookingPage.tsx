import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { api } from '@/lib/api';
import { Dentist } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Clock, MapPin, Phone, Mail, CheckCircle2, Star, Share2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookingLoadingState } from '@/components/ui/loading';
import { AppleBookingFlow } from '@/components/booking';

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const [dentist, setDentist] = useState<Dentist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reviewCarouselIndex, setReviewCarouselIndex] = useState(0);
  
  // Form fields
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadDentist();
  }, [id]);

  useEffect(() => {
    if (selectedDate && dentist) {
      loadAvailableSlots();
    }
  }, [selectedDate, dentist]);

  const loadDentist = async () => {
    if (!id) return;
    try {
      const data = await api.getDentist(id);
      setDentist(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des informations');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedDate || !dentist) return;
    try {
      const slots = await api.getAvailableSlots(dentist.id, selectedDate);
      setAvailableSlots(slots);
      setSelectedTime('');
    } catch (error) {
      toast.error('Erreur lors du chargement des créneaux');
    }
  };

  const handleBooking = async () => {
    if (!dentist || !selectedDate || !selectedTime || !selectedService || !patientName || !patientPhone) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsBooking(true);
    try {
      await api.bookAppointment({
        dentistId: dentist.id,
        serviceId: selectedService,
        date: selectedDate.toISOString(),
        time: selectedTime,
        patientName,
        patientPhone,
        patientEmail: patientEmail || undefined,
        notes: notes || undefined,
      });

      setShowSuccess(true);
      toast.success('Rendez-vous réservé avec succès!');
    } catch (error) {
      toast.error('Erreur lors de la réservation');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return <BookingLoadingState />;
  }

  if (!dentist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Dentiste non trouvé</div>
      </div>
    );
  }

  const selectedServiceData = dentist.services.find(s => s.id === selectedService);

  // Review carousel handlers
  const handleNextReview = () => {
    if (!dentist?.reviews) return;
    setReviewCarouselIndex((prev) => (prev + 1) % dentist.reviews!.length);
  };

  const handlePrevReview = () => {
    if (!dentist?.reviews) return;
    setReviewCarouselIndex((prev) => (prev - 1 + dentist.reviews!.length) % dentist.reviews!.length);
  };

  const currentReview = dentist?.reviews?.[reviewCarouselIndex];
  const avgRating = dentist?.reviews
    ? (dentist.reviews.reduce((sum, r) => sum + r.rating, 0) / dentist.reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-screen-2xl mx-auto p-4 md:p-6 lg:p-8">
        {/* PREMIUM DENTIST HERO CARD */}
        <div className="relative mb-8 overflow-hidden rounded-3xl shadow-2xl border-0">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 opacity-95"></div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-overlay blur-3xl"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-8 md:p-12 lg:p-16">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Avatar with enhanced styling */}
              <div className="relative flex-shrink-0">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-2xl"></div>
                <Avatar className="relative h-36 w-36 md:h-48 md:w-48 ring-4 ring-white shadow-2xl">
                    <AvatarImage src={dentist?.photo} className="object-cover" />
                  <AvatarFallback className="text-6xl bg-gradient-to-br from-blue-300 to-blue-600 text-white font-bold">
                    {dentist?.name.charAt(0) || 'D'}
                  </AvatarFallback>
                </Avatar>
                
                {/* Verified badge */}
                <div className="absolute bottom-2 right-2 bg-green-400 text-green-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <span>✓</span> Vérifiés
                </div>
              </div>

              {/* Dentist Info - Enhanced Layout */}
              <div className="flex-1 text-white">
                <div className="space-y-4">
                  {/* Name & Title */}
                  <div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 leading-tight">
                      {dentist?.name}
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 font-semibold">{dentist?.specialty}</p>
                  </div>

                  {/* Bio - Prominent placement */}
                  {dentist?.bio && (
                    <p className="text-blue-50 leading-relaxed text-sm md:text-base max-w-2xl">
                      {dentist.bio}
                    </p>
                  )}

                  {/* Trust Badges - NEW */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-1 text-xs font-semibold">
                      <span>⭐ {avgRating}/5 — {dentist?.reviews?.length} avis</span>
                    </Badge>
                    <Badge className="bg-white/20 text-white rounded-full px-4 py-1 text-xs font-semibold border border-white/30">
                      Cabinet moderne
                    </Badge>
                    <Badge className="bg-white/20 text-white rounded-full px-4 py-1 text-xs font-semibold border border-white/30">
                      Prise d'urgence
                    </Badge>
                  </div>

                  {/* Contact Info - Refined */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                      <MapPin className="h-5 w-5 flex-shrink-0 text-blue-200" />
                      <div className="text-xs leading-tight">
                        <div className="text-white/70">Adresse</div>
                        <div className="font-semibold">{dentist?.city}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                      <Phone className="h-5 w-5 flex-shrink-0 text-blue-200" />
                      <div className="text-xs leading-tight">
                        <div className="text-white/70">Téléphone</div>
                        <div className="font-semibold">{dentist?.phone}</div>
                      </div>
                    </div>
                    {dentist?.email && (
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                        <Mail className="h-5 w-5 flex-shrink-0 text-blue-200" />
                        <div className="text-xs leading-tight">
                          <div className="text-white/70">Email</div>
                          <div className="font-semibold truncate">{dentist.email}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Share CTA - Enhanced */}
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(window.location.href);
                          toast.success('✓ Lien copié! Idéal pour Instagram & WhatsApp');
                        } catch (e) {
                          toast.error('Impossible de copier le lien');
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
                    >
                      <Share2 className="h-5 w-5" />
                      <span>Partager ce lien</span>
                    </button>
                    <a
                      href={`tel:${dentist?.phone}`}
                      className="inline-flex items-center gap-2 rounded-full bg-blue-500 hover:bg-blue-400 text-white px-6 py-2.5 font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
                    >
                      <Phone className="h-5 w-5" />
                      <span>Appeler</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN BOOKING SECTION - Apple Style */}
        <AppleBookingFlow 
          onComplete={(booking) => {
            toast.success('Rendez-vous confirmé avec succès!');
            // Handle successful booking - could show success modal, redirect, etc.
          }}
        />

        {/* REVIEWS SECTION */}
        <div className="mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2"></div>
            {/* Service Selection Card */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Service</CardTitle>
                <CardDescription>Quel service recherchez-vous?</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="rounded-xl h-12 text-base">
                    <SelectValue placeholder="Sélectionnez un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {dentist?.services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{service.name}</span>
                          <span className="text-sm text-gray-500">({service.duration}min)</span>
                          <span className="font-bold text-blue-600 ml-2">{service.price} MAD</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Calendar & Time Selection */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Date et heure</CardTitle>
                <CardDescription>Choisissez un créneau qui vous convient</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-gray-100 rounded-xl overflow-hidden">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="!p-0 !shadow-none !bg-transparent"
                  />
                </div>

                {selectedDate && availableSlots.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Créneaux disponibles</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedTime === slot ? 'default' : 'outline'}
                          className={cn(
                            'rounded-lg h-11 font-medium transition-all',
                            selectedTime === slot
                              ? 'bg-green-600 hover:bg-green-700 text-white shadow-md'
                              : 'border-2 border-green-200 bg-green-50 hover:border-green-300 hover:bg-green-100 text-gray-700'
                          )}
                          onClick={() => setSelectedTime(slot)}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDate && availableSlots.length === 0 && (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    Aucun créneau disponible pour cette date. Essayez une autre date.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Patient Info - Enhanced Form */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                <CardTitle className="text-2xl">Vos informations</CardTitle>
                <CardDescription>Nous vous contacterons avec ces coordonnées</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 font-semibold text-gray-700">
                    Nom complet
                    {patientName && <span className="text-green-500">✓</span>}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className={cn(
                        'rounded-xl h-12 text-base transition-all border-2 focus:ring-0',
                        patientName
                          ? 'border-green-300 bg-green-50 focus:border-green-500'
                          : 'border-gray-200 focus:border-blue-500'
                      )}
                      placeholder="Ex: Ahmed Benali"
                    />
                    {patientName && (
                      <Check className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 font-semibold text-gray-700">
                    Téléphone
                    {patientPhone && <span className="text-green-500">✓</span>}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className={cn(
                        'rounded-xl h-12 text-base transition-all border-2 focus:ring-0',
                        patientPhone
                          ? 'border-green-300 bg-green-50 focus:border-green-500'
                          : 'border-gray-200 focus:border-blue-500'
                      )}
                      placeholder="+212 6 12 34 56 78"
                    />
                    {patientPhone && (
                      <Check className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 font-semibold text-gray-700">
                    Email
                    {patientEmail && <span className="text-green-500">✓</span>}
                    <span className="text-gray-400 text-xs">(optionnel)</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="rounded-xl h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all"
                    placeholder="votre@email.com"
                  />
                </div>

                {/* Notes Field */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="font-semibold text-gray-700">
                    Notes
                    <span className="text-gray-400 text-xs ml-2">(optionnel)</span>
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all"
                    placeholder="Ex: Je suis nouveau patient, souci particulier à mentionner..."
                    rows={3}
                  />
                </div>

                {/* Submit Button - Enhanced */}
                <Button
                  onClick={handleBooking}
                  disabled={isBooking || !selectedDate || !selectedTime || !selectedService || !patientName || !patientPhone}
                  className={cn(
                    'w-full rounded-xl h-14 text-base font-bold shadow-lg transition-all transform duration-200',
                    isBooking || !selectedDate || !selectedTime || !selectedService || !patientName || !patientPhone
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:scale-105 active:scale-95'
                  )}
                >
                  {isBooking ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Réservation en cours...
                    </span>
                  ) : (
                    '✓ Confirmer ma réservation'
                  )}
                </Button>
                
                {/* Confidence message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center text-sm text-blue-700">
                  <p>🔒 Vos données sont sécurisées et ne seront partagées que pour votre rendez-vous</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Services & Reviews Preview */}
          <div className="space-y-6">
            {/* Services Quick View - Enhanced */}
            <Card className="shadow-lg border-0 sticky top-4">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                <CardTitle className="text-xl">Services & Tarifs</CardTitle>
                <CardDescription className="text-xs">Cliquez pour sélectionner</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {dentist?.services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={cn(
                        'p-4 rounded-lg border-2 cursor-pointer transition-all transform duration-200 hover:shadow-md',
                        selectedService === service.id
                          ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md scale-105'
                          : 'border-gray-100 hover:border-blue-300 hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-900">{service.name}</div>
                          {service.description && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {service.description}
                            </div>
                          )}
                        </div>
                        {selectedService === service.id && (
                          <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration} min
                        </span>
                        <span className="font-bold text-blue-600 text-base">{service.price} MAD</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Carousel - Enhanced (sticky + scrollable) */}
            {dentist?.reviews && dentist.reviews.length > 0 && (
              <Card className="shadow-lg border-0 overflow-hidden sticky top-4">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Avis des patients</CardTitle>
                      <CardDescription>Vrais patients, vrais témoignages</CardDescription>
                    </div>
                    <div className="bg-white rounded-full px-3 py-1 shadow-sm">
                      <span className="text-xs font-bold text-blue-600">{dentist.reviews.length} avis</span>
                    </div>
                  </div>
                </CardHeader>
                {/* Make review content scrollable so it stays in view while the page scrolls */}
                <CardContent className="p-0">
                  <div className="max-h-[60vh] overflow-y-auto">
                    {/* Review Card - Animated */}
                    <div className="relative bg-gradient-to-br from-white to-blue-50 p-6 min-h-[240px] flex flex-col justify-between">
                      {/* Star Rating - Animated */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'h-5 w-5 transition-all duration-300',
                                i < (currentReview?.rating || 0)
                                  ? 'fill-yellow-400 text-yellow-400 scale-110'
                                  : 'text-gray-200'
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-gray-700 ml-2">{currentReview?.rating}/5</span>
                      </div>

                      {/* Review Comment - with animated quotes */}
                      <div className="flex-1">
                        <div className="text-3xl text-blue-300 opacity-30 font-serif mb-1">"</div>
                        <p className="text-base font-medium text-gray-800 leading-relaxed">
                          {currentReview?.comment}
                        </p>
                      </div>

                      {/* Reviewer Info - Enhanced */}
                      <div className="mt-6 pt-4 border-t border-blue-100">
                        <p className="font-bold text-gray-900">{currentReview?.name}</p>
                        <p className="text-xs text-gray-500">
                          {currentReview?.date && format(new Date(currentReview.date), 'dd MMMM yyyy', { locale: fr })}
                        </p>
                      </div>

                      {/* Carousel Navigation - Improved */}
                      {dentist.reviews.length > 1 && (
                        <div className="flex items-center justify-between mt-6">
                          <button
                            onClick={handlePrevReview}
                            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95"
                            aria-label="Avis précédent"
                          >
                            <ChevronLeft className="h-5 w-5 text-blue-600" />
                          </button>
                          
                          {/* Animated progress dots */}
                          <div className="flex items-center gap-2">
                            {dentist.reviews.map((_, idx) => (
                              <div
                                key={idx}
                                onClick={() => setReviewCarouselIndex(idx)}
                                className={cn(
                                  'h-2 rounded-full cursor-pointer transition-all duration-300',
                                  idx === reviewCarouselIndex 
                                    ? 'w-8 bg-blue-600' 
                                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                                )}
                              ></div>
                            ))}
                          </div>
                          
                          <button
                            onClick={handleNextReview}
                            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95"
                            aria-label="Avis suivant"
                          >
                            <ChevronRight className="h-5 w-5 text-blue-600" />
                          </button>
                        </div>
                      )}

                      {/* Review Navigation Info */}
                      <div className="bg-blue-50 px-6 py-3 border-t text-center">
                        <p className="text-xs font-semibold text-gray-600">
                          Avis {reviewCarouselIndex + 1} sur {dentist.reviews.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Success Dialog - Enhanced */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-green-50 to-white">
          <DialogHeader className="text-center">
            {/* Success Animation */}
            <div className="flex justify-center mb-6">
              <div className="relative inline-flex">
                <div className="absolute inset-0 bg-green-200 rounded-full blur-xl animate-pulse"></div>
                <div className="relative rounded-full bg-green-100 p-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600 animate-bounce" />
                </div>
              </div>
            </div>
            <DialogTitle className="text-3xl font-bold text-gray-900">
              Rendez-vous confirmé! 🎉
            </DialogTitle>
            <DialogDescription className="text-base text-gray-700 mt-2">
              Nous avons bien reçu votre demande et vous enverrons une confirmation par WhatsApp.
            </DialogDescription>
          </DialogHeader>

          {/* Booking Summary */}
          <div className="mt-6 bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-gray-600">📅 Date:</span>
                <span className="font-semibold">{selectedDate && format(selectedDate, 'EEEE d MMMM', { locale: fr })}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600">🕐 Heure:</span>
                <span className="font-semibold">{selectedTime}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600">💼 Service:</span>
                <span className="font-semibold">{selectedServiceData?.name}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600">👤 Patient:</span>
                <span className="font-semibold">{patientName}</span>
              </div>
              <div className="pt-3 border-t border-blue-200 flex justify-between items-start">
                <span className="text-gray-600 font-semibold">💰 Prix:</span>
                <span className="font-bold text-2xl text-blue-600">{selectedServiceData?.price} MAD</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-6 space-y-3">
            <p className="text-xs text-gray-500 text-center">
              ✓ Un message WhatsApp vous sera envoyé avec la confirmation
            </p>
            
            <Button
              onClick={() => {
                window.open(`https://wa.me/212${patientPhone.replace(/\D/g, '').slice(2)}?text=Confirmation: Rendez-vous avec ${dentist?.name} le ${selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: fr })} à ${selectedTime}`, '_blank');
              }}
              className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white h-12 font-bold shadow-lg"
            >
              💬 Envoyer à WhatsApp
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setShowSuccess(false);
              }}
              className="w-full rounded-xl h-12 font-semibold"
            >
              ✓ Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

