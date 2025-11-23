import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Appointment, Patient } from '@/types';
import { format, isToday, isThisMonth, addDays } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  Users,
  Plus,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Eye,
  Stethoscope,
  Activity,
  CheckCircle2,
  Timer,
  XCircle,
  Star,
  Heart,
  Shield,
} from 'lucide-react';
import { ModernAppointmentModalV2 } from '@/components/ui/modern-appointment-modal-v2';

export default function DashboardHome() {
  const { dentist } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [monthlyStats, setMonthlyStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    revenue: 0,
    newPatients: 0,
  });

  useEffect(() => {
    loadAppointments();
  }, [dentist]);

  const loadAppointments = async () => {
    if (!dentist) return;
    try {
      const [apptsData, patientsData] = await Promise.all([
        api.getAppointments(dentist.id),
        api.getPatients(dentist.id),
      ]);
      setPatients(patientsData);
      
      const today = new Date();
      const todayAppts = apptsData.filter((apt: Appointment) => isToday(new Date(apt.date)));
      setTodayAppointments(todayAppts);
      
      const upcomingAppts = apptsData.filter((apt: Appointment) => {
        const aptDate = new Date(apt.date);
        return aptDate > today && aptDate <= addDays(today, 7);
      });
      setUpcomingAppointments(upcomingAppts);
      
      const thisMonthAppts = apptsData.filter((apt: Appointment) => isThisMonth(new Date(apt.date)));
      const completedThisMonth = thisMonthAppts.filter((apt: Appointment) => apt.status === 'completed');
      const newPatientsThisMonth = patientsData.filter((patient: Patient) => isThisMonth(new Date(patient.createdAt || new Date())));
      
      const revenue = completedThisMonth.reduce((total: number, apt: Appointment) => {
        const service = dentist.services?.find((s: any) => s.id === apt.serviceId);
        return total + (service?.price || 0);
      }, 0);
      
      setMonthlyStats({
        totalAppointments: thisMonthAppts.length,
        completedAppointments: completedThisMonth.length,
        revenue,
        newPatients: newPatientsThisMonth.length,
      });
      
    } catch (error) {
      toast.error('Erreur lors du chargement des rendez-vous');
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || patientId;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
      confirmed: {
        icon: <CheckCircle2 className="h-3 w-3" />,
        label: 'Confirmé',
        className: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg border-0 rounded-full px-2 py-1 text-xs font-semibold'
      },
      pending: {
        icon: <Timer className="h-3 w-3" />,
        label: 'En attente',
        className: 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg border-0 rounded-full px-2 py-1 text-xs font-semibold'
      },
      completed: {
        icon: <CheckCircle2 className="h-3 w-3" />,
        label: 'Terminé',
        className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border-0 rounded-full px-2 py-1 text-xs font-semibold'
      },
      cancelled: {
        icon: <XCircle className="h-3 w-3" />,
        label: 'Annulé',
        className: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg border-0 rounded-full px-2 py-1 text-xs font-semibold'
      },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge className={config.className}>
        <div className="flex items-center gap-1">
          {config.icon}
          {config.label}
        </div>
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center animate-pulse">
          <Activity className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-5">
      {/* Hero Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 rounded-xl md:rounded-2xl opacity-95"></div>
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-5 lg:p-7 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-20 md:-translate-y-28 translate-x-20 md:translate-x-28"></div>
          <div className="absolute bottom-0 left-0 w-28 h-28 md:w-40 md:h-40 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-14 md:translate-y-20 -translate-x-14 md:-translate-x-20"></div>
          
          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2.5 md:gap-5">
            <div className="space-y-1.5 md:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight">
                    {getTimeOfDay()}, Dr. {dentist?.name?.split(' ')[0]}
                  </h1>
                  <p className="text-blue-100 mt-0.5 md:mt-1 text-xs sm:text-sm lg:text-base xl:text-lg font-medium">
                    Tableau de bord professionnel • {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 md:gap-4 text-blue-100 text-[10px] sm:text-xs">
                <div className="flex items-center gap-1 md:gap-1.5">
                  <Heart className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-300" />
                  <span className="font-medium">Votre cabinet dental</span>
                </div>
                <div className="flex items-center gap-1 md:gap-1.5">
                  <Shield className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-300" />
                  <span className="font-medium">Soins de qualité</span>
                </div>
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
                onConfirm={(data) => {
                  console.log('Appointment data:', data);
                  loadAppointments();
                  toast.success('Rendez-vous créé avec succès!');
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Beautiful Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        <Card 
          className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50 hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
          onClick={() => navigate('/dashboard/appointments')}
        >
          <CardContent className="p-3 md:p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Rendez-vous</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">{monthlyStats.totalAppointments}</p>
                  <div className="flex items-center text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                    +{Math.round((monthlyStats.completedAppointments / Math.max(monthlyStats.totalAppointments, 1)) * 100)}%
                  </div>
                </div>
                <p className="text-xs text-blue-600 font-medium mt-2">
                  {monthlyStats.completedAppointments} terminés ce mois
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <Calendar className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-blue-600">
              <ArrowUpRight className="w-4 h-4 mr-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span className="text-sm font-semibold">Gérer l'agenda</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-0 shadow-lg bg-gradient-to-br from-white to-teal-50/50 hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
          onClick={() => navigate('/dashboard/patients')}
        >
          <CardContent className="p-3 md:p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Patients actifs</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">{patients.length}</p>
                  {monthlyStats.newPatients > 0 && (
                    <div className="flex items-center text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-semibold">
                      +{monthlyStats.newPatients} ce mois
                    </div>
                  )}
                </div>
                <p className="text-xs text-teal-600 font-medium mt-2">
                  Base de données complète
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <Users className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-teal-600">
              <ArrowUpRight className="w-4 h-4 mr-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span className="text-sm font-semibold">Dossiers patients</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50 hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105">
          <CardContent className="p-3 md:p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Revenus</p>
                <p className="text-3xl font-bold text-slate-900">{monthlyStats.revenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 font-medium mt-1">MAD ce mois</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600">
              <Star className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold">Performance financière</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/50 hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105">
          <CardContent className="p-3 md:p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Taux succès</p>
                <p className="text-3xl font-bold text-slate-900">
                  {Math.round((monthlyStats.completedAppointments / Math.max(monthlyStats.totalAppointments, 1)) * 100)}%
                </p>
                <p className="text-xs text-purple-600 font-medium mt-1">Rendez-vous complétés</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-purple-600">
              <Activity className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold">Efficacité clinique</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 md:gap-5 lg:gap-6">
        {/* Today's Schedule */}
        <div className="xl:col-span-2">
          <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-3 md:p-4 lg:p-5 border-b-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base md:text-lg lg:text-xl font-bold text-slate-900">Programme d'aujourd'hui</CardTitle>
                    <p className="text-slate-600 text-xs md:text-sm mt-0.5">
                      {todayAppointments.length} rendez-vous planifiés
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/dashboard/appointments')}
                  className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-xl md:rounded-2xl px-2 py-1.5 md:px-3 md:py-2 font-semibold shadow-lg hover:shadow-xl transition-all text-xs md:text-sm"
                >
                  <Eye className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                  <span className="hidden md:inline">Voir l'agenda</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-3 md:p-5 lg:p-6">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-4 md:py-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                    <Calendar className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">Journée libre</h3>
                  <p className="text-slate-600 text-sm md:text-base mb-3 md:mb-4">Aucun rendez-vous programmé pour aujourd'hui</p>
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-xl md:rounded-2xl px-4 py-2 md:px-5 md:py-2.5 h-auto font-semibold shadow-lg text-xs md:text-sm"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2" />
                    Planifier un RDV
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-4">
                  {todayAppointments.map((appointment) => {
                    const patient = patients.find(p => p.id === appointment.patientId);
                    const service = dentist?.services?.find((s: any) => s.id === appointment.serviceId);
                    return (
                      <Card
                        key={appointment.id}
                        className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group bg-gradient-to-r from-white to-blue-50/30 cursor-pointer"
                        onClick={() => navigate('/dashboard/appointments')}
                      >
                        <CardContent className="p-3 md:p-4 lg:p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-teal-600 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full font-semibold shadow-lg text-xs md:text-sm">
                                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                {appointment.time}
                              </div>
                              
                              <div className="h-8 w-8 md:h-10 md:w-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold shadow-lg text-xs md:text-sm">
                                {patient?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                              </div>
                              
                              <div>
                                <p className="font-bold text-sm md:text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                                  {patient?.name || 'Patient inconnu'}
                                </p>
                                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-slate-600">
                                  <span className="flex items-center gap-1">
                                    <Stethoscope className="w-3 h-3 md:w-4 md:h-4" />
                                    <span className="hidden sm:inline">{service?.name || 'Service'}</span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                                    {service?.price || 0} MAD
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 md:gap-3">
                              {getStatusBadge(appointment.status)}
                              <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
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

        {/* Modern Sidebar */}
        <div className="xl:col-span-1 space-y-3 md:space-y-5">
          {/* Quick Actions */}
          <Card className="border-0 shadow-xl bg-white rounded-2xl md:rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50/30 to-pink-50/20 p-3 md:p-4 lg:p-5 border-b-0">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl md:rounded-2xl flex items-center justify-center">
                  <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <CardTitle className="text-base md:text-lg font-bold text-slate-900">Actions rapides</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3 md:p-4 lg:p-5 space-y-2">
              <Button
                onClick={() => navigate('/dashboard/patients')}
                className="w-full justify-start h-8 md:h-9 bg-gradient-to-r from-teal-50 to-blue-50 hover:from-teal-100 hover:to-blue-100 text-slate-700 border-0 rounded-xl md:rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl text-xs md:text-sm"
              >
                <Users className="w-3 h-3 md:w-4 md:h-4 mr-2 text-teal-600" />
                Gérer les patients
              </Button>
              <Button
                onClick={() => navigate('/dashboard/appointments')}
                className="w-full justify-start h-8 md:h-9 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-slate-700 border-0 rounded-xl md:rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl text-xs md:text-sm"
              >
                <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-2 text-blue-600" />
                Consulter l'agenda
              </Button>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="w-full justify-start h-8 md:h-9 bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 text-slate-700 border-0 rounded-xl md:rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl text-xs md:text-sm"
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4 mr-2 text-green-600" />
                Nouveau rendez-vous
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="border-0 shadow-xl bg-white rounded-2xl md:rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-orange-50/30 to-yellow-50/20 p-3 md:p-4 lg:p-5 border-b-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base md:text-lg font-bold text-slate-900">Prochains RDV</CardTitle>
                    <p className="text-slate-600 text-xs md:text-sm">Cette semaine</p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white rounded-full px-2 py-0.5 md:px-3 md:py-1 font-semibold text-xs">
                  {upcomingAppointments.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 md:p-4 lg:p-5">
              {upcomingAppointments.slice(0, 4).length === 0 ? (
                <div className="text-center py-4 md:py-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <Clock className="w-6 h-6 md:w-7 md:h-7 text-orange-600" />
                  </div>
                  <p className="text-slate-600 font-medium text-xs md:text-sm">Aucun RDV programmé</p>
                  <p className="text-xs text-slate-500 mt-0.5">Planifiez de nouveaux rendez-vous</p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {upcomingAppointments.slice(0, 4).map((appointment) => {
                    const patient = patients.find(p => p.id === appointment.patientId);
                    return (
                      <div 
                        key={appointment.id} 
                        className="flex items-center justify-between p-2 md:p-3 cursor-pointer hover:bg-slate-50 rounded-xl md:rounded-2xl transition-all group border border-slate-100 hover:border-slate-200 hover:shadow-lg"
                        onClick={() => navigate('/dashboard/appointments')}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 md:h-9 md:w-9 bg-gradient-to-br from-blue-500 to-teal-600 rounded-lg md:rounded-xl flex items-center justify-center text-white font-bold text-xs">
                            {patient?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                          </div>
                          <div>
                            <p className="font-bold text-xs md:text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                              {getPatientName(appointment.patientId)}
                            </p>
                            <p className="text-xs text-slate-500">
                              {format(new Date(appointment.date), 'EEE d MMM', { locale: fr })} • {appointment.time}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
