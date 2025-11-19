import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Patient } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Search, Phone, Mail, Calendar, Eye, User, Clock, Plus, Users, TrendingUp, Stethoscope, Heart, Shield, Activity, Star, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { cn } from '@/lib/utils';
import NewPatientForm from '@/components/NewPatientForm';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

export default function PatientsPage() {
  const { dentist } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, [dentist]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = patients.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phone.includes(searchQuery) ||
          p.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);

  const loadPatients = async () => {
    if (!dentist) return;
    try {
      const data = await api.getPatients(dentist.id);
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des patients');
    } finally {
      setIsLoading(false);
    }
  };

  const getNextAppointment = (patient: Patient) => {
    const upcoming = patient.appointments
      .filter(apt => new Date(apt.date) >= new Date() && apt.status !== 'cancelled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return upcoming[0];
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 rounded-3xl opacity-95"></div>
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Gestion des Patients</h1>
                  <p className="text-blue-100 mt-1 text-xl">
                    Dossiers médicaux et suivi personnalisé
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-300" />
                  <span className="font-medium">Soins personnalisés</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-300" />
                  <span className="font-medium">Données sécurisées</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 rounded-2xl px-6 py-3 h-auto font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="mr-2 h-5 w-5" />
                Nouveau Patient
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Beautiful Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-teal-50/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Total Patients</p>
                <p className="text-3xl font-bold text-slate-900">{patients.length}</p>
                <p className="text-xs text-teal-600 font-medium mt-1">
                  Patients actifs
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <User className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-teal-600">
              <ArrowUpRight className="w-4 h-4 mr-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span className="text-sm font-medium">Voir tous</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Nouveaux ce mois</p>
                <p className="text-3xl font-bold text-slate-900">
                  {patients.filter(p => new Date(p.createdAt || new Date()).getMonth() === new Date().getMonth()).length}
                </p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  Croissance
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600">
              <Star className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Excellent mois</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">RDV à venir</p>
                <p className="text-3xl font-bold text-slate-900">
                  {patients.reduce((count, p) => count + (getNextAppointment(p) ? 1 : 0), 0)}
                </p>
                <p className="text-xs text-blue-600 font-medium mt-1">
                  Consultations prévues
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <Calendar className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-blue-600">
              <Activity className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Planning actif</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Content Card */}
      <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="border-b-0 bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-5">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                Liste des patients
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg">
                {filteredPatients.length} patients trouvés sur {patients.length} au total
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors" />
                <Input
                  placeholder="Rechercher par nom, téléphone ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 w-full sm:w-80 h-12 rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-lg font-medium focus:shadow-xl transition-all focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                />
                {searchQuery && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Badge className="bg-teal-100 text-teal-700 text-xs font-medium px-2 py-1 rounded-full">
                      {filteredPatients.length} trouvé{filteredPatients.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">

          {isLoading ? (
            <div className="space-y-4">
              {/* Professional Skeleton Loading */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-r from-white to-slate-50/50 p-6">
                  <div className="flex items-center gap-4 animate-pulse">
                    <div className="h-16 w-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-3/4"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-full"></div>
                        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="w-32 h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl"></div>
                  </div>
                </div>
              ))}
              <div className="text-center py-8">
                <p className="text-slate-600 text-lg font-medium flex items-center justify-center gap-2">
                  <Activity className="h-5 w-5 animate-spin" />
                  Chargement des patients...
                </p>
              </div>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {searchQuery ? 'Aucun patient trouvé' : 'Aucun patient enregistré'}
              </h3>
              <p className="text-slate-600 text-lg mb-6">
                {searchQuery ? 'Essayez de modifier vos critères de recherche' : 'Commencez par ajouter votre premier patient'}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-2xl px-6 py-3 h-auto font-semibold"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Ajouter un patient
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPatients.map((patient) => {
                const nextApt = getNextAppointment(patient);
                return (
                  <Card
                    key={patient.id}
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group bg-gradient-to-r from-white to-slate-50/50 cursor-pointer"
                    onClick={() => navigate(`/dashboard/patients/${patient.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Patient Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                            <AvatarImage />
                            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-bold text-xl">
                              {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-700 transition-colors mb-2">
                              {patient.name}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <Phone className="h-4 w-4 text-teal-600" />
                                  <span className="font-medium">{patient.phone}</span>
                                </div>
                                {patient.email && (
                                  <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Mail className="h-4 w-4 text-blue-600" />
                                    <span>{patient.email}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                {patient.dateOfBirth && (
                                  <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <User className="h-4 w-4 text-purple-600" />
                                    <span>Né le {format(new Date(patient.dateOfBirth), 'dd/MM/yyyy', { locale: fr })}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <Stethoscope className="h-4 w-4 text-green-600" />
                                  <span>{patient.appointments.length} consultations</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Tags */}
                            {patient.tags && patient.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {patient.tags.map((tag) => (
                                  <Badge key={tag} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 rounded-full px-3 py-1 text-xs font-medium">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Right Actions */}
                        <div className="flex flex-col items-end gap-4">
                          {/* Next Appointment */}
                          <div className="text-right">
                            {nextApt ? (
                              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                                <div className="text-sm text-blue-600 font-medium mb-1">Prochain RDV</div>
                                <div className="flex items-center gap-2 text-sm text-slate-700 font-semibold">
                                  <Calendar className="h-4 w-4 text-blue-600" />
                                  {format(new Date(nextApt.date), 'dd/MM/yyyy', { locale: fr })} à {nextApt.time}
                                </div>
                              </div>
                            ) : (
                              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <div className="text-sm text-slate-500">Aucun RDV programmé</div>
                              </div>
                            )}
                          </div>
                          
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/patients/${patient.id}`);
                            }}
                            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-2xl px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir le dossier
                          </Button>
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

      {/* New Patient Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-4xl border-0 shadow-2xl rounded-3xl p-0 max-h-[90vh]">
          <NewPatientForm 
            onSuccess={(patient) => {
              setShowAddDialog(false);
              setPatients(prev => [patient, ...prev]);
              toast.success('Patient ajouté avec succès!');
            }}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

