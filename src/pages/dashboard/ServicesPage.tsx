import { Plus, Edit, Trash2, Stethoscope, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface ServiceWithCNSS {
  id: string;
  name: string;
  description?: string;
  priceWithoutCNSS: number;
  priceWithCNSS: number;
}

export default function ServicesPage() {
  const { dentist } = useAuth();
  const [services, setServices] = useState<ServiceWithCNSS[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceWithCNSS | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceWithoutCNSS: '',
    priceWithCNSS: ''
  });

  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dentist]);

  const loadServices = () => {
    // Simuler le chargement des services depuis le dentist
    // En production, vous devrez adapter selon votre structure de données
    if (dentist?.services) {
      const servicesWithCNSS: ServiceWithCNSS[] = dentist.services.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        priceWithoutCNSS: s.price,
        priceWithCNSS: Math.round(s.price * 0.8) // 20% de réduction avec CNSS
      }));
      setServices(servicesWithCNSS);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      priceWithoutCNSS: '',
      priceWithCNSS: ''
    });
  };

  const handleAdd = () => {
    if (!formData.name || !formData.priceWithoutCNSS || !formData.priceWithCNSS) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newService: ServiceWithCNSS = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      priceWithoutCNSS: parseFloat(formData.priceWithoutCNSS),
      priceWithCNSS: parseFloat(formData.priceWithCNSS)
    };

    setServices([newService, ...services]);
    toast.success('Service ajouté avec succès!');
    setShowAddDialog(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedService || !formData.name || !formData.priceWithoutCNSS || !formData.priceWithCNSS) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setServices(services.map(s => 
      s.id === selectedService.id 
        ? {
            ...s,
            name: formData.name,
            description: formData.description,
            priceWithoutCNSS: parseFloat(formData.priceWithoutCNSS),
            priceWithCNSS: parseFloat(formData.priceWithCNSS)
          }
        : s
    ));

    toast.success('Service modifié avec succès!');
    setShowEditDialog(false);
    setSelectedService(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedService) return;

    setServices(services.filter(s => s.id !== selectedService.id));
    toast.success('Service supprimé avec succès!');
    setShowDeleteDialog(false);
    setSelectedService(null);
  };

  const openEditDialog = (service: ServiceWithCNSS) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      priceWithoutCNSS: service.priceWithoutCNSS.toString(),
      priceWithCNSS: service.priceWithCNSS.toString()
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (service: ServiceWithCNSS) => {
    setSelectedService(service);
    setShowDeleteDialog(true);
  };

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
                  <Stethoscope className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight">Gestion des Services</h1>
                  <p className="text-blue-100 mt-0.5 md:mt-1 text-xs sm:text-sm lg:text-base xl:text-lg font-medium">
                    Gérez vos services médicaux et tarifs
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => {
                resetForm();
                setShowAddDialog(true);
              }}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 rounded-lg md:rounded-xl px-3 py-1.5 md:px-5 md:py-2.5 h-auto font-semibold text-xs md:text-sm lg:text-base transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="mr-1 md:mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4" />
              Nouveau Service
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Total Services</p>
                <p className="text-3xl font-bold text-slate-900">{services.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Stethoscope className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Prix Moyen (Sans CNSS)</p>
                <p className="text-3xl font-bold text-slate-900">
                  {services.length > 0 
                    ? Math.round(services.reduce((acc, s) => acc + s.priceWithoutCNSS, 0) / services.length)
                    : 0} MAD
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Prix Moyen (Avec CNSS)</p>
                <p className="text-3xl font-bold text-slate-900">
                  {services.length > 0 
                    ? Math.round(services.reduce((acc, s) => acc + s.priceWithCNSS, 0) / services.length)
                    : 0} MAD
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services List */}
      <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="border-b-0 bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 p-6 md:p-8">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              Liste des Services
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              {services.length} service{services.length > 1 ? 's' : ''} disponible{services.length > 1 ? 's' : ''}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {services.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Stethoscope className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Aucun service</h3>
              <p className="text-slate-600 text-lg mb-6">Commencez par ajouter votre premier service médical.</p>
              <Button 
                onClick={() => {
                  resetForm();
                  setShowAddDialog(true);
                }}
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-2xl px-6 py-3 h-auto font-semibold"
              >
                <Plus className="mr-2 h-5 w-5" />
                Ajouter un Service
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50/30 hover:bg-slate-50">
                    <TableHead className="font-bold text-slate-900">Service</TableHead>
                    <TableHead className="font-bold text-slate-900">Description</TableHead>
                    <TableHead className="font-bold text-slate-900 text-right">Prix Sans CNSS</TableHead>
                    <TableHead className="font-bold text-slate-900 text-right">Prix Avec CNSS</TableHead>
                    <TableHead className="font-bold text-slate-900 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                            <Stethoscope className="h-4 w-4 text-white" />
                          </div>
                          <span>{service.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 max-w-xs">
                        <span className="line-clamp-2">{service.description || '-'}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold">
                          {service.priceWithoutCNSS} MAD
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold">
                          {service.priceWithCNSS} MAD
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(service)}
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-700 rounded-lg"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(service)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-700 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Service Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
              Ajouter un Service
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Créez un nouveau service médical avec ses tarifs
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name" className="text-sm font-semibold text-slate-700">
                Nom du service *
              </Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Consultation générale"
                className="rounded-xl h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-description" className="text-sm font-semibold text-slate-700">
                Description (optionnel)
              </Label>
              <Textarea
                id="add-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez ce service..."
                className="rounded-xl"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-price-without" className="text-sm font-semibold text-slate-700">
                  Prix sans CNSS (MAD) *
                </Label>
                <Input
                  id="add-price-without"
                  type="number"
                  value={formData.priceWithoutCNSS}
                  onChange={(e) => setFormData({ ...formData, priceWithoutCNSS: e.target.value })}
                  placeholder="0"
                  className="rounded-xl h-11"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-price-with" className="text-sm font-semibold text-slate-700">
                  Prix avec CNSS (MAD) *
                </Label>
                <Input
                  id="add-price-with"
                  type="number"
                  value={formData.priceWithCNSS}
                  onChange={(e) => setFormData({ ...formData, priceWithCNSS: e.target.value })}
                  placeholder="0"
                  className="rounded-xl h-11"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}
              className="flex-1 rounded-xl h-11 font-semibold"
            >
              Annuler
            </Button>
            <Button
              onClick={handleAdd}
              className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-xl h-11 font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Edit className="h-5 w-5 text-white" />
              </div>
              Modifier le Service
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Modifiez les informations du service
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-semibold text-slate-700">
                Nom du service *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Consultation générale"
                className="rounded-xl h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-sm font-semibold text-slate-700">
                Description (optionnel)
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez ce service..."
                className="rounded-xl"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price-without" className="text-sm font-semibold text-slate-700">
                  Prix sans CNSS (MAD) *
                </Label>
                <Input
                  id="edit-price-without"
                  type="number"
                  value={formData.priceWithoutCNSS}
                  onChange={(e) => setFormData({ ...formData, priceWithoutCNSS: e.target.value })}
                  placeholder="0"
                  className="rounded-xl h-11"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price-with" className="text-sm font-semibold text-slate-700">
                  Prix avec CNSS (MAD) *
                </Label>
                <Input
                  id="edit-price-with"
                  type="number"
                  value={formData.priceWithCNSS}
                  onChange={(e) => setFormData({ ...formData, priceWithCNSS: e.target.value })}
                  placeholder="0"
                  className="rounded-xl h-11"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setSelectedService(null);
                resetForm();
              }}
              className="flex-1 rounded-xl h-11 font-semibold"
            >
              Annuler
            </Button>
            <Button
              onClick={handleEdit}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl h-11 font-semibold"
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[450px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              Supprimer le Service
            </DialogTitle>
            <DialogDescription className="text-slate-600 pt-2">
              Êtes-vous sûr de vouloir supprimer le service <strong className="text-slate-900">{selectedService?.name}</strong> ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 pt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedService(null);
              }}
              className="flex-1 rounded-xl h-11 font-semibold"
            >
              Annuler
            </Button>
            <Button
              onClick={handleDelete}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl h-11 font-semibold"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
