"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Clock, AlertCircle, CheckCircle2, XCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Appointment {
  id: string;
  date_rdv: string;
  heure_rdv: string;
  type_rdv: string;
  description: string;
  status: string;
  status_display: string;
  date_category: string;
  created_at: string;
  updated_at: string;
}

interface AppointmentSummary {
  total: number;
  en_attente: number;
  confirme: number;
  annule: number;
  a_venir: number;
  aujourdhui: number;
  passe: number;
}

export default function RendezVousPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [summary, setSummary] = useState<AppointmentSummary>({
    total: 0,
    en_attente: 0,
    confirme: 0,
    annule: 0,
    a_venir: 0,
    aujourdhui: 0,
    passe: 0,
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    date_rdv: '',
    heure_rdv: '',
    type_rdv: 'consultation',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, isAuthenticated, token } = useAuth();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated || !token) {
      router.push('/connexion');
      return;
    }

    fetchAppointments();
  }, [isAuthenticated, token, router]);

  const fetchAppointments = async (status?: string, dateFrom?: string, dateTo?: string) => {
    if (!token) {
      router.push('/connexion');
      return;
    }

    try {
      setLoading(true);
      let url = `${process.env.NEXT_PUBLIC_API_URL}/rendez-vous/read.php`;
      const params = new URLSearchParams();
      
      if (status) params.append('status', status);
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        // Token is invalid or expired
        router.push('/connexion');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data.records);
      // Initialize summary with default values
      setSummary({
        total: data.records.length,
        en_attente: data.records.filter((a: Appointment) => a.status === 'en_attente').length,
        confirme: data.records.filter((a: Appointment) => a.status === 'confirme').length,
        annule: data.records.filter((a: Appointment) => a.status === 'annule').length,
        a_venir: data.records.filter((a: Appointment) => new Date(a.date_rdv) > new Date()).length,
        aujourdhui: data.records.filter((a: Appointment) => {
          const today = new Date();
          const apptDate = new Date(a.date_rdv);
          return apptDate.toDateString() === today.toDateString();
        }).length,
        passe: data.records.filter((a: Appointment) => new Date(a.date_rdv) < new Date()).length,
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rendez-vous",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rendez-vous/create.php`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create appointment');
      }

      toast({
        title: "Succès",
        description: "Rendez-vous créé avec succès",
      });

      // Reset form and close dialog
      setFormData({
        date_rdv: '',
        heure_rdv: '',
        type_rdv: 'consultation',
        description: ''
      });
      setIsFormOpen(false);

      // Refresh appointments list
      fetchAppointments();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de créer le rendez-vous",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirme':
        return 'bg-green-100 text-green-800';
      case 'annule':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'en_attente':
        return <AlertCircle className="w-4 h-4" />;
      case 'confirme':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'annule':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // If not authenticated, don't render the page content
  if (!isAuthenticated || !token) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mes Rendez-vous</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau rendez-vous
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[500px] rounded-2xl shadow-2xl p-8 bg-white border border-gray-200 relative"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-center mb-2">Prendre un rendez-vous</DialogTitle>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Remplissez le formulaire ci-dessous pour planifier votre rendez-vous
              </p>
            </DialogHeader>
            <form onSubmit={handleCreateAppointment} className="space-y-7 mt-2">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date_rdv" className="text-sm font-medium">
                    Date souhaitée
                  </Label>
                  <Input
                    type="date"
                    id="date_rdv"
                    required
                    value={formData.date_rdv}
                    onChange={(e) => setFormData({ ...formData, date_rdv: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heure_rdv" className="text-sm font-medium">
                    Heure souhaitée
                  </Label>
                  <Input
                    type="time"
                    id="heure_rdv"
                    required
                    value={formData.heure_rdv}
                    onChange={(e) => setFormData({ ...formData, heure_rdv: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type_rdv" className="text-sm font-medium">
                  Type de rendez-vous
                </Label>
                <Select
                  value={formData.type_rdv}
                  onValueChange={(value) => setFormData({ ...formData, type_rdv: value })}
                >
                  <SelectTrigger className="w-full rounded-lg border border-gray-300">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation" className="flex items-center gap-2">
                      <span className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        Consultation
                      </span>
                    </SelectItem>
                    <SelectItem value="suivi" className="flex items-center gap-2">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Suivi
                      </span>
                    </SelectItem>
                    <SelectItem value="urgence" className="flex items-center gap-2">
                      <span className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Urgence
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                  <span className="text-muted-foreground ml-1">(optionnel)</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez la raison de votre rendez-vous..."
                  className="min-h-[100px] resize-none rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700"
                  onClick={() => setIsFormOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Création en cours...
                    </span>
                  ) : (
                    "Créer le rendez-vous"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmés</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.confirme}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.en_attente}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Statut</h3>
                  <Tabs defaultValue="all" className="w-full" onValueChange={(value) => fetchAppointments(value === 'all' ? undefined : value)}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">Tous</TabsTrigger>
                      <TabsTrigger value="en_attente">En attente</TabsTrigger>
                      <TabsTrigger value="confirme">Confirmés</TabsTrigger>
                      <TabsTrigger value="annule">Annulés</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Date</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      if (date) {
                        const formattedDate = format(date, 'yyyy-MM-dd');
                        fetchAppointments(undefined, formattedDate, formattedDate);
                      }
                    }}
                    locale={fr}
                    className="rounded-md border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Liste des rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{appointment.type_rdv}</h3>
                              <Badge className={getStatusColor(appointment.status)}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(appointment.status)}
                                  {appointment.status_display}
                                </span>
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500 space-y-1">
                              <p className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                {format(new Date(appointment.date_rdv), 'PPP', { locale: fr })}
                              </p>
                              <p className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {appointment.heure_rdv}
                              </p>
                              {appointment.description && (
                                <p className="mt-2">{appointment.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aucun rendez-vous trouvé
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 