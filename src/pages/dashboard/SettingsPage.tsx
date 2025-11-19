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
  User,
  Shield,
  Heart,
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

  const handleWorkingHoursChange = (day: string, field: 'start' | 'end' | 'enabled', value: any) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours?.[day as keyof typeof prev.workingHours],
          [field]: value,
        },
      },
    }));
  };

  const copyBookingLink = () => {
    navigator.clipboard.writeText(bookingUrl);
    toast.success('Lien de réservation copié !');
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(dentist);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 rounded-3xl opacity-95"></div>
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Configuration Cabinet</h1>
                  <p className="text-blue-100 mt-1 text-xl">
                    Gérez vos préférences et profil professionnel
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-blue-100">
                <div className="flex items-center gap-2"><Heart className="h-5 w-5 text-red-300" /><span>Personnalisation</span></div>
                <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-green-300" /><span>Sécurisé</span></div>
              </div>
            </div>
            <Button onClick={handleSave} disabled={!hasChanges || isSaving} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 rounded-2xl px-6 py-3 h-auto font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50">
              <Save className="h-5 w-5 mr-2" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="clinic" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 bg-white/90 backdrop-blur-sm rounded-3xl p-3 shadow-xl border border-slate-200/50 h-16">
          {['clinic', 'hours', 'booking', 'notifications'].map(tab => (
            <TabsTrigger key={tab} value={tab} className="rounded-2xl font-bold text-base h-12 px-6 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-50 text-slate-700">
              {tab === 'clinic' && <Building2 className="h-5 w-5 mr-3" />}
              {tab === 'hours' && <Clock className="h-5 w-5 mr-3" />}
              {tab === 'booking' && <LinkIcon className="h-5 w-5 mr-3" />}
              {tab === 'notifications' && <Bell className="h-5 w-5 mr-3" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="clinic" className="space-y-8">
          <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-8 border-b-0">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold text-slate-900">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"><Building2 className="h-6 w-6 text-white" /></div>
                Informations du cabinet
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg mt-2">Informations publiques de votre page de réservation</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl p-6 text-center">
                    <div className="relative w-24 h-24 mx-auto">
                      <div className="w-full h-full bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl"><User className="h-12 w-12 text-white" /></div>
                      <Button size="sm" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-lg p-0"><User className="h-4 w-4 text-slate-600" /></Button>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mt-4">{formData.name || 'Dr. Praticien'}</h3>
                    <p className="text-slate-600">{formData.specialty || 'Chirurgien-dentiste'}</p>
                    <Button variant="outline" size="sm" className="w-full rounded-2xl mt-4">Changer la photo</Button>
                  </Card>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-6">
                    <Label htmlFor="clinic-name" className="text-sm font-bold text-slate-700">Nom complet *</Label>
                    <Input id="clinic-name" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="mt-2 h-12 rounded-2xl border-0 bg-white shadow-lg" placeholder="Dr. Jean Dupont" />
                  </Card>
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-teal-50/30 rounded-2xl p-6">
                    <Label htmlFor="clinic-specialty" className="text-sm font-bold text-slate-700">Spécialité *</Label>
                    <Input id="clinic-specialty" value={formData.specialty || ''} onChange={e => setFormData({ ...formData, specialty: e.target.value })} className="mt-2 h-12 rounded-2xl border-0 bg-white shadow-lg" placeholder="Chirurgien-dentiste" />
                  </Card>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30 rounded-2xl p-6">
                    <Label htmlFor="clinic-address" className="text-sm font-bold text-slate-700">Adresse</Label>
                    <Input id="clinic-address" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} className="mt-2 h-12 rounded-2xl border-0 bg-white shadow-lg" placeholder="123 Rue de la Paix" />
                  </Card>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/30 rounded-2xl p-6">
                    <Label htmlFor="clinic-city" className="text-sm font-bold text-slate-700">Ville</Label>
                    <Input id="clinic-city" value={formData.city || ''} onChange={e => setFormData({ ...formData, city: e.target.value })} className="mt-2 h-12 rounded-2xl border-0 bg-white shadow-lg" placeholder="Casablanca" />
                  </Card>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/30 rounded-2xl p-6">
                    <Label htmlFor="clinic-phone" className="text-sm font-bold text-slate-700">Téléphone *</Label>
                    <Input id="clinic-phone" type="tel" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="mt-2 h-12 rounded-2xl border-0 bg-white shadow-lg" placeholder="+212 6 00 00 00 00" />
                  </Card>
                  <Card className="md:col-span-2 border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl p-6">
                    <Label htmlFor="clinic-bio" className="text-sm font-bold text-slate-700">Description</Label>
                    <Textarea id="clinic-bio" value={formData.bio || ''} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="mt-2 rounded-2xl border-0 bg-white shadow-lg min-h-[120px]" placeholder="Décrivez votre cabinet..." />
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-8 border-b-0">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold text-slate-900">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"><Clock className="h-6 w-6 text-white" /></div>
                Horaires de travail
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg mt-2">Définissez vos horaires d'ouverture</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
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
