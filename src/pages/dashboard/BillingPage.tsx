import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CreditCard,
  Plus,
  FileText,
  DollarSign,
  TrendingUp,
  Download,
  Send,
  Eye,
  Calculator,
  Shield,
  Heart,
  Banknote,
  Receipt,
  PieChart,
  BarChart3,
  Euro,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import NewInvoiceForm from '@/components/NewInvoiceForm';

interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  treatmentId: string;
  treatmentName: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: Date;
  dueDate: Date;
  paidAt?: Date;
}

interface Insurance {
  id: string;
  patientId: string;
  provider: string;
  policyNumber: string;
  coverage: number; // percentage
  maxAmount: number;
  status: 'active' | 'expired' | 'pending';
}

interface FinancialReport {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  invoiceCount: number;
  paidInvoices: number;
  pendingAmount: number;
}

export default function BillingPage() {
  const { user, dentist } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [insurance, setInsurance] = useState<Insurance[]>([]);
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      setIsLoading(true);
      // Mock data for demo
      const mockInvoices: Invoice[] = [
        {
          id: 'INV-001',
          patientId: '1',
          patientName: 'Fatima Alami',
          treatmentId: 'TR-001',
          treatmentName: 'Nettoyage dentaire',
          amount: 800,
          tax: 160,
          total: 960,
          status: 'paid',
          createdAt: new Date('2024-01-15'),
          dueDate: new Date('2024-02-15'),
          paidAt: new Date('2024-01-20'),
        },
        {
          id: 'INV-002',
          patientId: '2',
          patientName: 'Ahmed Benali',
          treatmentId: 'TR-002',
          treatmentName: 'Couronne dentaire',
          amount: 3500,
          tax: 700,
          total: 4200,
          status: 'sent',
          createdAt: new Date('2024-01-20'),
          dueDate: new Date('2024-02-20'),
        },
        {
          id: 'INV-003',
          patientId: '3',
          patientName: 'Sarah Cohen',
          treatmentId: 'TR-003',
          treatmentName: 'Implant dentaire',
          amount: 8000,
          tax: 1600,
          total: 9600,
          status: 'overdue',
          createdAt: new Date('2024-01-10'),
          dueDate: new Date('2024-01-25'),
        },
      ];

      const mockInsurance: Insurance[] = [
        {
          id: 'INS-001',
          patientId: '1',
          provider: 'CNSS',
          policyNumber: 'POL-123456',
          coverage: 70,
          maxAmount: 5000,
          status: 'active',
        },
        {
          id: 'INS-002',
          patientId: '2',
          provider: 'Mutuelle Générale',
          policyNumber: 'MUT-789012',
          coverage: 80,
          maxAmount: 8000,
          status: 'active',
        },
      ];

      const mockReports: FinancialReport[] = [
        {
          period: 'Janvier 2024',
          revenue: 45600,
          expenses: 12000,
          profit: 33600,
          invoiceCount: 28,
          paidInvoices: 24,
          pendingAmount: 8400,
        },
      ];

      setInvoices(mockInvoices);
      setInsurance(mockInsurance);
      setReports(mockReports);
    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
      paid: {
        icon: <CheckCircle2 className="h-3 w-3" />,
        label: 'Payé',
        className: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg border-0 rounded-full px-3 py-1 font-semibold'
      },
      sent: {
        icon: <Clock className="h-3 w-3" />,
        label: 'Envoyé',
        className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border-0 rounded-full px-3 py-1 font-semibold'
      },
      draft: {
        icon: <FileText className="h-3 w-3" />,
        label: 'Brouillon',
        className: 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-lg border-0 rounded-full px-3 py-1 font-semibold'
      },
      overdue: {
        icon: <AlertCircle className="h-3 w-3" />,
        label: 'En retard',
        className: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg border-0 rounded-full px-3 py-1 font-semibold'
      },
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <Badge className={config.className}>
        <div className="flex items-center gap-1">
          {config.icon}
          {config.label}
        </div>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 rounded-xl md:rounded-2xl opacity-95"></div>
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-5 lg:p-7 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-20 md:-translate-y-28 translate-x-20 md:translate-x-28"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-16 md:translate-y-20 -translate-x-16 md:-translate-x-20"></div>
          
          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2.5 md:gap-5">
            <div className="space-y-1.5 md:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl flex items-center justify-center">
                  <CreditCard className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight">Facturation & Finance</h1>
                  <p className="text-blue-100 mt-0.5 md:mt-1 text-xs sm:text-sm lg:text-base xl:text-lg font-medium">
                    Gestion complète de la facturation et des finances
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-6 text-blue-100">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Receipt className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-300" />
                  <span className="font-medium text-xs md:text-sm">Facturation automatique</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <BarChart3 className="h-3.5 w-3.5 md:h-4 md:w-4 text-purple-300" />
                  <span className="font-medium text-xs md:text-sm">Rapports</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 rounded-xl md:rounded-2xl px-3 py-1.5 md:px-5 md:py-2.5 h-auto font-semibold text-xs md:text-sm lg:text-base transition-all duration-300 transform hover:scale-105">
                    <Plus className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                    Nouvelle Facture
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-6xl border-0 shadow-2xl rounded-xl md:rounded-2xl lg:rounded-3xl p-0">
                  <NewInvoiceForm 
                    onSuccess={(invoice) => {
                      setShowInvoiceDialog(false);
                      setInvoices(prev => [invoice, ...prev]);
                      toast.success('Facture créée avec succès!');
                    }}
                    onCancel={() => setShowInvoiceDialog(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Revenus (Janvier)</p>
                <p className="text-3xl font-bold text-slate-900">45 600 MAD</p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  +12% vs mois dernier
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Euro className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Factures Payées</p>
                <p className="text-3xl font-bold text-slate-900">24 / 28</p>
                <p className="text-xs text-blue-600 font-medium mt-1">
                  Taux de paiement de 85%
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Receipt className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Montant en Attente</p>
                <p className="text-3xl font-bold text-slate-900">8 400 MAD</p>
                <p className="text-xs text-orange-600 font-medium mt-1">
                  4 factures impayées
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-slate-200/50 h-14">
          <TabsTrigger
            value="invoices"
            className="rounded-xl font-bold text-base h-10 px-4 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-50 text-slate-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            Factures
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="rounded-xl font-bold text-base h-10 px-4 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-50 text-slate-700"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Rapports
          </TabsTrigger>
        </TabsList>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    Gestion des factures
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-lg">
                    {invoices.length} factures générées ce mois
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <Card
                    key={invoice.id}
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group bg-gradient-to-r from-white to-slate-50/30"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                              <Receipt className="h-4 w-4" />
                              {invoice.id}
                            </div>
                            {getStatusBadge(invoice.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-slate-600 font-medium">Patient</p>
                              <p className="font-bold text-slate-900">{invoice.patientName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 font-medium">Traitement</p>
                              <p className="font-bold text-slate-900">{invoice.treatmentName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 font-medium">Montant total</p>
                              <p className="font-bold text-slate-900 text-xl">{invoice.total} MAD</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="rounded-2xl">
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </Button>
                            <Button size="sm" variant="outline" className="rounded-2xl">
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </Button>
                            {invoice.status !== 'paid' && (
                              <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl">
                                <Send className="h-4 w-4 mr-2" />
                                Envoyer
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-orange-50/30 to-yellow-50/20 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    Rapports Financiers
                  </CardTitle>
                  <CardDescription className="mt-2 text-slate-600 text-lg">
                    Aperçu détaillé des performances financières.
                  </CardDescription>
                </div>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-full sm:w-[180px] rounded-2xl h-12 text-base">
                    <SelectValue placeholder="Choisir période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Semaine</SelectItem>
                    <SelectItem value="month">Mois</SelectItem>
                    <SelectItem value="year">Année</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {reports.map((report, index) => (
                <div key={index} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Key Metrics */}
                  <div className="lg:col-span-1 space-y-6">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 rounded-2xl">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-bold">Bénéfice Net</CardTitle>
                        <DollarSign className="h-5 w-5 text-blue-500" />
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold text-blue-600">
                          {report.profit.toLocaleString()} MAD
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          {report.period}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white rounded-2xl">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700">Revenus</span>
                          <span className="font-bold text-green-600">
                            {report.revenue.toLocaleString()} MAD
                          </span>
                        </div>
                        <hr className="my-3" />
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700">Dépenses</span>
                          <span className="font-bold text-red-600">
                            {report.expenses.toLocaleString()} MAD
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column: Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Card className="border-0 shadow-lg bg-white rounded-2xl">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-base font-bold">Factures</CardTitle>
                          <FileText className="h-4 w-4 text-slate-500" />
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{report.invoiceCount} émises</p>
                          <p className="text-sm text-slate-500">
                            {report.paidInvoices} payées
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="border-0 shadow-lg bg-white rounded-2xl">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-base font-bold">Montant en Attente</CardTitle>
                          <Clock className="h-4 w-4 text-slate-500" />
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">
                            {report.pendingAmount.toLocaleString()} MAD
                          </p>
                          <p className="text-sm text-slate-500">
                            {report.invoiceCount - report.paidInvoices} factures
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <Card className="border-0 shadow-lg bg-white rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-base font-bold">Répartition des revenus</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {/* Placeholder for a chart */}
                        <div className="h-48 flex items-center justify-center bg-slate-50 rounded-xl">
                          <BarChart3 className="h-12 w-12 text-slate-300" />
                          <span className="ml-4 text-slate-400">Graphique à venir</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}