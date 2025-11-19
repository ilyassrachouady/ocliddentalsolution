import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { LogIn, Mail, Lock, Sparkles, Stethoscope, Heart, Shield, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, setDemo, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Connexion réussie !');
        navigate('/dashboard');
      } else {
        toast.error('Email ou mot de passe incorrect.');
      }
    } catch (error) {
      toast.error('Une erreur est survenue lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoMode = () => {
    setDemo(true);
    toast.success('Mode démo activé. Bienvenue !');
    navigate('/dashboard');
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
            <p className="text-slate-600 font-medium text-lg mt-2">Gestion dentaire professionnelle</p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-8 border-b-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900">Connexion</CardTitle>
                  <CardDescription className="text-slate-600 text-base">Accédez à votre espace professionnel</CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-slate-700">Adresse email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
                    <Input id="email" type="email" placeholder="docteur@email.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-12 h-14 rounded-2xl border-0 bg-slate-50 font-medium shadow-lg" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-bold text-slate-700">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-600" />
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-12 h-14 rounded-2xl border-0 bg-slate-50 font-medium shadow-lg" required />
                  </div>
                </div>
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm font-semibold text-teal-600 hover:text-teal-700">Mot de passe oublié ?</Link>
                </div>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-8 border-t-0 flex flex-col gap-6">
                <Button type="submit" className="w-full h-14 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 font-bold text-lg shadow-2xl" disabled={isLoading}>
                  <LogIn className="mr-3 h-5 w-5" />
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>

                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                  <div className="relative flex justify-center text-xs"><span className="bg-slate-50 px-3 text-slate-500 font-medium">Ou essayer en mode démo</span></div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button type="button" onClick={handleDemoMode} className="h-12 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 text-slate-700 border border-indigo-200 font-semibold shadow-lg">
                    <Stethoscope className="mr-2 h-4 w-4 text-indigo-600" /> Dentiste
                  </Button>
                  <Button type="button" onClick={() => navigate('/demo')} className="h-12 rounded-2xl bg-gradient-to-r from-green-50 to-teal-50 text-slate-700 border border-green-200 font-semibold shadow-lg">
                    <UserCheck className="mr-2 h-4 w-4 text-green-600" /> Patient
                  </Button>
                </div>

                <p className="text-sm text-center text-slate-600">
                  Pas encore de compte ? <Link to="/register" className="font-bold text-teal-600 hover:text-teal-700">Créer un compte</Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
