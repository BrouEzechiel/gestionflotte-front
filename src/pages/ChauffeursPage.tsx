import { useEffect, useState } from 'react';
import { chauffeurApi } from '@/api/chauffeur.api';
import { ChauffeurResponse, StatutChauffeur } from '@/types/chauffeur.type';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, User, MoreVertical, Phone, CheckCircle2, AlertCircle, Coffee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { AddChauffeurModal } from '@/components/chauffeurs/AddChauffeurModal';

const getStatusBadge = (statut: StatutChauffeur) => {
    switch (statut) {
        case 'ACTIF':
            return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Actif</Badge>; //
        case 'SUSPENDU':
            return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Suspendu</Badge>; //
        case 'CONGE':
            return <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-200"><Coffee className="w-3 h-3 mr-1" /> En Congé</Badge>; //
        default:
            return <Badge variant="outline">{statut}</Badge>;
    }
};

const ChauffeursPage = () => {
    const [chauffeurs, setChauffeurs] = useState<ChauffeurResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchChauffeurs();
    }, []);

    const fetchChauffeurs = async () => {
        try {
            const data = await chauffeurApi.lister();
            setChauffeurs(data);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les chauffeurs", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const filteredChauffeurs = chauffeurs.filter(c =>
        c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.prenoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.telephone?.includes(searchTerm)
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Gestion des Chauffeurs</h1>
                    <p className="text-sm text-muted-foreground">Consultez et gérez les chauffeurs de votre flotte.</p>
                </div>
                <Button className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4" /> Ajouter un chauffeur
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un nom ou téléphone..."
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
                            Chargement des chauffeurs...
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-md border border-border/50">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50 bg-muted/50">
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Chauffeur</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Contact</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Permis</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Statut</th>
                                        <th className="h-12 px-4 text-right font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredChauffeurs.map((c) => (
                                        <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded-full shrink-0">
                                                        <User className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">{c.nom} {c.prenoms}</p>
                                                        <p className="text-xs text-muted-foreground line-clamp-1">{c.adresse}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-foreground">
                                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                                    {c.telephone}
                                                </div>
                                            </td>
                                            <td className="p-4 font-mono font-medium text-muted-foreground">
                                                {c.numeroPermis}
                                            </td>
                                            <td className="p-4">
                                                {getStatusBadge(c.statut)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button variant="ghost" size="icon" className="hover:bg-muted">
                                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredChauffeurs.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <User className="h-12 w-12 mb-4 opacity-20" />
                                    <p>Aucun chauffeur trouvé.</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
            <AddChauffeurModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchChauffeurs}
            />
        </div>
    );
};

export default ChauffeursPage;