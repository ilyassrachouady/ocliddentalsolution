import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Patient } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Edit,
  Save,
  X,
  User,
  Plus,
  History,
  Activity,
  Stethoscope,
  Heart,
  Shield,
  Star,
  Clock,
  CheckCircle2,
  Timer,
  XCircle,
} from 'lucide-react';
import { demoDentist } from '@/lib/mock-data';

export default function PatientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dentist] = useState(demoDentist);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Patient>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPatient();
  }, [id, dentist]);

  const loadPatient = async () => {
    if (!id || !dentist) return;
    try {
      const data = await api.getPatient(id, dentist.id);
      if (data) {
        setPatient(data);
        setFormData(data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement du patient');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id || !dentist) return;
    setIsSaving(true);
    try {
      await api.updatePatient(id, formData, dentist.id);
      toast.success('Patient mis à jour');
      setIsEditing(false);
      loadPatient();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
      confirmed: {
        icon: <CheckCircle2 className="h-4 w-4" />,
        label: 'Confirmé',
        className: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg border-0 rounded-full px-3 py-1.5 font-semibold'
      },
      pending: {
        icon: <Timer className="h-4 w-4" />,
        label: 'En attente',
        className: 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg border-0 rounded-full px-3 py-1.5 font-semibold'
      },
      completed: {
        icon: <CheckCircle2 className="h-4 w-4" />,
        label: 'Terminé',
        className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border-0 rounded-full px-3 py-1.5 font-semibold'
      },
      cancelled: {
        icon: <XCircle className="h-4 w-4" />,
        label: 'Annulé',
        className: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg border-0 rounded-full px-3 py-1.5 font-semibold'
      },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge className={config.className}>
        <div className="flex items-center gap-1.5">
          {config.icon}
          {config.label}
        </div>
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-gray-500 mb-4">Patient non trouvé</div>
        <Button onClick={() => navigate('/dashboard/patients')} className="rounded-xl">
          Retour à la liste
        </Button>
      </div>
    );
  }

  const upcomingAppointments = patient.appointments
    .filter(apt => new Date(apt.date) >= new Date() && apt.status !== 'cancelled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAppointments = patient.appointments
    .filter(apt => new Date(apt.date) < new Date() || apt.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 min-h-screen">
      {/* Back Button */}
      <Button
        onClick={() => navigate('/dashboard/patients')}
        className="mb-6 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 border-0 rounded-2xl px-4 py-2 font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux patients
      </Button>

      {/* Hero Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 rounded-3xl opacity-95"></div>
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
            <div className="flex items-center gap-6 flex-1">
              <Avatar className="h-32 w-32 ring-4 ring-white/30 shadow-2xl">
                <AvatarImage src={patient?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm text-white text-4xl font-bold">
                  {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-4 flex-1">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-2">{patient.name}</h1>
                  <p className="text-blue-100 text-xl">Dossier médical complet</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm">Téléphone</p>
                      <p className="font-bold">{patient.phone}</p>
                    </div>
                  </div>
                  
                  {patient.email && (
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-blue-100 text-sm">Email</p>
                        <p className="font-bold">{patient.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {patient.dateOfBirth && (
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-blue-100 text-sm">Date de naissance</p>
                        <p className="font-bold">{format(new Date(patient.dateOfBirth), 'dd/MM/yyyy', { locale: fr })}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm">Patient depuis</p>
                      <p className="font-bold">{format(new Date(patient.createdAt || new Date()), 'MMM yyyy', { locale: fr })}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-blue-100">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-300" />
                    <span className="font-medium">Suivi personnalisé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-300" />
                    <span className="font-medium">Dossier sécurisé</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 rounded-2xl px-6 py-3 font-bold text-lg">
                <User className="h-5 w-5 mr-2" />
                Patient actif
              </Badge>
              <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 rounded-2xl px-6 py-3 h-auto font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                <Plus className="mr-2 h-5 w-5" />
                Nouveau RDV
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Information Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Patient Details Card */}
        <div className="xl:col-span-4">
          <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-6 border-b-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">{patient.name}</CardTitle>
                    <p className="text-slate-600">Informations du patient</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-2xl">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Téléphone</p>
                    <p className="font-semibold text-slate-900">{patient.phone}</p>
                  </div>
                </div>
                
                {patient.email && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                      <Mail className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Email</p>
                      <p className="font-semibold text-slate-900">{patient.email}</p>
                    </div>
                  </div>
                )}
                
                {patient.dateOfBirth && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Date de naissance</p>
                      <p className="font-semibold text-slate-900">{format(new Date(patient.dateOfBirth), 'dd/MM/yyyy', { locale: fr })}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Patient Tags */}
              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-700">Statut patient</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full px-3 py-1 font-semibold">
                    VIP
                  </Badge>
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full px-3 py-1 font-semibold">
                    Régulier
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="xl:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Total RDV</p>
                <p className="text-3xl font-bold text-slate-900">{patient.appointments.length}</p>
                <p className="text-xs text-blue-600 font-medium mt-1">
                  {patient.appointments.filter(apt => apt.status === 'completed').length} terminés
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Prochain RDV</p>
                <p className="text-xl font-bold text-slate-900">
                  {upcomingAppointments.length > 0
                    ? format(new Date(upcomingAppointments[0].date), 'dd/MM', { locale: fr })
                    : 'Aucun'
                  }
                </p>
                {upcomingAppointments.length > 0 && (
                  <p className="text-xs text-green-600 font-medium mt-1">{upcomingAppointments[0].time}</p>
                )}
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Dernière visite</p>
                <p className="text-xl font-bold text-slate-900">
                  {patient.appointments.length > 0
                    ? format(new Date(patient.appointments[patient.appointments.length - 1].date), 'dd/MM', { locale: fr })
                    : 'Aucune'
                  }
                </p>
                {patient.appointments.length > 0 && (
                  <p className="text-xs text-purple-600 font-medium mt-1">
                    Il y a {Math.floor((new Date().getTime() - new Date(patient.appointments[patient.appointments.length - 1].date).getTime()) / (1000 * 60 * 60 * 24))} jours
                  </p>
                )}
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <History className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-teal-50/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Statut patient</p>
                <p className="text-xl font-bold text-slate-900">Actif</p>
                <p className="text-xs text-teal-600 font-medium mt-1">Suivi régulier</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle2 className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
          </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info Card */}
        <Card className="lg:col-span-1 border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-white rounded-t-lg">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-slate-100">
                <AvatarImage src={patient.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white text-xl font-bold">
                  {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl text-slate-900">{patient.name}</CardTitle>
                <CardDescription className="text-slate-600">Informations du patient</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-4 w-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Téléphone</p>
                  <p className="font-semibold">{patient.phone}</p>
                </div>
              </div>
              {patient.email && (
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-semibold">{patient.email}</p>
                  </div>
                </div>
              )}
              {patient.dateOfBirth && (
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Date de naissance</p>
                    <p className="font-semibold">
                      {format(new Date(patient.dateOfBirth), 'dd/MM/yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {patient.tags && patient.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {patient.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="lg:col-span-2 shadow-sm border-0">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-xl">
              <TabsTrigger value="info" className="rounded-xl">Informations</TabsTrigger>
              <TabsTrigger value="appointments" className="rounded-xl">Rendez-vous</TabsTrigger>
              <TabsTrigger value="notes" className="rounded-xl">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 mt-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom complet</Label>
                      <Input
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Téléphone</Label>
                      <Input
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>

                  <Button
                    onClick={handleSave}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700"
                    disabled={isSaving}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-500">Nom complet</Label>
                    <p className="text-base font-medium">{patient.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Téléphone</Label>
                    <p className="text-base font-medium">{patient.phone}</p>
                  </div>
                  {patient.email && (
                    <div>
                      <Label className="text-sm text-gray-500">Email</Label>
                      <p className="text-base font-medium">{patient.email}</p>
                    </div>
                  )}
                  {patient.dateOfBirth && (
                    <div>
                      <Label className="text-sm text-gray-500">Date de naissance</Label>
                      <p className="text-base font-medium">
                        {format(patient.dateOfBirth, 'dd/MM/yyyy', { locale: fr })}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="appointments" className="mt-6">
              <div className="space-y-6">
                {upcomingAppointments.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4">Rendez-vous à venir</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Heure</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingAppointments.map((apt) => (
                          <TableRow key={apt.id}>
                            <TableCell>
                              {format(new Date(apt.date), 'dd/MM/yyyy', { locale: fr })}
                            </TableCell>
                            <TableCell>{apt.time}</TableCell>
                            <TableCell>
                              {dentist?.services.find(s => s.id === apt.serviceId)?.name || 'N/A'}
                            </TableCell>
                            <TableCell>{getStatusBadge(apt.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {pastAppointments.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4">Historique</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Heure</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastAppointments.map((apt) => (
                          <TableRow key={apt.id}>
                            <TableCell>
                              {format(new Date(apt.date), 'dd/MM/yyyy', { locale: fr })}
                            </TableCell>
                            <TableCell>{apt.time}</TableCell>
                            <TableCell>
                              {dentist?.services.find(s => s.id === apt.serviceId)?.name || 'N/A'}
                            </TableCell>
                            <TableCell>{getStatusBadge(apt.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {patient.appointments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucun rendez-vous enregistré
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <div className="space-y-4">
                <Label>Notes médicales</Label>
                <Textarea
                  value={formData.notes || patient.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="rounded-xl"
                  rows={10}
                  placeholder="Ajoutez des notes sur ce patient..."
                />
                <Button
                  onClick={handleSave}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700"
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Sauvegarde...' : 'Enregistrer les notes'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
