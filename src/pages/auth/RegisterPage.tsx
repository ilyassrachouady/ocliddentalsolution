import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { UserPlus, Mail, Lock, User, Stethoscope } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setIsLoading(true);
    try {
      const success = await register(email, password, name);
      if (success) {
        toast.success('Compte créé avec succès ! Bienvenue.');
        navigate('/dashboard');
      } else {
        toast.error('Erreur lors de la création du compte.');
      }
    } catch (error) {
      toast.error('Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20">
      <div className="container mx-auto flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-3xl shadow-xl mb-4">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Ocliq</h1>
            <p className="text-slate-600 font-medium text-lg mt-2">Créez votre cabinet dentaire numérique</p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-8 border-b-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900">Créer votre compte</CardTitle>
                  <CardDescription className="text-slate-600 text-base">Rejoignez-nous en quelques minutes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold text-slate-700">Nom complet</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-600" />
                    <Input id="name" type="text" placeholder="Dr. Ahmed Benali" value={name} onChange={e => setName(e.target.value)} className="pl-12 h-14 rounded-2xl border-0 bg-slate-50 font-medium shadow-lg" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-slate-700">Email professionnel</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
                    <Input id="email" type="email" placeholder="dr.benali@clinique.ma" value={email} onChange={e => setEmail(e.target.value)} className="pl-12 h-14 rounded-2xl border-0 bg-slate-50 font-medium shadow-lg" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-bold text-slate-700">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-600" />
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-12 h-14 rounded-2xl border-0 bg-slate-50 font-medium shadow-lg" required minLength={6} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-bold text-slate-700">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-600" />
                    <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="pl-12 h-14 rounded-2xl border-0 bg-slate-50 font-medium shadow-lg" required minLength={6} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-8 border-t-0 flex flex-col gap-6">
                <Button type="submit" className="w-full h-14 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 font-bold text-lg shadow-2xl" disabled={isLoading}>
                  <UserPlus className="mr-3 h-5 w-5" />
                  {isLoading ? 'Création en cours...' : 'Créer mon compte'}
                </Button>
                <p className="text-sm text-center text-slate-600">
                  Vous avez déjà un compte ? <Link to="/login" className="font-bold text-teal-600 hover:text-teal-700">Se connecter</Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
