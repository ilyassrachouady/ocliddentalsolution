import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dentist } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Building2,
  Clock,
  Bell,
  Link as LinkIcon,
  Save,
  Copy,
  Settings,
  Shield,
  Heart,
  CreditCard,
  Crown,
  Calendar,
  Check,
} from 'lucide-react';

const days = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' },
];

export default function SettingsPage() {
  const { dentist } = useAuth();
  const [formData, setFormData] = useState<Partial<Dentist>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [bookingUrl, setBookingUrl] = useState('');

  useEffect(() => {
    if (dentist) {
      setFormData(dentist);
      setBookingUrl(`${window.location.origin}/dentist/${dentist.bookingPageId}`);
    }
  }, [dentist]);

  const handleSave = async () => {
    setIsSaving(true);
    // Mock API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Paramètres sauvegardés avec succès !');
    }, 1000);
  };

  const handleWorkingHoursChange = (day: string, field: 'start' | 'end' | 'enabled', value: string | boolean) => {
    setFormData(prev => {
      const currentHours = prev.workingHours?.[day as keyof typeof prev.workingHours] || {
        start: '09:00',
        end: '18:00',
        enabled: false,
      };

      return {
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [day]: {
            start: field === 'start' ? (value as string) : currentHours.start,
            end: field === 'end' ? (value as string) : currentHours.end,
            enabled: field === 'enabled' ? (value as boolean) : currentHours.enabled,
          },
        },
      };
    });
  };

  const copyBookingLink = () => {
    navigator.clipboard.writeText(bookingUrl);
    toast.success('Lien de réservation copié !');
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(dentist);

  return (
    <div className="space-y-3 md:space-y-5">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 rounded-xl md:rounded-2xl opacity-95"></div>
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-5 lg:p-7 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-20 md:-translate-y-28 translate-x-20 md:translate-x-28"></div>
          <div className="absolute bottom-0 left-0 w-28 h-28 md:w-40 md:h-40 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-14 md:translate-y-20 -translate-x-14 md:-translate-x-20"></div>
          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2.5 md:gap-5">
            <div className="space-y-1.5 md:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl flex items-center justify-center">
                  <Settings className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight">Configuration Cabinet</h1>
                  <p className="text-blue-100 mt-0.5 md:mt-1 text-xs sm:text-sm lg:text-base xl:text-lg font-medium">
                    Gérez vos préférences et profil professionnel
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4 text-blue-100 text-[10px] sm:text-xs">
                <div className="flex items-center gap-1 md:gap-1.5"><Heart className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-300" /><span>Personnalisation</span></div>
                <div className="flex items-center gap-1 md:gap-1.5"><Shield className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-300" /><span>Sécurisé</span></div>
              </div>
            </div>
            <Button onClick={handleSave} disabled={!hasChanges || isSaving} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 rounded-2xl px-6 py-3 h-auto font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50">
              <Save className="h-5 w-5 mr-2" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="clinic" className="space-y-3 md:space-y-5">
        <TabsList className="grid w-full grid-cols-5 bg-white/90 backdrop-blur-sm rounded-3xl p-3 shadow-xl border border-slate-200/50 h-16">
          {['clinic', 'hours', 'booking', 'subscription', 'notifications'].map(tab => (
            <TabsTrigger key={tab} value={tab} className="rounded-2xl font-bold text-base h-12 px-6 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-50 text-slate-700">
              {tab === 'clinic' && <Building2 className="h-5 w-5 mr-3" />}
              {tab === 'hours' && <Clock className="h-5 w-5 mr-3" />}
              {tab === 'booking' && <LinkIcon className="h-5 w-5 mr-3" />}
              {tab === 'subscription' && <CreditCard className="h-5 w-5 mr-3" />}
              {tab === 'notifications' && <Bell className="h-5 w-5 mr-3" />}
              {tab === 'clinic' ? 'Clinic' : tab === 'hours' ? 'Hours' : tab === 'booking' ? 'Booking' : tab === 'subscription' ? 'Abonnement' : 'Notifications'}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="clinic" className="space-y-3 md:space-y-5">
          <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-8 border-b-0">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold text-slate-900">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"><Building2 className="h-6 w-6 text-white" /></div>
                Informations du cabinet
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg mt-2">Informations publiques de votre page de réservation</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clinic-name" className="text-sm font-semibold text-slate-700">Nom complet *</Label>
                  <Input id="clinic-name" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="h-11 rounded-xl" placeholder="Dr. Jean Dupont" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinic-specialty" className="text-sm font-semibold text-slate-700">Spécialité *</Label>
                  <Input id="clinic-specialty" value={formData.specialty || ''} onChange={e => setFormData({ ...formData, specialty: e.target.value })} className="h-11 rounded-xl" placeholder="Chirurgien-dentiste" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinic-address" className="text-sm font-semibold text-slate-700">Adresse</Label>
                  <Input id="clinic-address" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} className="h-11 rounded-xl" placeholder="123 Rue de la Paix" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinic-city" className="text-sm font-semibold text-slate-700">Ville</Label>
                  <Input id="clinic-city" value={formData.city || ''} onChange={e => setFormData({ ...formData, city: e.target.value })} className="h-11 rounded-xl" placeholder="Casablanca" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinic-phone" className="text-sm font-semibold text-slate-700">Téléphone *</Label>
                  <Input id="clinic-phone" type="tel" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="h-11 rounded-xl" placeholder="+212 6 00 00 00 00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinic-email" className="text-sm font-semibold text-slate-700">Email</Label>
                  <Input id="clinic-email" type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="h-11 rounded-xl" placeholder="cabinet@exemple.com" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="clinic-bio" className="text-sm font-semibold text-slate-700">Description</Label>
                  <Textarea id="clinic-bio" value={formData.bio || ''} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="rounded-xl min-h-[120px]" placeholder="Décrivez votre cabinet..." />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-3 md:p-4 lg:p-5 border-b-0">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold text-slate-900">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"><Clock className="h-6 w-6 text-white" /></div>
                Horaires de travail
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg mt-2">Définissez vos horaires d'ouverture</CardDescription>
            </CardHeader>
            <CardContent className="p-3 md:p-5 lg:p-6 space-y-3 md:space-y-4">
              {days.map(day => {
                const hours = formData.workingHours?.[day.key as keyof typeof formData.workingHours];
                return (
                  <Card key={day.key} className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50/30 rounded-2xl p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      <div className="lg:w-40 flex items-center justify-between">
                        <Label className="font-bold text-slate-900 text-lg">{day.label}</Label>
                        <Switch checked={hours?.enabled} onCheckedChange={checked => handleWorkingHoursChange(day.key, 'enabled', checked)} />
                      </div>
                      <div className={`flex-1 grid grid-cols-2 gap-4 transition-opacity ${hours?.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <Input type="time" value={hours?.start} onChange={e => handleWorkingHoursChange(day.key, 'start', e.target.value)} className="h-12 rounded-2xl border-0 bg-white shadow-lg" />
                        <Input type="time" value={hours?.end} onChange={e => handleWorkingHoursChange(day.key, 'end', e.target.value)} className="h-12 rounded-2xl border-0 bg-white shadow-lg" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking">
          <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-green-50/30 to-teal-50/20 p-8 border-b-0">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold text-slate-900">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg"><LinkIcon className="h-6 w-6 text-white" /></div>
                Page de réservation
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg mt-2">Partagez ce lien pour les réservations en ligne</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex gap-4">
                <Input value={bookingUrl} readOnly className="h-14 rounded-2xl border-0 bg-slate-50 font-medium shadow-lg flex-1 text-base" />
                <Button onClick={copyBookingLink} className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl px-8 h-14 font-bold text-base shadow-lg"><Copy className="h-5 w-5 mr-3" />Copier</Button>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200">
                <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">💡 Comment partager ce lien</h4>
                <ul className="space-y-2 text-sm text-green-700 list-disc list-inside">
                  <li>Envoyez-le par SMS ou e-mail à vos patients.</li>
                  <li>Ajoutez-le sur votre site web et vos réseaux sociaux.</li>
                  <li>Intégrez-le dans vos rappels de rendez-vous.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50/30 to-indigo-50/20 p-8 border-b-0">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold text-slate-900">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"><CreditCard className="h-6 w-6 text-white" /></div>
                Mon Abonnement
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg mt-2">Gérez votre plan et vos paiements</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Current Plan Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 p-8 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Crown className="h-8 w-8 text-yellow-300" />
                        <h3 className="text-3xl font-bold">Plan Premium</h3>
                      </div>
                      <p className="text-blue-100 text-lg">Accès complet à toutes les fonctionnalités</p>
                    </div>
                    <div className="text-right">
                      <p className="text-5xl font-bold">400 MAD</p>
                      <p className="text-blue-100 text-lg">/mois</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-2 text-blue-100 text-sm mb-1">
                        <Calendar className="h-4 w-4" />
                        <span>Prochain paiement</span>
                      </div>
                      <p className="text-2xl font-bold">15 Déc 2024</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-2 text-blue-100 text-sm mb-1">
                        <Check className="h-4 w-4" />
                        <span>Statut</span>
                      </div>
                      <p className="text-2xl font-bold">Actif</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Included */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-2xl p-6 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  Fonctionnalités incluses
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Rendez-vous illimités',
                    'Gestion des patients',
                    'Facturation complète',
                    'Page de réservation en ligne',
                    'Rappels automatiques SMS',
                    'Support technique prioritaire',
                    'Statistiques avancées',
                    'Sauvegarde automatique'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-slate-700">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment History */}
              <div>
                <h4 className="font-bold text-slate-900 text-lg mb-4">Historique des paiements</h4>
                <div className="space-y-3">
                  {[
                    { date: '15 Nov 2024', amount: '400 MAD', status: 'Payé' },
                    { date: '15 Oct 2024', amount: '400 MAD', status: 'Payé' },
                    { date: '15 Sep 2024', amount: '400 MAD', status: 'Payé' }
                  ].map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{payment.amount}</p>
                        <p className="text-sm text-green-600 font-medium">{payment.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50/30 to-pink-50/20 p-8 border-b-0">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold text-slate-900">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg"><Bell className="h-6 w-6 text-white" /></div>
                Préférences de notification
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg mt-2">Configurez comment vous êtes informé des activités</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {[
                { id: 'new-appointments', title: 'Nouveaux rendez-vous', desc: 'Notification pour chaque nouvelle réservation en ligne.' },
                { id: 'appointment-reminders', title: 'Rappels de rendez-vous', desc: 'Rappels automatiques la veille de chaque consultation.' },
                { id: 'cancellations', title: 'Annulations', desc: 'Information immédiate quand un patient annule ou reporte.' }
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-teal-50/50 rounded-2xl border border-blue-100">
                  <div>
                    <Label htmlFor={item.id} className="font-bold text-slate-900 text-lg">{item.title}</Label>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                  <Switch id={item.id} defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
