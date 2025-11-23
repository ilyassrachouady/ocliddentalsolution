import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  FileText, 
  User, 
  Calculator, 
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  Receipt,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

interface InvoiceItem {
  id: string;
  treatmentId: string;
  treatmentName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface NewInvoiceFormProps {
  onSuccess?: (invoice: any) => void;
  onCancel?: () => void;
}

// Mock data - replace with actual API calls
const mockPatients = [
  { id: '1', name: 'Fatima Alami', phone: '+212 6 11 22 33 44' },
  { id: '2', name: 'Ahmed Benali', phone: '+212 6 55 66 77 88' },
  { id: '3', name: 'Sarah Cohen', phone: '+212 6 99 88 77 66' },
];

const mockTreatments = [
  { id: 'tr1', name: 'Consultation initiale', price: 300 },
  { id: 'tr2', name: 'Nettoyage dentaire', price: 800 },
  { id: 'tr3', name: 'Plombage', price: 600 },
  { id: 'tr4', name: 'Couronne dentaire', price: 3500 },
  { id: 'tr5', name: 'Implant dentaire', price: 8000 },
  { id: 'tr6', name: 'Blanchiment dentaire', price: 1500 },
  { id: 'tr7', name: 'Extraction dentaire', price: 500 },
  { id: 'tr8', name: 'Appareil dentaire', price: 12000 },
];

export default function NewInvoiceForm({ onSuccess, onCancel }: NewInvoiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [openPatient, setOpenPatient] = useState(false);
  const [searchPatient, setSearchPatient] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    patientId: '',
    dueDate: '',
    notes: '',
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      treatmentId: '',
      treatmentName: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }
  ]);

  const taxRate = 0.20; // 20% TVA

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * taxRate;
    const total = subtotal; // Total sans TVA
    
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  useEffect(() => {
    if (openPatient && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [openPatient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId) {
      toast.error('Veuillez sélectionner un patient');
      return;
    }
    
    if (items.length === 0 || items[0].treatmentId === '') {
      toast.error('Veuillez ajouter au moins un traitement');
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedPatient = mockPatients.find(p => p.id === formData.patientId);
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      
      const newInvoice = {
        id: invoiceNumber,
        patientId: formData.patientId,
        patientName: selectedPatient?.name || '',
        items: items.filter(item => item.treatmentId !== ''),
        subtotal,
        tax,
        total,
        status: 'draft',
        createdAt: new Date(),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        notes: formData.notes,
      };

      toast.success('Facture créée avec succès!');
      onSuccess?.(newInvoice);
    } catch (error) {
      toast.error('Erreur lors de la création de la facture');
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      treatmentId: '',
      treatmentName: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: string, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Update treatment name and price when treatment is selected
        if (field === 'treatmentId') {
          const treatment = mockTreatments.find(t => t.id === value);
          if (treatment) {
            updatedItem.treatmentName = treatment.name;
            updatedItem.unitPrice = treatment.price;
            updatedItem.total = updatedItem.quantity * treatment.price;
          }
        }
        
        // Recalculate total when quantity changes
        if (field === 'quantity') {
          updatedItem.total = updatedItem.unitPrice * (value as number);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  return (
    <div className="space-y-6 max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-6 rounded-t-3xl border-b border-slate-200/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Nouvelle Facture</h2>
            <p className="text-slate-600">Génération automatique de facture pour traitement</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 space-y-6">
        {/* Patient Selection */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg text-slate-900">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              Informations patient
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Patient *</Label>
                <Select 
                  value={formData.patientId} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, patientId: value }));
                    setSearchPatient('');
                  }}
                  open={openPatient}
                  onOpenChange={setOpenPatient}
                >
                  <SelectTrigger className="h-12 rounded-xl border border-slate-200 bg-white">
                    <SelectValue placeholder="Sélectionner un patient" />
                  </SelectTrigger>
                  <SelectContent 
                    onInteractOutside={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.closest('[data-search-input]')) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className="sticky top-0 bg-white border-b border-slate-200 p-2 z-10" data-search-input>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Rechercher..."
                          value={searchPatient}
                          onChange={(e) => setSearchPatient(e.target.value)}
                          className="w-full h-9 pl-10 pr-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === 'Escape') {
                              setOpenPatient(false);
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                          }}
                          onFocus={(e) => {
                            e.stopPropagation();
                          }}
                        />
                      </div>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                      {mockPatients
                        .filter(patient => 
                          patient.name.toLowerCase().includes(searchPatient.toLowerCase()) ||
                          patient.phone.includes(searchPatient)
                        )
                        .map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            <div className="flex flex-col">
                              <span className="font-semibold">{patient.name}</span>
                              <span className="text-sm text-slate-500">{patient.phone}</span>
                            </div>
                          </SelectItem>
                        ))}
                      {mockPatients.filter(patient => 
                        patient.name.toLowerCase().includes(searchPatient.toLowerCase()) ||
                        patient.phone.includes(searchPatient)
                      ).length === 0 && (
                        <div className="p-4 text-center text-sm text-slate-500">
                          Aucun patient trouvé
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-sm font-bold text-slate-700">Date d'échéance</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="h-12 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-lg text-slate-900">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Receipt className="h-4 w-4 text-white" />
                </div>
                Traitements & Services
              </CardTitle>
              <Button
                type="button"
                onClick={addItem}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl h-10 px-4 font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <Card key={item.id} className="border border-slate-200 bg-white rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Traitement</Label>
                      <Select onValueChange={(value) => updateItem(item.id, 'treatmentId', value)}>
                        <SelectTrigger className="h-10 rounded-lg border border-slate-200">
                          <SelectValue placeholder="Choisir un traitement" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockTreatments.map((treatment) => (
                            <SelectItem key={treatment.id} value={treatment.id}>
                              <div className="flex justify-between items-center w-full">
                                <span>{treatment.name}</span>
                                <span className="text-sm text-slate-500 ml-4">{treatment.price} MAD</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Quantité</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="h-10 rounded-lg border border-slate-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Prix unitaire</Label>
                      <div className="h-10 bg-slate-50 rounded-lg flex items-center px-3 text-slate-700 font-semibold">
                        {item.unitPrice} MAD
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex-1 space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Total</Label>
                        <div className="h-10 bg-blue-50 rounded-lg flex items-center px-3 text-blue-700 font-bold">
                          {item.total} MAD
                        </div>
                      </div>
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-10 w-10 p-0 rounded-lg border-red-200 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Totals */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/30 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg text-slate-900">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calculator className="h-4 w-4 text-white" />
              </div>
              Récapitulatif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center py-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl px-6">
              <span className="text-2xl font-bold text-slate-900">Total</span>
              <span className="text-3xl font-bold text-purple-600">{total.toFixed(2)} MAD</span>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/30 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg text-slate-900">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              Notes additionnelles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="rounded-xl border border-slate-200 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
              rows={3}
              placeholder="Conditions de paiement, remarques particulières..."
            />
          </CardContent>
        </Card>
      </form>

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-6 rounded-b-3xl border-t border-slate-200/50 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-12 px-6 rounded-xl border-slate-300 font-semibold"
          >
            <X className="mr-2 h-5 w-5" />
            Annuler
          </Button>
          <Button
            type="button"
            className="h-12 px-6 rounded-xl bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 font-semibold"
          >
            <Eye className="mr-2 h-5 w-5" />
            Aperçu
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !formData.patientId || items.length === 0}
            className="h-12 px-8 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 font-bold text-lg"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Création...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-3 h-5 w-5" />
                Créer la facture
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}