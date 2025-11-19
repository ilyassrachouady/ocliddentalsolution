import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Patient } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Search, Phone, Mail, Calendar, Eye, User, Plus, Users, TrendingUp, Stethoscope, Heart, Shield, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
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
    const filtered = searchQuery
      ? patients.filter(
          p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.phone.includes(searchQuery) ||
            p.email?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : patients;
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  const loadPatients = async () => {
    if (!dentist) return;
    setIsLoading(true);
    try {
      const data = await api.getPatients(dentist.id);
      setPatients(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des patients');
    } finally {
      setIsLoading(false);
    }
  };

  const getNextAppointment = (patient: Patient) => {
    return patient.appointments
      .filter(apt => new Date(apt.date) >= new Date() && apt.status !== 'cancelled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 rounded-3xl opacity-95"></div>
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-white overflow-hidden">
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
                <div className="flex items-center gap-2"><Heart className="h-5 w-5 text-red-300" /><span>Soins personnalisés</span></div>
                <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-green-300" /><span>Données sécurisées</span></div>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Total Patients", value: patients.length, sub: "Patients actifs", icon: User, color: "teal" },
          { title: "Nouveaux ce mois", value: patients.filter(p => new Date(p.createdAt || new Date()).getMonth() === new Date().getMonth()).length, sub: "Croissance", icon: TrendingUp, color: "green" },
          { title: "RDV à venir", value: patients.reduce((count, p) => count + (getNextAppointment(p) ? 1 : 0), 0), sub: "Consultations prévues", icon: Calendar, color: "blue" }
        ].map(stat => (
          <Card key={stat.title} className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className={`text-xs text-${stat.color}-600 font-medium mt-1`}>{stat.sub}</p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patients List */}
      <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="border-b-0 bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                Liste des patients
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg">
                {filteredPatients.length} patients trouvés sur {patients.length}
              </CardDescription>
            </div>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-12 w-full sm:w-80 h-12 rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-lg font-medium focus:shadow-xl transition-all"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {isLoading ? (
            <div className="text-center py-16"><Activity className="h-8 w-8 mx-auto text-teal-500 animate-spin" /><p className="mt-4 text-slate-600">Chargement...</p></div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6"><Users className="h-12 w-12 text-slate-400" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{searchQuery ? 'Aucun patient trouvé' : 'Aucun patient'}</h3>
              <p className="text-slate-600 text-lg mb-6">{searchQuery ? 'Modifiez votre recherche' : 'Ajoutez votre premier patient'}</p>
              {!searchQuery && <Button onClick={() => setShowAddDialog(true)} className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl px-6 py-3 font-semibold"><Plus className="mr-2 h-5 w-5" />Ajouter un patient</Button>}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPatients.map(patient => {
                const nextApt = getNextAppointment(patient);
                return (
                  <Card key={patient.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group bg-gradient-to-r from-white to-slate-50/50 cursor-pointer" onClick={() => navigate(`/dashboard/patients/${patient.id}`)}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 flex-1">
                          <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                            <AvatarImage />
                            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-bold text-xl">{patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-700 transition-colors mb-2">{patient.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                              <div className="flex items-center gap-2 text-sm text-slate-600"><Phone className="h-4 w-4 text-teal-600" /><span>{patient.phone}</span></div>
                              {patient.email && <div className="flex items-center gap-2 text-sm text-slate-600"><Mail className="h-4 w-4 text-blue-600" /><span>{patient.email}</span></div>}
                              {patient.dateOfBirth && <div className="flex items-center gap-2 text-sm text-slate-600"><User className="h-4 w-4 text-purple-600" /><span>{format(new Date(patient.dateOfBirth), 'dd/MM/yyyy', { locale: fr })}</span></div>}
                              <div className="flex items-center gap-2 text-sm text-slate-600"><Stethoscope className="h-4 w-4 text-green-600" /><span>{patient.appointments.length} consultations</span></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-4">
                          {nextApt ? (
                            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                              <div className="text-sm text-blue-600 font-medium mb-1">Prochain RDV</div>
                              <div className="flex items-center gap-2 text-sm text-slate-700 font-semibold"><Calendar className="h-4 w-4 text-blue-600" />{`${format(new Date(nextApt.date), 'dd/MM/yyyy', { locale: fr })} à ${nextApt.time}`}</div>
                            </div>
                          ) : (
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100"><div className="text-sm text-slate-500">Aucun RDV programmé</div></div>
                          )}
                          <Button onClick={e => { e.stopPropagation(); navigate(`/dashboard/patients/${patient.id}`); }} className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl px-6 py-2 font-semibold shadow-lg"><Eye className="h-4 w-4 mr-2" />Voir dossier</Button>
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

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-4xl border-0 shadow-2xl rounded-3xl p-0 max-h-[90vh]">
          <NewPatientForm 
            onSuccess={patient => {
              setShowAddDialog(false);
              setPatients(prev => [patient, ...prev]);
              toast.success('Patient ajouté !');
            }}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
