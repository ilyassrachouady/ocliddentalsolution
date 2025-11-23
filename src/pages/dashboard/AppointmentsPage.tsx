import { Eye, Users, TrendingUp, Clock, Phone, Mail, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Appointment, Patient, AppointmentStatus } from '@/types';
import { format, isToday, isPast, isFuture, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, isSameDay, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ModernAppointmentModalV2 } from '@/components/ui/modern-appointment-modal-v2';
import { toast } from 'sonner';
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, List, CheckCircle2, XCircle, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'today' | 'upcoming' | 'past';

interface ModernCalendarProps {
  appointments: Appointment[];
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

function ModernCalendar({ appointments, onDateSelect, selectedDate }: ModernCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const firstDayOfWeek = getDay(monthStart);
  const prevMonthDays = Array(firstDayOfWeek).fill(null).map((_, i) => addDays(monthStart, -(firstDayOfWeek - i)));
  const allDays = [...prevMonthDays, ...calendarDays];
  
  const remainingDays = 42 - allDays.length;
  const nextMonthDays = Array(remainingDays).fill(null).map((_, i) => addDays(monthEnd, i + 1));
  const gridDays = [...allDays, ...nextMonthDays];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date).toISOString().split('T')[0];
      return aptDate === dateStr;
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => addDays(startOfMonth(prev), -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addDays(endOfMonth(prev), 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevMonth}
          className="h-12 w-12 p-0 rounded-2xl bg-white/50 backdrop-blur-sm hover:bg-white/80 shadow-lg border border-white/30"
        >
          <ChevronLeft className="h-6 w-6 text-slate-700" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-900">
          {format(currentMonth, "MMMM yyyy", { locale: fr })}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextMonth}
          className="h-12 w-12 p-0 rounded-2xl bg-white/50 backdrop-blur-sm hover:bg-white/80 shadow-lg border border-white/30"
        >
          <ChevronRight className="h-6 w-6 text-slate-700" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map(day => (
          <div key={day} className="text-center text-sm font-bold text-slate-600 h-10 flex items-center justify-center bg-white/50 rounded-xl backdrop-blur-sm">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {gridDays.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isPastDate = isBefore(day, today);
          const isTodayDate = isSameDay(day, today);
          const dayAppointments = getAppointmentsForDate(day);
          const hasAppointments = dayAppointments.length > 0;

          return (
            <button
              key={index}
              onClick={() => onDateSelect(day)}
              className={cn(
                "h-12 rounded-2xl font-semibold text-sm transition-all duration-300 relative group",
                isCurrentMonth ? "text-slate-900" : "text-slate-400",
                isSelected && "bg-gradient-to-br from-blue-500 to-teal-600 text-white shadow-xl ring-4 ring-blue-200 transform scale-110",
                !isSelected && isTodayDate && "bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg ring-2 ring-orange-200",
                !isSelected && !isTodayDate && hasAppointments && isCurrentMonth && "bg-gradient-to-br from-green-400 to-teal-500 text-white shadow-lg hover:shadow-xl hover:scale-105",
                !isSelected && !isTodayDate && !hasAppointments && isCurrentMonth && !isPastDate && "bg-white/60 backdrop-blur-sm hover:bg-white/80 text-slate-700 shadow-sm hover:shadow-lg hover:scale-105",
                isPastDate && !isTodayDate && "opacity-40 cursor-not-allowed",
              )}
              disabled={isPastDate && !isTodayDate}
            >
              <div className="flex flex-col items-center">
                <span>{format(day, "d")}</span>
                {hasAppointments && (
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full mt-0.5",
                    isSelected || isTodayDate ? "bg-white" : "bg-white/80"
                  )} />
                )}
              </div>
              
              {hasAppointments && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {dayAppointments.length}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500"></div>
          <span className="text-slate-600 font-medium">Aujourd'hui</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg bg-gradient-to-br from-green-400 to-teal-500"></div>
          <span className="text-slate-600 font-medium">RDV programmés</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg bg-gradient-to-br from-blue-500 to-teal-600"></div>
          <span className="text-slate-600 font-medium">Date sélectionnée</span>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const { dentist } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dentist]);

  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, appointments]);

  const loadData = async () => {
    if (!dentist) return;
    setIsLoading(true);
    try {
      const [apptsData, patientsData] = await Promise.all([
        api.getAppointments(dentist.id),
        api.getPatients(dentist.id),
      ]);
      setAppointments(apptsData);
      setPatients(patientsData);
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = [...appointments];
    switch (filter) {
      case 'today':
        filtered = filtered.filter(apt => isToday(new Date(apt.date)));
        break;
      case 'upcoming':
        filtered = filtered.filter(apt => isFuture(new Date(apt.date)));
        break;
      case 'past':
        filtered = filtered.filter(apt => isPast(new Date(apt.date)) && !isToday(new Date(apt.date)));
        break;
    }
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return a.time.localeCompare(b.time);
    });
    setFilteredAppointments(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
      confirmed: { icon: <CheckCircle2 className="h-4 w-4" />, label: 'Confirmé', className: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg border-0 rounded-full px-3 py-1.5 font-semibold' },
      pending: { icon: <Timer className="h-4 w-4" />, label: 'En attente', className: 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg border-0 rounded-full px-3 py-1.5 font-semibold' },
      completed: { icon: <CheckCircle2 className="h-4 w-4" />, label: 'Terminé', className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border-0 rounded-full px-3 py-1.5 font-semibold' },
      cancelled: { icon: <XCircle className="h-4 w-4" />, label: 'Annulé', className: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg border-0 rounded-full px-3 py-1.5 font-semibold' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}><div className="flex items-center gap-1.5">{config.icon}{config.label}</div></Badge>;
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!dentist) return;
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: newStatus as AppointmentStatus } : apt));
    try {
      await api.updateAppointment(id, { status: newStatus as AppointmentStatus, dentistId: dentist.id });
      toast.success('Statut mis à jour');
      await loadData();
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Erreur lors de la mise à jour');
      await loadData();
    }
  };

  const todayAppointments = appointments.filter(apt => isToday(new Date(apt.date)));
  const upcomingAppointments = appointments.filter(apt => isFuture(new Date(apt.date)));
  const confirmedToday = todayAppointments.filter(apt => apt.status === 'confirmed');

  return (
    <div className="space-y-3 md:space-y-5">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 rounded-xl md:rounded-2xl opacity-95"></div>
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-5 lg:p-7 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-20 md:-translate-y-28 translate-x-20 md:translate-x-28"></div>
          <div className="absolute bottom-0 left-0 w-28 h-28 md:w-40 md:h-40 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-14 md:translate-y-20 -translate-x-14 md:-translate-x-20"></div>
          
          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2.5 md:gap-5">
            <div className="space-y-1.5 md:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight">Planning & Rendez-vous</h1>
                  <p className="text-blue-100 mt-0.5 md:mt-1 text-xs sm:text-sm lg:text-base xl:text-lg font-medium">
                    Gérez votre planning et vos consultations en toute simplicité
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 md:gap-2 text-blue-100 text-[10px] sm:text-xs">
                <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="font-medium">
                  {format(new Date(), 'EEEE dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 rounded-lg md:rounded-xl px-3 py-1.5 md:px-5 md:py-2.5 h-auto font-semibold text-xs md:text-sm lg:text-base transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="mr-1 md:mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4" />
                Nouveau RDV
              </Button>
              
              <ModernAppointmentModalV2
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                dentistId={dentist?.id}
                services={dentist?.services?.map(s => ({
                  id: s.id,
                  name: s.name,
                  description: s.description,
                  duration: '30 min',
                  price: s.price.toString()
                }))}
                onConfirm={(data) => {
                  // Créer le rendez-vous avec les données
                  console.log('Rendez-vous confirmé:', data);
                  loadData();
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: "Aujourd'hui", value: todayAppointments.length, sub: `${confirmedToday.length} confirmés`, icon: CalendarIcon, color: "blue" },
          { title: "À venir", value: upcomingAppointments.length, sub: "Prochains RDV", icon: Timer, color: "teal" },
          { title: "Patients uniques", value: patients.length, sub: "Patients actifs", icon: Users, color: "green" },
          { title: "Total RDV", value: appointments.length, sub: "Tous les temps", icon: TrendingUp, color: "purple" }
        ].map(stat => (
          <Card key={stat.title} className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className={`text-xs text-${stat.color}-600 font-medium mt-1`}>{stat.sub}</p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl flex items-center justify-center`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="border-b-0 bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                Planning des consultations
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg">
                {filteredAppointments.length} rendez-vous
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/50">
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className={cn("h-10 px-4 rounded-xl font-medium transition-all duration-300", viewMode === 'list' && "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg transform scale-105")}>
                  <List className="h-4 w-4 mr-2" /> Liste
                </Button>
                <Button variant={viewMode === 'calendar' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('calendar')} className={cn("h-10 px-4 rounded-xl font-medium transition-all duration-300", viewMode === 'calendar' && "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg transform scale-105")}>
                  <CalendarIcon className="h-4 w-4 mr-2" /> Calendrier
                </Button>
              </div>
              
              <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
                <SelectTrigger className="w-full sm:w-[200px] h-12 rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-lg font-medium">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-600" />
                    <SelectValue placeholder="Filtrer par..." />
                  </div>
                </SelectTrigger>
                <SelectContent className="border-0 shadow-xl rounded-2xl">
                  <SelectItem value="all" className="rounded-xl">Tous les RDV</SelectItem>
                  <SelectItem value="today" className="rounded-xl">Aujourd'hui</SelectItem>
                  <SelectItem value="upcoming" className="rounded-xl">À venir</SelectItem>
                  <SelectItem value="past" className="rounded-xl">Passés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {viewMode === 'calendar' ? (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              <div className="xl:col-span-5">
                <div className="bg-gradient-to-br from-blue-50/50 to-teal-50/30 rounded-3xl p-6 border border-blue-100/50">
                  <ModernCalendar appointments={appointments} onDateSelect={setSelectedDate} selectedDate={selectedDate} />
                </div>
              </div>

              <div className="xl:col-span-7">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {selectedDate ? format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr }) : 'Sélectionnez une date'}
                    </h3>
                    {selectedDate && <Badge className="bg-gradient-to-r from-blue-500 to-teal-600 text-white rounded-full px-4 py-2 text-sm font-medium">{`${appointments.filter(apt => isSameDay(new Date(apt.date), selectedDate)).length} RDV`}</Badge>}
                  </div>
                  
                  {selectedDate ? (
                    (() => {
                      const dayAppointments = appointments.filter(apt => isSameDay(new Date(apt.date), selectedDate)).sort((a, b) => a.time.localeCompare(b.time));
                      return dayAppointments.length === 0 ? (
                        <div className="text-center py-16">
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"><CalendarIcon className="h-12 w-12 text-blue-600" /></div>
                          <h3 className="text-xl font-bold text-slate-900 mb-3">Aucun rendez-vous</h3>
                          <p className="text-slate-600 text-lg">Aucun rendez-vous pour cette date</p>
                          <Button onClick={() => setShowAddDialog(true)} className="mt-6 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-2xl px-6 py-3 h-auto font-semibold"><Plus className="mr-2 h-5 w-5" />Ajouter un RDV</Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {dayAppointments.map(apt => (
                            <Card key={apt.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group bg-gradient-to-r from-white to-blue-50/30">
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg"><Clock className="h-4 w-4" />{apt.time}</div>
                                      {getStatusBadge(apt.status)}
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">{patients.find(p => p.id === apt.patientId)?.name.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}</div>
                                      <div>
                                        <div className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors">{patients.find(p => p.id === apt.patientId)?.name || apt.patientId}</div>
                                        <div className="text-slate-600 flex items-center gap-4 text-sm">{patients.find(p => p.id === apt.patientId)?.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{patients.find(p => p.id === apt.patientId)?.phone}</span>}</div>
                                      </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-4">
                                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-1"><Stethoscope className="h-4 w-4" /><span className="font-medium">Service</span></div>
                                      <div className="font-semibold text-slate-900">{dentist?.services.find(s => s.id === apt.serviceId)?.name || 'N/A'}</div>
                                    </div>
                                    {apt.notes && <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100"><div className="text-sm text-blue-600 font-medium mb-1">Notes</div><div className="text-slate-700">{apt.notes}</div></div>}
                                  </div>
                                  <div className="flex flex-col gap-3">
                                    <Select value={apt.status} onValueChange={v => handleStatusChange(apt.id, v)}>
                                      <SelectTrigger className="w-[160px] rounded-2xl border-0 shadow-lg"><SelectValue /></SelectTrigger>
                                      <SelectContent className="border-0 shadow-xl rounded-2xl"><SelectItem value="pending" className="rounded-xl"><div className="flex items-center gap-2"><Timer className="h-4 w-4 text-orange-500" />En attente</div></SelectItem><SelectItem value="confirmed" className="rounded-xl"><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Confirmé</div></SelectItem><SelectItem value="completed" className="rounded-xl"><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" />Terminé</div></SelectItem><SelectItem value="cancelled" className="rounded-xl"><div className="flex items-center gap-2"><XCircle className="h-4 w-4 text-red-500" />Annulé</div></SelectItem></SelectContent>
                                    </Select>
                                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-2xl h-10 w-10 p-0 shadow-lg hover:shadow-xl transition-all" onClick={() => navigate(`/dashboard/patients/${patients.find(p => p.id === apt.patientId)?.id}`)}><Eye className="h-5 w-5" /></Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-16"><div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6"><CalendarIcon className="h-12 w-12 text-slate-400" /></div><h3 className="text-xl font-semibold text-slate-900 mb-3">Sélectionnez une date</h3><p className="text-slate-600">Choisissez une date pour voir les RDV</p></div>
                  )}
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="text-center py-16"><div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"><Clock className="h-8 w-8 text-blue-600" /></div><p className="text-slate-600 text-lg font-medium">Chargement...</p></div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-16"><div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6"><CalendarIcon className="h-12 w-12 text-slate-400" /></div><h3 className="text-xl font-bold text-slate-900 mb-3">Aucun rendez-vous</h3><p className="text-slate-600 text-lg mb-6">Il n'y a aucun rendez-vous correspondant à vos filtres.</p><Button onClick={() => setShowAddDialog(true)} className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-2xl px-6 py-3 h-auto font-semibold"><Plus className="mr-2 h-5 w-5" />Créer un RDV</Button></div>
          ) : (
            <div className="space-y-6">
              {filteredAppointments.map(apt => {
                const patient = patients.find(p => p.id === apt.patientId);
                const service = dentist?.services?.find(s => s.id === apt.serviceId);
                return (
                  <Card key={apt.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group bg-gradient-to-r from-white to-slate-50/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-600 text-white px-4 py-2 rounded-full font-semibold"><CalendarIcon className="h-4 w-4" />{format(new Date(apt.date), 'dd/MM/yyyy', { locale: fr })}</div>
                            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full font-semibold text-slate-700"><Clock className="h-4 w-4" />{apt.time}</div>
                            {getStatusBadge(apt.status)}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">{patient ? patient.name.split(' ').map(n => n[0]).join('').slice(0, 2) : '?'}</div>
                            <div className="flex-1">
                              <div className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors">{patient?.name || 'N/A'}</div>
                              <div className="text-slate-600 flex items-center gap-4 text-sm">{patient?.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{patient.phone}</span>}{patient?.email && <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{patient.email}</span>}</div>
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600 mb-1"><Stethoscope className="h-4 w-4" /><span className="font-medium">Service</span></div>
                            <div className="font-semibold text-slate-900">{service?.name || 'N/A'}</div>
                          </div>
                          {apt.notes && <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100"><div className="text-sm text-blue-600 font-medium mb-1">Notes</div><div className="text-slate-700">{apt.notes}</div></div>}
                        </div>
                        <div className="flex lg:flex-col items-center lg:items-end gap-3">
                          <Select value={apt.status} onValueChange={v => handleStatusChange(apt.id, v)}>
                            <SelectTrigger className={cn("w-[180px] lg:w-[160px] rounded-2xl border-0 shadow-lg font-medium transition-all hover:shadow-xl", { "bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/50": apt.status === 'pending', "bg-green-50 hover:bg-green-100 text-green-700 border border-green-200/50": apt.status === 'confirmed', "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/50": apt.status === 'completed', "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/50": apt.status === 'cancelled' })}><SelectValue /></SelectTrigger>
                            <SelectContent className="border-0 shadow-xl rounded-2xl bg-white/95 backdrop-blur-sm"><SelectItem value="pending" className="rounded-xl hover:bg-orange-50 focus:bg-orange-50"><div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div><Timer className="h-4 w-4 text-orange-500" /><span className="font-medium text-orange-700">En attente</span></div></SelectItem><SelectItem value="confirmed" className="rounded-xl hover:bg-green-50 focus:bg-green-50"><div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-green-500"></div><CheckCircle2 className="h-4 w-4 text-green-500" /><span className="font-medium text-green-700">Confirmé</span></div></SelectItem><SelectItem value="completed" className="rounded-xl hover:bg-blue-50 focus:bg-blue-50"><div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500"></div><CheckCircle2 className="h-4 w-4 text-blue-500" /><span className="font-medium text-blue-700">Terminé</span></div></SelectItem><SelectItem value="cancelled" className="rounded-xl hover:bg-red-50 focus:bg-red-50"><div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red-500"></div><XCircle className="h-4 w-4 text-red-500" /><span className="font-medium text-red-700">Annulé</span></div></SelectItem></SelectContent>
                          </Select>
                          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-2xl h-12 w-12 p-0 shadow-lg hover:shadow-xl transition-all" onClick={() => navigate(`/dashboard/patients/${patient?.id}`)}><Eye className="h-5 w-5" /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
