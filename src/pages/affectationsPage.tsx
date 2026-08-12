import { useEffect, useState } from 'react';
import { affectationApi } from '@/api/affectation.api';
import { chauffeurApi } from '@/api/chauffeur.api';
import { vehiculeApi } from '@/api/vehicule.api';
import { AffectationResponse, StatutAffectation } from '@/types/affectation.type';
import { ChauffeurResponse } from '@/types/chauffeur.type';
import { VehiculeResponse } from '@/types/vehicule.type';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Link2, Ban, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddAffectationModal } from '@/components/affectations/AddAffectationModal';

const formatCFA = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n);

const getStatusBadge = (statut: StatutAffectation) => {
    switch (statut) {
        case 'EN_COURS':
            return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> En cours</Badge>;
        case 'CLOTUREE':
            return <Badge variant="secondary"><Ban className="w-3 h-3 mr-1" /> Clôturée</Badge>;
        default:
            return <Badge variant="outline">{statut}</Badge>;
    }
};

const AffectationsPage = () => {
    const [affectations, setAffectations] = useState<AffectationResponse[]>([]);
    const [chauffeurs, setChauffeurs] = useState<ChauffeurResponse[]>([]);
    const [vehicules, setVehicules] = useState<VehiculeResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // On charge les 3 listes en même temps pour être très rapide !
            const [affData, chauffData, vehicData] = await Promise.all([
                affectationApi.lister(),
                chauffeurApi.lister(),
                vehiculeApi.lister()
            ]);
            setAffectations(affData);
            setChauffeurs(chauffData);
            setVehicules(vehicData);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les données.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleCloturer = async (id: number) => {
        if (!window.confirm("Voulez-vous vraiment clôturer cette affectation ? Le véhicule sera libéré.")) return;

        try {
            await affectationApi.cloturer(id);
            toast({ title: "Succès", description: "L'affectation a été clôturée." });
            fetchData(); // On rafraîchit la liste
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de clôturer l'affectation.", variant: "destructive" });
        }
    };

    // Fonctions pour trouver les infos à partir des IDs
    const getChauffeur = (id: number) => chauffeurs.find(c => c.id === id);
    const getVehicule = (id: number) => vehicules.find(v => v.id === id);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Affectations</h1>
                    <p className="text-sm text-muted-foreground">Associez un chauffeur à un véhicule et fixez la recette attendue.</p>
                </div>
                <Button className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4" /> Nouvelle Affectation
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent mb-4"></div>
                            Chargement des contrats...
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-md border border-border/50">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50 bg-muted/50">
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Date</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Chauffeur</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Véhicule</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Recette/Jour</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Statut</th>
                                        <th className="h-12 px-4 text-right font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {affectations.map((a) => {
                                        const chauffeur = getChauffeur(a.idChauffeur);
                                        const vehicule = getVehicule(a.idVehicule);
                                        return (
                                            <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="p-4 text-muted-foreground">
                                                    {new Date(a.dateDebut).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td className="p-4 font-medium text-foreground">
                                                    {chauffeur ? `${chauffeur.nom} ${chauffeur.prenoms}` : `ID: ${a.idChauffeur}`}
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="outline" className="font-mono">
                                                        {vehicule ? vehicule.immatriculation : `ID: ${a.idVehicule}`}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 font-bold text-primary">
                                                    {formatCFA(a.recetteAttendueJournaliere)}
                                                </td>
                                                <td className="p-4">
                                                    {getStatusBadge(a.statut)}
                                                </td>
                                                <td className="p-4 text-right">
                                                    {a.statut === 'EN_COURS' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleCloturer(a.id)}
                                                        >
                                                            Clôturer
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {affectations.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <Link2 className="h-12 w-12 mb-4 opacity-20" />
                                    <p>Aucune affectation trouvée.</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
            <AddAffectationModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchData}
            />
        </div >
    );
};

export default AffectationsPage;