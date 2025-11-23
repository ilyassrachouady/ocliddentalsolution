import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CreditCard,
  Plus,
  FileText,
  DollarSign,
  Receipt,
  BarChart3,
  Euro,
  Clock,
} from 'lucide-react';
import NewInvoiceForm from '@/components/NewInvoiceForm';
import { toast } from 'sonner';

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
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState('11');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedWeek, setSelectedWeek] = useState('1');

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
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

      setReports(mockReports);
    } catch (error) {
      console.error('Error loading billing data:', error);
    }
  };

  const getChartData = () => {
    if (selectedPeriod === 'week') {
      return [
        { label: 'Lun', value: 3200 },
        { label: 'Mar', value: 4100 },
        { label: 'Mer', value: 2800 },
        { label: 'Jeu', value: 5200 },
        { label: 'Ven', value: 4800 },
        { label: 'Sam', value: 6500 },
        { label: 'Dim', value: 1200 },
      ];
    } else if (selectedPeriod === 'month') {
      return [
        { label: 'Sem 1', value: 12000 },
        { label: 'Sem 2', value: 15200 },
        { label: 'Sem 3', value: 11800 },
        { label: 'Sem 4', value: 16600 },
      ];
    } else {
      return [
        { label: 'Jan', value: 45600 },
        { label: 'Fév', value: 38200 },
        { label: 'Mar', value: 52100 },
        { label: 'Avr', value: 48900 },
        { label: 'Mai', value: 56300 },
        { label: 'Juin', value: 51200 },
        { label: 'Juil', value: 44800 },
        { label: 'Août', value: 39500 },
        { label: 'Sep', value: 49200 },
        { label: 'Oct', value: 53800 },
        { label: 'Nov', value: 47600 },
        { label: 'Déc', value: 50100 },
      ];
    }
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map(d => d.value));

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
                    onSuccess={() => {
                      setShowInvoiceDialog(false);
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

      {/* Reports Section */}
      <div className="space-y-4">
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
                <div className="flex flex-wrap gap-3">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-full sm:w-[140px] rounded-2xl h-12 text-base">
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Semaine</SelectItem>
                      <SelectItem value="month">Mois</SelectItem>
                      <SelectItem value="year">Année</SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedPeriod === 'week' && (
                    <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                      <SelectTrigger className="w-full sm:w-[140px] rounded-2xl h-12 text-base">
                        <SelectValue placeholder="Semaine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Semaine 1</SelectItem>
                        <SelectItem value="2">Semaine 2</SelectItem>
                        <SelectItem value="3">Semaine 3</SelectItem>
                        <SelectItem value="4">Semaine 4</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {selectedPeriod === 'month' && (
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="w-full sm:w-[140px] rounded-2xl h-12 text-base">
                        <SelectValue placeholder="Mois" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Janvier</SelectItem>
                        <SelectItem value="2">Février</SelectItem>
                        <SelectItem value="3">Mars</SelectItem>
                        <SelectItem value="4">Avril</SelectItem>
                        <SelectItem value="5">Mai</SelectItem>
                        <SelectItem value="6">Juin</SelectItem>
                        <SelectItem value="7">Juillet</SelectItem>
                        <SelectItem value="8">Août</SelectItem>
                        <SelectItem value="9">Septembre</SelectItem>
                        <SelectItem value="10">Octobre</SelectItem>
                        <SelectItem value="11">Novembre</SelectItem>
                        <SelectItem value="12">Décembre</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full sm:w-[120px] rounded-2xl h-12 text-base">
                      <SelectValue placeholder="Année" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {reports.map((report, index) => (
                <div key={index} className="space-y-6">
                  {/* Top Row: Key Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

                  {/* Full Width Chart */}
                  <Card className="border-0 shadow-lg bg-white rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold">
                        Répartition des revenus - {selectedPeriod === 'week' ? 'Par jour' : selectedPeriod === 'month' ? 'Par semaine' : 'Par mois'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <div className="flex items-end justify-between h-full gap-2 px-4">
                          {chartData.map((item, index) => {
                            const height = (item.value / maxValue) * 100;
                            return (
                              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                                <div className="text-xs font-semibold text-slate-600">
                                  {item.value.toLocaleString()}
                                </div>
                                <div 
                                  className="w-full bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg hover:from-teal-600 hover:to-teal-500 transition-all duration-300 cursor-pointer shadow-md"
                                  style={{ height: `${height}%` }}
                                  title={`${item.label}: ${item.value.toLocaleString()} MAD`}
                                ></div>
                                <div className="text-sm font-medium text-slate-700">
                                  {item.label}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </CardContent>
          </Card>
      </div>
    </div>
  );
}