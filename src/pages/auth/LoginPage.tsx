import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { LogIn, Mail, Lock, Sparkles, Stethoscope, Heart, Shield, User, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, setDemo, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
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
        toast.success('Connexion réussie');
        navigate('/dashboard');
      } else {
        toast.error('Email ou mot de passe incorrect');
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoMode = () => {
    setDemo(true);
    toast.success('Mode démo activé');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-full -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 rounded-full translate-y-40 -translate-x-40"></div>
      
      <div className="container mx-auto flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Compact Brand Header */}
          <div className="text-center mb-6">
            <div className="relative mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl shadow-xl">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                <Heart className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">Ocliq</h1>
            <p className="text-slate-600 font-medium">Gestion dentaire professionnelle</p>
            <div className="flex items-center justify-center gap-4 mt-3 text-slate-500">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs font-medium">Sécurisé</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-red-500" />
                <span className="text-xs font-medium">Intuitif</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                <span className="text-xs font-medium">Moderne</span>
              </div>
            </div>
          </div>

          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-6 border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <LogIn className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">Connexion</CardTitle>
                  <CardDescription className="text-slate-600">
                    Accédez à votre espace professionnel
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-slate-700 block">Adresse email</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-2.5 w-2.5 text-blue-600" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="docteur@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 rounded-xl border-0 bg-slate-50 focus:bg-white font-medium shadow-lg focus:shadow-xl transition-all focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-bold text-slate-700 block">Mot de passe</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Lock className="h-2.5 w-2.5 text-purple-600" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 h-12 rounded-xl border-0 bg-slate-50 focus:bg-white font-medium shadow-lg focus:shadow-xl transition-all focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-6 border-t-0">
                <div className="space-y-5">
                  {/* Stylish Login Button - Same Proportions as Demo */}
                  <div className="flex justify-center pl-20 pr-8">
                    <Button
                      type="submit"
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] border-0"
                      disabled={isLoading}
                    >
                      <LogIn className="mr-3 h-5 w-5" />
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          Connexion en cours...
                        </>
                      ) : (
                        'Se connecter'
                      )}
                    </Button>
                  </div>

                  {/* Demo Separator */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-slate-500 font-medium">Ou essayer en mode démo</span>
                    </div>
                  </div>
                    
                  {/* Demo Buttons - Dead Center */}
                  <div className="flex justify-center pl-20 pr-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xs">
                      <Button
                        type="button"
                        onClick={handleDemoMode}
                        className="h-10 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-slate-700 border border-indigo-200 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Stethoscope className="mr-2 h-4 w-4 text-indigo-600" />
                        Dentiste
                      </Button>
                      <Button
                        type="button"
                        onClick={() => navigate('/demo')}
                        className="h-10 rounded-xl bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 text-slate-700 border border-green-200 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                        Patient
                      </Button>
                    </div>
                  </div>

                  {/* Register Link */}
                  <div className="text-center">
                    <p className="text-sm text-slate-600">
                      Pas encore de compte ?{' '}
                      <Link 
                        to="/register" 
                        className="font-bold text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        Créer un compte
                      </Link>
                    </p>
                  </div>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

