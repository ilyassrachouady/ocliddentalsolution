import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Star, MapPin, Phone, Mail, ChevronLeft, ChevronRight, MessageCircle, Plus } from 'lucide-react';
import { Share2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DaySlot {
  day: string;
  date: number;
  month: string;
  available: boolean;
}

export default function BookingLandingPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ nom: '', prenom: '', tele: '' });
  const isFormValid = form.nom.trim() && form.prenom.trim() && form.tele.trim();
  const [resetKey, setResetKey] = useState(0);
  
  const today = useMemo(() => new Date(), []);
  const monthNames = useMemo(() => ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'], []);
  const todayMonth = monthNames[today.getMonth()];
  const todayDate = today.getDate();
  const todayYear = today.getFullYear();
  const currentHour = today.getHours();
  
  const [selectedDate, setSelectedDate] = useState<number | null>(todayDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(todayMonth);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  const isDateInPast = useCallback((month: string, date: number) => {
    const monthIndex = monthNames.indexOf(month);
    const compareDate = new Date(todayYear, monthIndex, date);
    const todayStart = new Date(todayYear, today.getMonth(), today.getDate());
    return compareDate < todayStart;
  }, [monthNames, todayYear, today]);

  const isMonthInPast = useCallback((month: string) => {
    const monthIndex = monthNames.indexOf(month);
    const currentMonthIndex = today.getMonth();
    return monthIndex < currentMonthIndex;
  }, [monthNames, today]);

  useEffect(() => {
    const generateDays = (month: string) => {
      const monthIndex = monthNames.indexOf(month);
      const year = todayYear;
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      
      const days: DaySlot[] = [];
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, monthIndex, i);
        const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        
        days.push({
          day: dayNames[date.getDay()],
          date: i,
          month: month.slice(0, 3),
          available: !isDateInPast(month, i)
        });
      }
      return days;
    };
    
    const allDays = generateDays(todayMonth);
    const todayIndex = allDays.findIndex(day => day.date === todayDate);
    if (todayIndex !== -1) {
      const weekIndex = Math.floor(todayIndex / 6);
      setCurrentWeekIndex(weekIndex);
    }
  }, [todayDate, todayMonth, todayYear, monthNames, isDateInPast]);

  const isTimeInPast = (timeString: string, date: number, month: string) => {
    if (date !== todayDate || month !== todayMonth) {
      return false;
    }
    const ampmMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    let hour: number | null = null;
    let minute = 0;
    if (ampmMatch) {
      hour = parseInt(ampmMatch[1], 10);
      minute = parseInt(ampmMatch[2], 10);
      const period = ampmMatch[3].toUpperCase();
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
    } else {
      const hhmm = timeString.match(/(\d{1,2}):(\d{2})/);
      if (!hhmm) return false;
      hour = parseInt(hhmm[1], 10);
      minute = parseInt(hhmm[2], 10);
    }

    if (hour === null) return false;
    const currentMinute = today.getMinutes();
    if (hour < currentHour) return true;
    if (hour > currentHour) return false;
    return minute <= currentMinute;
  };

  const generateDaysForMonth = (month: string) => {
    const monthIndex = monthNames.indexOf(month);
    const year = todayYear;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    
    const days: DaySlot[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, monthIndex, i);
      const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      const isPast = isDateInPast(month, i);
      
      days.push({
        day: dayNames[date.getDay()],
        date: i,
        month: month.slice(0, 3),
        available: !isPast
      });
    }
    return days;
  };

  const allDays = generateDaysForMonth(selectedMonth);
  const daysPerPage = 6;
  const totalWeeks = Math.ceil(allDays.length / daysPerPage);
  const visibleDays = allDays.slice(currentWeekIndex * daysPerPage, (currentWeekIndex + 1) * daysPerPage);

  const handlePrevWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeekIndex < totalWeeks - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    }
  };

  const dentist = {
    name: 'Dr. Emily Carter',
    specialty: 'Cardiologie | 12+ Années d\'Expérience',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    price: '250 DH',
    rating: 4.8,
    reviews: 230,
    patients: '200+',
    experience: '7 Ans',
    bio: 'Spécialiste en soins dentaires avec plus de 12 ans d\'expérience. Passionné par l\'innovation et le confort des patients.',
    address: '123 Avenue Mohammed V, Casablanca',
    phone: '+212600000000',
    email: 'dr.carter@dental.ma'
  };

  const patientReviews = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Service excellent ! Dr. Carter est très professionnelle et attentionnée.',
      date: 'Il y a 2 jours'
    },
    {
      name: 'Ahmed Benali',
      rating: 5,
      comment: 'Meilleur dentiste à Casablanca. Très satisfait du résultat.',
      date: 'Il y a 1 semaine'
    },
    {
      name: 'Maria Garcia',
      rating: 4,
      comment: 'Excellente expérience, je recommande vivement !',
      date: 'Il y a 2 semaines'
    }
  ];

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    for (let h = 9; h <= 12; h++) {
      slots.push({
        time: `${h.toString().padStart(2, '0')}:00`,
        available: !isTimeInPast(`${h.toString().padStart(2, '0')}:00`, selectedDate || todayDate, selectedMonth)
      });
      if (h !== 12) {
        slots.push({
          time: `${h.toString().padStart(2, '0')}:30`,
          available: !isTimeInPast(`${h.toString().padStart(2, '0')}:30`, selectedDate || todayDate, selectedMonth)
        });
      } else {
        slots.push({
          time: `12:30`,
          available: !isTimeInPast(`12:30`, selectedDate || todayDate, selectedMonth)
        });
      }
    }
    for (let h = 14; h <= 18; h++) {
      if (h === 14) {
        slots.push({
          time: `14:30`,
          available: !isTimeInPast(`14:30`, selectedDate || todayDate, selectedMonth)
        });
      } else {
        slots.push({
          time: `${h.toString().padStart(2, '0')}:00`,
          available: !isTimeInPast(`${h.toString().padStart(2, '0')}:00`, selectedDate || todayDate, selectedMonth)
        });
        slots.push({
          time: `${h.toString().padStart(2, '0')}:30`,
          available: !isTimeInPast(`${h.toString().padStart(2, '0')}:30`, selectedDate || todayDate, selectedMonth)
        });
      }
    }
    return slots;
  };
  const timeSlots = generateTimeSlots();
  const visibleTimeSlots = timeSlots;

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !isFormValid) {
      toast.error('Veuillez sélectionner une date, une heure et remplir le formulaire');
      return;
    }
    const phoneDigits = form.tele.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      toast.error('Le numéro de téléphone doit contenir exactement 10 chiffres');
      return;
    }
    setShowConfirm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20">
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-rose-500 rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center border-2 border-rose-300">
              <h2 className="text-2xl font-bold mb-2 text-white">Confirmation</h2>
              <p className="text-lg mb-4 text-center text-white">Votre rendez-vous est confirmé.<br/>Merci {form.prenom} {form.nom} !</p>
              <Button
                className="bg-white hover:bg-rose-50 text-rose-600 rounded-xl px-6 py-2 text-lg font-bold shadow-lg"
                onClick={() => {
                  setShowConfirm(false);
                  setForm({ nom: '', prenom: '', tele: '' });
                  setSelectedDate(today.getDate());
                  setSelectedTime(null);
                  setSelectedMonth(todayMonth);
                  const monthIndex = monthNames.indexOf(todayMonth);
                  const year = todayYear;
                  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
                  let weekIndex = 0;
                  for (let i = 1; i <= daysInMonth; i++) {
                    if (i === today.getDate()) {
                      weekIndex = Math.floor((i - 1) / 6);
                      break;
                    }
                  }
                  setCurrentWeekIndex(weekIndex);
                  setResetKey(k => k + 1);
                }}
              >
                OK
              </Button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
          <div className="lg:grid lg:grid-cols-[420px_1fr] lg:gap-8 xl:gap-12">
            
            <div className="lg:col-start-1 mb-8 lg:mb-0">
              <div className="lg:sticky lg:top-6">
                <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
                  <CardContent className="p-6 lg:p-8">
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative">
                        <Avatar className="h-32 w-32 lg:h-40 lg:w-40 ring-4 ring-white shadow-2xl">
                          <AvatarImage src={dentist.image} className="object-cover" />
                          <AvatarFallback className="text-5xl bg-gradient-to-br from-blue-300 to-blue-600 text-white font-bold">
                            {dentist.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-[#31afd4] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                          <span>✓</span> Vérifié
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <h1 className="text-3xl lg:text-4xl font-black mb-2 text-white leading-tight">{dentist.name}</h1>
                      <p className="text-base lg:text-lg text-blue-100 font-semibold mb-3">{dentist.specialty}</p>
                      
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        <span className="bg-white/20 backdrop-blur-sm text-white rounded-full px-4 py-1.5 text-sm font-semibold">
                          Cabinet moderne
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm text-white rounded-full px-4 py-1.5 text-sm font-semibold">
                          Prise d'urgence
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                          <div className="text-2xl font-bold text-white">{dentist.rating}</div>
                          <div className="text-xs text-blue-100">Note</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                          <div className="text-2xl font-bold text-white">{dentist.patients}</div>
                          <div className="text-xs text-blue-100">Patients</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                          <div className="text-2xl font-bold text-white">{dentist.experience}</div>
                          <div className="text-xs text-blue-100">Expérience</div>
                        </div>
                      </div>

                      <p className="text-sm text-blue-50 leading-relaxed mb-6">{dentist.bio}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-3 justify-center">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dentist.address)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition flex items-center justify-center"
                        >
                          <MapPin className="h-6 w-6 text-white" />
                        </a>
                        <a 
                          href={`https://wa.me/${dentist.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition flex items-center justify-center"
                        >
                          <MessageCircle className="h-6 w-6 text-white" />
                        </a>
                        <a 
                          href={`mailto:${dentist.email}`}
                          className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition flex items-center justify-center"
                        >
                          <Mail className="h-6 w-6 text-white" />
                        </a>
                      </div>

                      <button
                        onClick={async () => {
                          const url = window.location.href;
                        try {
                          await navigator.clipboard.writeText(url);
                          toast.success('✓ Lien copié !');
                        } catch {
                          const tempInput = document.createElement('input');
                          tempInput.value = url;
                          document.body.appendChild(tempInput);
                          tempInput.select();
                          document.execCommand('copy');
                          document.body.removeChild(tempInput);
                          toast.success('✓ Lien copié !');
                        }
                        }}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 px-4 py-3 font-bold transition-all shadow-lg"
                      >
                        <Share2 className="h-5 w-5" />
                        <span>Partager ce lien</span>
                      </button>

                      <a 
                        href={`tel:${dentist.phone}`}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#31afd4] hover:bg-blue-400 text-white px-4 py-3 font-bold transition-all shadow-lg"
                      >
                        <Phone className="h-5 w-5" />
                        <span>Appeler maintenant</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="lg:col-start-2 space-y-6">
              
              <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                <CardContent className="p-6 lg:p-8">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">Prendre Rendez-vous</h2>
                      <p className="text-base text-slate-500">Choisissez votre créneau</p>
                    </div>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="w-full sm:w-[180px] h-11 text-lg font-semibold border-slate-200">
                        <Calendar className="h-5 w-5 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {monthNames.map(month => (
                          <SelectItem 
                            key={month} 
                            value={month} 
                            disabled={isMonthInPast(month)}
                            className="text-lg py-2"
                          >
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl lg:text-2xl font-bold text-slate-900">Sélectionner la date</h3>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handlePrevWeek} 
                          disabled={currentWeekIndex === 0}
                          className="h-9 w-9 p-0 rounded-lg"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleNextWeek} 
                          disabled={currentWeekIndex === totalWeeks - 1}
                          className="h-9 w-9 p-0 rounded-lg"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {visibleDays.map((day, index) => (
                        <button
                          key={index}
                          onClick={() => day.available && setSelectedDate(day.date)}
                          disabled={!day.available}
                          className={`rounded-xl p-3 text-center transition-all ${
                            selectedDate === day.date
                              ? 'bg-[#31afd4] text-white shadow-lg scale-105'
                              : day.available
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-102'
                              : 'bg-red-50 text-red-300 cursor-not-allowed opacity-60'
                          }`}
                        >
                          <div className="text-xs font-medium mb-1">{day.day}</div>
                          <div className="text-2xl font-bold">{day.date}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4">Sélectionner l'heure</h3>
                    
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {visibleTimeSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`rounded-xl py-3 px-2 text-base font-semibold transition-all ${
                            selectedTime === slot.time
                              ? 'bg-[#31afd4] text-white shadow-lg scale-105'
                              : slot.available
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-102'
                              : 'bg-red-50 text-red-300 cursor-not-allowed opacity-60'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedDate && selectedTime && (
                    <>
                      <div className="w-full flex justify-center my-6">
                        <div className="w-3/4 border-t-2 border-slate-200"></div>
                      </div>
                      
                      <div key={resetKey} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Nom"
                            className="border-2 border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#31afd4] transition"
                            value={form.nom}
                            onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                          />
                          <input
                            type="text"
                            placeholder="Prénom"
                            className="border-2 border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#31afd4] transition"
                            value={form.prenom}
                            onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
                          />
                        </div>
                        <input
                          type="tel"
                          placeholder="Téléphone (10 chiffres)"
                          className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#31afd4] transition"
                          value={form.tele}
                          onChange={e => setForm(f => ({ ...f, tele: e.target.value }))}
                        />
                        <Button
                          onClick={handleBooking}
                          className="w-full bg-[#31afd4] hover:bg-[#2696b6] text-white rounded-xl h-14 text-xl font-bold shadow-lg transition-all hover:shadow-xl"
                          disabled={!(selectedDate && selectedTime && isFormValid)}
                        >
                          Confirmer le rendez-vous
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-900">Avis Patients</h3>
                    <div className="flex items-center gap-2">
                      <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                      <span className="text-xl font-bold text-slate-900">{dentist.rating}</span>
                      <span className="text-base text-slate-500">({dentist.reviews})</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {patientReviews.map((review, index) => (
                      <div key={index} className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-slate-900 text-base">{review.name}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < review.rating 
                                      ? 'text-yellow-500 fill-yellow-500' 
                                      : 'text-slate-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-slate-500">{review.date}</span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Button
                      className="w-full flex items-center justify-center gap-2 bg-[#31afd4] hover:bg-[#2696b6] text-white rounded-xl py-4 text-base font-semibold shadow-lg transition-all"
                      onClick={() => {
                        const reviewText = prompt("Votre avis (laissez vide pour annuler):");
                        if (reviewText && reviewText.trim()) {
                          alert("Merci pour votre avis ! Il sera publié après vérification.");
                        }
                      }}
                    >
                      <Plus className="h-5 w-5" />
                      Ajouter un avis
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm hover:shadow-xl transition">
                <CardContent className="p-0">
                  <Button
                    className="w-full flex items-center justify-center gap-3 text-slate-700 bg-transparent hover:bg-slate-50 px-6 py-5 h-auto rounded-2xl"
                    onClick={() => window.open('https://www.google.com/search?q=' + encodeURIComponent(dentist.name + ' ' + dentist.address), '_blank')}
                  >
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    <p className="text-base font-semibold">Laisser un avis Google</p>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  );
}