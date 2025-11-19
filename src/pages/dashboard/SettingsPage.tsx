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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
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
  Stethoscope,
  Activity,
  Star,
  CheckCircle2,
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
    // In real app, save to API
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Paramètres sauvegardés');
    }, 500);
  };

  const handleWorkingHoursChange = (day: string, field: 'start' | 'end' | 'enabled', value: any) => {
    if (!formData.workingHours) return;
    setFormData({
      ...formData,
      workingHours: {
        ...formData.workingHours,
        [day]: {
          ...formData.workingHours[day as keyof typeof formData.workingHours],
          [field]: value,
        },
      },
    });
  };

  const copyBookingLink = () => {
    navigator.clipboard.writeText(bookingUrl);
    toast.success('Lien copié dans le presse-papiers');
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(dentist);

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
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-300" />
                  <span className="font-medium">Personnalisation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-300" />
                  <span className="font-medium">Sécurisé</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 rounded-2xl px-6 py-3 h-auto font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                <Save className="h-5 w-5 mr-2" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="clinic" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 bg-white/90 backdrop-blur-sm rounded-3xl p-3 shadow-xl border border-slate-200/50 h-16">
          <TabsTrigger 
            value="clinic" 
            className="rounded-2xl font-bold text-base h-12 px-6 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-50 text-slate-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <Building2 className="h-5 w-5 mr-3" />
            Cabinet
          </TabsTrigger>
          <TabsTrigger 
            value="hours" 
            className="rounded-2xl font-bold text-base h-12 px-6 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-50 text-slate-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <Clock className="h-5 w-5 mr-3" />
            Horaires
          </TabsTrigger>
          <TabsTrigger 
            value="booking" 
            className="rounded-2xl font-bold text-base h-12 px-6 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-50 text-slate-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <LinkIcon className="h-5 w-5 mr-3" />
            Réservation
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="rounded-2xl font-bold text-base h-12 px-6 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-50 text-slate-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <Bell className="h-5 w-5 mr-3" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Clinic Info */}
        <TabsContent value="clinic" className="space-y-6">
          <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-8 border-b-0">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                Informations du cabinet
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg mt-2">
                Informations publiques affichées sur votre page de réservation
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-6">
              {/* Profile Header with Logo Section */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Logo/Avatar Section */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl p-6 lg:w-80">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
                        <User className="h-12 w-12 text-white" />
                      </div>
                      <Button 
                        size="sm" 
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-lg hover:shadow-xl p-0"
                      >
                        <User className="h-4 w-4 text-slate-600" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{formData.name || 'Dr. Nom du Praticien'}</h3>
                      <p className="text-slate-600">{formData.specialty || 'Chirurgien-dentiste'}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full rounded-2xl">
                      Changer la photo
                    </Button>
                  </div>
                </Card>

                {/* Basic Info */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-4">
                    <div className="space-y-3">
                      <Label htmlFor="clinic-name" className="text-sm font-bold text-slate-700 block">Nom complet *</Label>
                      <Input
                        id="clinic-name"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-12 rounded-2xl border-0 bg-white shadow-lg focus:shadow-xl font-medium transition-all focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        placeholder="Dr. Jean Dupont"
                        required
                        aria-describedby="clinic-name-help"
                      />
                      <p id="clinic-name-help" className="text-xs text-slate-500">Votre nom complet tel qu'affiché aux patients</p>
                    </div>
                  </Card>

                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-teal-50/30 rounded-2xl p-4">
                    <div className="space-y-3">
                      <Label htmlFor="clinic-specialty" className="text-sm font-bold text-slate-700 block">Spécialité *</Label>
                      <Input
                        id="clinic-specialty"
                        value={formData.specialty || ''}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        className="h-12 rounded-2xl border-0 bg-white shadow-lg focus:shadow-xl font-medium transition-all focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        placeholder="Chirurgien-dentiste"
                        required
                        aria-describedby="clinic-specialty-help"
                      />
                      <p id="clinic-specialty-help" className="text-xs text-slate-500">Votre domaine de spécialisation</p>
                    </div>
                  </Card>
                </div>
              </div>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30 rounded-2xl p-4">
                <div className="space-y-3">
                  <Label htmlFor="clinic-address" className="text-sm font-bold text-slate-700 block">Adresse du cabinet</Label>
                  <Input
                    id="clinic-address"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="h-12 rounded-2xl border-0 bg-white shadow-lg focus:shadow-xl font-medium transition-all focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    placeholder="123 Rue de la Paix"
                    aria-describedby="clinic-address-help"
                  />
                  <p id="clinic-address-help" className="text-xs text-slate-500">Adresse complète de votre cabinet dentaire</p>
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/30 rounded-2xl p-4">
                  <div className="space-y-3">
                    <Label htmlFor="clinic-city" className="text-sm font-bold text-slate-700 block">Ville</Label>
                    <Input
                      id="clinic-city"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="h-12 rounded-2xl border-0 bg-white shadow-lg focus:shadow-xl font-medium transition-all focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      placeholder="Casablanca"
                      aria-describedby="clinic-city-help"
                    />
                    <p id="clinic-city-help" className="text-xs text-slate-500">Ville où se trouve votre cabinet</p>
                  </div>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/30 rounded-2xl p-4">
                  <div className="space-y-3">
                    <Label htmlFor="clinic-phone" className="text-sm font-bold text-slate-700 block">Téléphone *</Label>
                    <Input
                      id="clinic-phone"
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12 rounded-2xl border-0 bg-white shadow-lg focus:shadow-xl font-medium transition-all focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      placeholder="+212 6 00 00 00 00"
                      required
                      aria-describedby="clinic-phone-help"
                    />
                    <p id="clinic-phone-help" className="text-xs text-slate-500">Numéro de contact principal</p>
                  </div>
                </Card>
              </div>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl p-4">
                <div className="space-y-3">
                  <Label htmlFor="clinic-bio" className="text-sm font-bold text-slate-700 block">Description du cabinet</Label>
                  <Textarea
                    id="clinic-bio"
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="rounded-2xl border-0 bg-white shadow-lg focus:shadow-xl font-medium transition-all resize-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 min-h-[100px]"
                    rows={4}
                    placeholder="Décrivez votre cabinet, vos spécialités et votre approche des soins dentaires..."
                    aria-describedby="clinic-bio-help"
                  />
                  <p id="clinic-bio-help" className="text-xs text-slate-500">Cette description sera visible par vos patients sur la page de réservation</p>
                </div>
              </Card>

              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-2xl px-8 py-3 h-auto font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  {isSaving ? 'Sauvegarde en cours...' : 'Enregistrer les modifications'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Working Hours */}
        <TabsContent value="hours" className="space-y-6">
          <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-8 border-b-0">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                Horaires de travail
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg mt-2">
                Définissez vos horaires d'ouverture pour chaque jour de la semaine
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {days.map((day) => {
                const hours = formData.workingHours?.[day.key as keyof typeof formData.workingHours];
                return (
                  <Card
                    key={day.key}
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-gradient-to-r from-white to-blue-50/30"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="lg:w-32">
                          <Label htmlFor={`${day.key}-toggle`} className="font-bold text-slate-900 text-base cursor-pointer">{day.label}</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch
                            id={`${day.key}-toggle`}
                            checked={hours?.enabled || false}
                            onCheckedChange={(checked) =>
                              handleWorkingHoursChange(day.key, 'enabled', checked)
                            }
                            aria-describedby={`${day.key}-status`}
                          />
                          <Badge className={cn(
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            hours?.enabled 
                              ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                              : "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
                          )}>
                            {hours?.enabled ? 'Ouvert' : 'Fermé'}
                          </Badge>
                        </div>
                        {hours?.enabled && (
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`${day.key}-start`} className="text-sm font-medium text-slate-600 whitespace-nowrap">Ouverture :</Label>
                              <Input
                                id={`${day.key}-start`}
                                type="time"
                                value={hours.start || ''}
                                onChange={(e) =>
                                  handleWorkingHoursChange(day.key, 'start', e.target.value)
                                }
                                className="w-32 h-10 rounded-2xl border-0 bg-white shadow-lg font-medium focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 text-sm"
                                aria-label={`Heure d'ouverture ${day.label}`}
                              />
                            </div>
                            <span className="text-slate-400 font-bold">→</span>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`${day.key}-end`} className="text-sm font-medium text-slate-600 whitespace-nowrap">Fermeture :</Label>
                              <Input
                                id={`${day.key}-end`}
                                type="time"
                                value={hours.end || ''}
                                onChange={(e) =>
                                  handleWorkingHoursChange(day.key, 'end', e.target.value)
                                }
                                className="w-32 h-10 rounded-2xl border-0 bg-white shadow-lg font-medium focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 text-sm"
                                aria-label={`Heure de fermeture ${day.label}`}
                              />
                            </div>
                          </div>
                        )}
                        {!hours?.enabled && (
                          <div className="flex-1">
                            <Badge className="bg-gradient-to-r from-slate-400 to-slate-500 text-white rounded-full px-4 py-2 text-sm font-semibold">
                              Cabinet fermé
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-2xl px-8 py-3 h-auto font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                {isSaving ? 'Sauvegarde en cours...' : 'Enregistrer les modifications'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Page */}
        <TabsContent value="booking" className="space-y-6">
          <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-green-50/30 to-teal-50/20 p-8 border-b-0">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <LinkIcon className="h-6 w-6 text-white" />
                </div>
                Page de réservation
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg mt-2">
                Partagez ce lien avec vos patients pour qu'ils puissent réserver en ligne
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="booking-url" className="text-sm font-bold text-slate-700 block mb-3">Lien de réservation public</Label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      id="booking-url"
                      value={bookingUrl}
                      readOnly
                      className="h-14 rounded-2xl border-0 bg-slate-50 font-medium shadow-lg flex-1 text-base select-all"
                      aria-describedby="booking-url-help"
                    />
                    <Button
                      onClick={copyBookingLink}
                      className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 rounded-2xl px-8 h-14 font-bold text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      aria-label="Copier le lien de réservation dans le presse-papiers"
                    >
                      <Copy className="h-5 w-5 mr-3" />
                      Copier le lien
                    </Button>
                  </div>
                  <p id="booking-url-help" className="text-xs text-slate-500 mt-2">Ce lien permet à vos patients de prendre rendez-vous directement</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    Comment partager ce lien
                  </h4>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                      Envoyez-le par SMS à vos patients
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                      Intégrez-le dans vos emails de rappel
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                      Partagez-le sur vos réseaux sociaux
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                      Ajoutez-le sur votre site web
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50/30 to-pink-50/20 p-8 border-b-0">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                Préférences de notification
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg mt-2">
                Configurez comment vous souhaitez être informé des activités
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-2 mb-8">
                <h3 className="text-lg font-bold text-slate-900">Configurez vos préférences</h3>
                <p className="text-slate-600">Choisissez quand et comment vous souhaitez être informé des activités de votre cabinet</p>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 bg-gradient-to-r from-blue-50 to-teal-50/50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all">
                  <div className="flex-1">
                    <Label htmlFor="new-appointments" className="font-bold text-slate-900 text-lg cursor-pointer block mb-2">Nouveaux rendez-vous</Label>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Recevez une notification instantanée pour chaque nouvelle réservation en ligne
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch 
                      id="new-appointments"
                      defaultChecked 
                      aria-describedby="new-appointments-status"
                    />
                    <span id="new-appointments-status" className="text-sm font-medium text-blue-700">Activé</span>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 bg-gradient-to-r from-green-50 to-blue-50/50 rounded-2xl border border-green-100 hover:shadow-lg transition-all">
                  <div className="flex-1">
                    <Label htmlFor="appointment-reminders" className="font-bold text-slate-900 text-lg cursor-pointer block mb-2">Rappels de rendez-vous</Label>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Recevez des rappels automatiques la veille de chaque consultation programmée
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch 
                      id="appointment-reminders"
                      defaultChecked 
                      aria-describedby="reminders-status"
                    />
                    <span id="reminders-status" className="text-sm font-medium text-green-700">Activé</span>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 bg-gradient-to-r from-orange-50 to-yellow-50/50 rounded-2xl border border-orange-100 hover:shadow-lg transition-all">
                  <div className="flex-1">
                    <Label htmlFor="cancellations" className="font-bold text-slate-900 text-lg cursor-pointer block mb-2">Annulations</Label>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Soyez immédiatement informé lorsqu'un patient annule ou reporte un rendez-vous
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch 
                      id="cancellations"
                      defaultChecked 
                      aria-describedby="cancellations-status"
                    />
                    <span id="cancellations-status" className="text-sm font-medium text-orange-700">Activé</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-2xl px-8 py-3 h-auto font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                {isSaving ? 'Sauvegarde en cours...' : 'Enregistrer les modifications'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

