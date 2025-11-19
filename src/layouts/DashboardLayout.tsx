import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Menu,
  LogOut,
  Stethoscope,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Rendez-vous', href: '/dashboard/appointments', icon: Calendar },
  { name: 'Patients', href: '/dashboard/patients', icon: Users },
  { name: 'Facturation', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, dentist, logout, isDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-teal-50/10 animate-fade-in">
      {/* Modern Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
        <div className="flex grow flex-col gap-y-6 overflow-y-auto bg-gradient-to-br from-white via-blue-50/30 to-teal-50/20 border-r-0 shadow-xl px-8 py-8">
          <div className="flex h-16 shrink-0 items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Ocliq</h1>
              {isDemo && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full mt-1">
                  Mode démo
                </Badge>
              )}
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        'group flex gap-x-3 rounded-2xl px-4 py-3 text-base font-semibold transition-all duration-300 relative overflow-hidden',
                        isActive
                          ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-xl transform scale-105 border-l-4 border-white/30'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-white/70 hover:shadow-lg hover:transform hover:scale-102 bg-white/50 backdrop-blur-sm border-l-4 border-transparent hover:border-teal-300'
                      )}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute inset-y-0 left-0 w-1 bg-white/60 rounded-r-full"></div>
                      )}
                      
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                        isActive 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : 'bg-slate-100 group-hover:bg-teal-50 group-hover:scale-110'
                      )}>
                        <item.icon
                          className={cn(
                            'h-5 w-5 shrink-0 transition-all duration-300',
                            isActive ? 'text-white' : 'text-slate-600 group-hover:text-teal-600'
                          )}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold leading-tight">{item.name}</span>
                        {isActive && (
                          <span className="text-xs text-blue-100 font-medium">Page active</span>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="border-t border-gray-200 pt-4">
            <div className="px-3 space-y-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={dentist?.photo} />
                  <AvatarFallback>
                    {dentist?.name?.charAt(0) || user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {dentist?.name || user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-16 shrink-0 items-center gap-3 px-6 border-b">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ocliq</h1>
                {isDemo && (
                  <Badge variant="secondary" className="text-xs">
                    Mode démo
                  </Badge>
                )}
              </div>
            </div>
            <nav className="flex flex-1 flex-col px-6 py-4">
              <ul role="list" className="flex flex-1 flex-col gap-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-colors',
                          isActive
                            ? 'bg-teal-50 text-teal-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-5 w-5 shrink-0',
                            isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-500'
                          )}
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-auto pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          Ocliq
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={dentist?.photo} />
                <AvatarFallback>
                  {dentist?.name?.charAt(0) || user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{dentist?.name || user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      <main className="lg:pl-80">
        <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

