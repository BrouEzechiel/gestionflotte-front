import { useEffect, useState } from 'react';
import { versementApi } from '@/api/versement.api';
import { VersementResponse, StatutVersement } from '@/types/versement.type';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Banknote, CheckCircle2, AlertTriangle, ArrowUpCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { AddVersementModal } from '@/components/versements/AddVersementModal';

const formatCFA = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n);

const getStatusBadge = (statut: StatutVersement) => {
    switch (statut) {
        case 'SOLDE':
            return <Badge className="bg-green-500/10 text-green-600 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Solde</Badge>;
        case 'RELIQUAT':
            return <Badge className="bg-red-500/10 text-red-600 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" /> Reliquat</Badge>;
        case 'AVANCE':
            return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200"><ArrowUpCircle className="w-3 h-3 mr-1" /> Avance</Badge>;
        default:
            return <Badge variant="outline">{statut}</Badge>;
    }
};

const VersementsPage = () => {
    const [versements, setVersements] = useState<VersementResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchVersements();
    }, []);

    const fetchVersements = async () => {
        try {
            const data = await versementApi.lister();
            setVersements(data);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les versements.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    // Filtrer par nom ou marque du véhicule
    const filteredVersements = versements.filter(v => {
        const searchLower = searchTerm.toLowerCase();
        return (
            v.nomChauffeur?.toLowerCase().includes(searchLower) ||
            v.marqueVehicule?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Caisse & Versements</h1>
                    <p className="text-sm text-muted-foreground">Suivez les encaissements, soldes et reliquats de vos chauffeurs.</p>
                </div>
                <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white" onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4" /> Nouveau Versement
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher chauffeur ou véhicule..."
                            className="pl-8 bg-muted/50 border-transparent focus:bg-background"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent mb-4"></div>
                            Chargement de la caisse...
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-md border border-border/50">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50 bg-muted/50">
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Date</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Chauffeur</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Véhicule</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Montant Versé</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Écart</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredVersements.map((v) => (
                                        <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4 text-muted-foreground">
                                                {v.dateVersement ? new Date(v.dateVersement).toLocaleDateString('fr-FR') : '-'}
                                            </td>
                                            <td className="p-4 font-medium text-foreground">
                                                {v.nomChauffeur || `Affectation ID: ${v.idAffectation}`}
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {v.marqueVehicule || '-'}
                                            </td>
                                            <td className="p-4 font-bold text-foreground">
                                                {formatCFA(v.montantVerse)}
                                            </td>
                                            <td className={`p-4 font-medium ${v.ecart < 0 ? 'text-red-500' : v.ecart > 0 ? 'text-blue-500' : 'text-green-500'}`}>
                                                {v.ecart > 0 ? '+' : ''}{formatCFA(v.ecart)}
                                            </td>
                                            <td className="p-4">
                                                {getStatusBadge(v.statut)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredVersements.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <Banknote className="h-12 w-12 mb-4 opacity-20" />
                                    <p>Aucun versement enregistré.</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
            <AddVersementModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchVersements}
            />
        </div>
    );
};

export default VersementsPage;