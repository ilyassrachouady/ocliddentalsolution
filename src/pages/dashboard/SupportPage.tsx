import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  LifeBuoy,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Plus,
} from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      subject: 'Problème de synchronisation',
      message: 'Les rendez-vous ne se synchronisent pas correctement...',
      status: 'in-progress',
      createdAt: new Date(2024, 10, 15),
      priority: 'high'
    },
    {
      id: '2',
      subject: 'Question sur la facturation',
      message: 'Comment exporter les factures en PDF?',
      status: 'resolved',
      createdAt: new Date(2024, 10, 10),
      priority: 'low'
    }
  ]);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.message) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const newTicket: Ticket = {
      id: Date.now().toString(),
      subject: formData.subject,
      message: formData.message,
      status: 'open',
      createdAt: new Date(),
      priority: formData.priority
    };

    setTickets([newTicket, ...tickets]);
    toast.success('Ticket créé avec succès! Notre équipe vous répondra bientôt.');
    
    setFormData({
      subject: '',
      message: '',
      priority: 'medium'
    });
    setShowNewTicket(false);
  };

  const getStatusBadge = (status: Ticket['status']) => {
    const config = {
      open: { label: 'Ouvert', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
      'in-progress': { label: 'En cours', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertCircle },
      resolved: { label: 'Résolu', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 }
    };
    const { label, color, icon: Icon } = config[status];
    return (
      <Badge className={`${color} border font-semibold px-3 py-1 flex items-center gap-1.5`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Ticket['priority']) => {
    const config = {
      low: { label: 'Basse', color: 'bg-slate-100 text-slate-700 border-slate-200' },
      medium: { label: 'Moyenne', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      high: { label: 'Haute', color: 'bg-red-100 text-red-700 border-red-200' }
    };
    const { label, color } = config[priority];
    return (
      <Badge variant="outline" className={`${color} border font-semibold`}>
        {label}
      </Badge>
    );
  };

  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;

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
                  <LifeBuoy className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight">Support Technique</h1>
                  <p className="text-blue-100 mt-0.5 md:mt-1 text-xs sm:text-sm lg:text-base xl:text-lg font-medium">
                    Besoin d'aide? Créez un ticket et notre équipe vous assistera
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setShowNewTicket(!showNewTicket)}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 rounded-lg md:rounded-xl px-3 py-1.5 md:px-5 md:py-2.5 h-auto font-semibold text-xs md:text-sm lg:text-base transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="mr-1 md:mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4" />
              Nouveau Ticket
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Total Tickets</p>
                <p className="text-3xl font-bold text-slate-900">{tickets.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <MessageSquare className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">En Cours</p>
                <p className="text-3xl font-bold text-slate-900">{openTickets}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Clock className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Résolus</p>
                <p className="text-3xl font-bold text-slate-900">{resolvedTickets}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Ticket Modal */}
      <Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
              Créer un Nouveau Ticket
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Décrivez votre problème en détail pour que nous puissions vous aider rapidement
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-semibold text-slate-700">
                Sujet *
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Ex: Problème de connexion, bug lors de la création d'un RDV..."
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-semibold text-slate-700">
                Priorité *
              </Label>
              <div className="flex gap-3">
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <Button
                    key={priority}
                    type="button"
                    variant={formData.priority === priority ? 'default' : 'outline'}
                    onClick={() => setFormData({ ...formData, priority })}
                    className={`flex-1 rounded-xl h-11 font-semibold ${
                      formData.priority === priority
                        ? priority === 'high'
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : priority === 'medium'
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                          : 'bg-gradient-to-r from-slate-500 to-slate-600'
                        : ''
                    }`}
                  >
                    {priority === 'low' ? 'Basse' : priority === 'medium' ? 'Moyenne' : 'Haute'}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-semibold text-slate-700">
                Message *
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Décrivez votre problème en détail. Plus vous donnez d'informations, plus nous pourrons vous aider rapidement..."
                className="rounded-xl min-h-[120px]"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowNewTicket(false);
                  setFormData({ subject: '', message: '', priority: 'medium' });
                }}
                className="flex-1 rounded-xl h-11 font-semibold"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-xl h-11 font-semibold"
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer le Ticket
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tickets List */}
      <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="border-b-0 bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-6 md:p-8">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              Mes Tickets
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              Historique de vos demandes de support
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {tickets.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Aucun ticket</h3>
              <p className="text-slate-600 text-lg mb-6">Vous n'avez pas encore créé de ticket de support.</p>
              <Button 
                onClick={() => setShowNewTicket(true)}
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-2xl px-6 py-3 h-auto font-semibold"
              >
                <Plus className="mr-2 h-5 w-5" />
                Créer un Ticket
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card 
                  key={ticket.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-gradient-to-br from-white to-slate-50/50"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900 mb-2">{ticket.subject}</h3>
                          <p className="text-sm text-slate-600 line-clamp-2">{ticket.message}</p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Créé le {ticket.createdAt.toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>Ticket #{ticket.id}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
