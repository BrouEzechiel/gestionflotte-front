import { useEffect, useState } from 'react';
import { depenseApi } from '@/api/depense.api';
import { DepenseResponse, TypeDepense } from '@/types/depense.type';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Wrench, FileText, Shield, Car, HelpCircle, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { AddDepenseModal } from '@/components/depenses/AddDepenseModal';

const formatCFA = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n);

const getTypeBadge = (type: TypeDepense) => {
    switch (type) {
        case TypeDepense.REPARATION:
            return <Badge className="bg-red-500/10 text-red-600 border-red-200"><Wrench className="w-3 h-3 mr-1" /> Réparation</Badge>;
        case TypeDepense.ENTRETIEN:
            return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200"><Car className="w-3 h-3 mr-1" /> Entretien</Badge>;
        case TypeDepense.ASSURANCE:
            return <Badge className="bg-green-500/10 text-green-600 border-green-200"><Shield className="w-3 h-3 mr-1" /> Assurance</Badge>;
        case TypeDepense.IMPOT:
            return <Badge className="bg-orange-500/10 text-orange-600 border-orange-200"><Receipt className="w-3 h-3 mr-1" /> Impôt / Taxe</Badge>;
        case TypeDepense.VISITE_TECHNIQUE:
            return <Badge className="bg-purple-500/10 text-purple-600 border-purple-200"><FileText className="w-3 h-3 mr-1" /> Visite Tech.</Badge>;
        default:
            return <Badge variant="outline"><HelpCircle className="w-3 h-3 mr-1" /> Autre</Badge>;
    }
};

const DepensesPage = () => {
    const [depenses, setDepenses] = useState<DepenseResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchDepenses();
    }, []);

    const fetchDepenses = async () => {
        try {
            const data = await depenseApi.lister();
            setDepenses(data);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les dépenses.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const filteredDepenses = depenses.filter(d =>
        d.immatriculationVehicule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Gestion des Dépenses</h1>
                    <p className="text-sm text-muted-foreground">Suivez les coûts d'entretien, réparations et taxes de vos véhicules.</p>
                </div>
                <Button className="flex items-center gap-2" variant="destructive" onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4" /> Nouvelle Dépense
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher véhicule ou description..."
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
                            Chargement des dépenses...
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-md border border-border/50">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50 bg-muted/50">
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Date</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Véhicule</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Catégorie</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Description</th>
                                        <th className="h-12 px-4 text-right font-medium text-muted-foreground">Montant</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredDepenses.map((d) => (
                                        <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4 text-muted-foreground">
                                                {new Date(d.dateDepense).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="outline" className="font-mono">
                                                    {d.immatriculationVehicule}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                {getTypeBadge(d.typeDepense)}
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {d.description}
                                            </td>
                                            <td className="p-4 text-right font-bold text-destructive">
                                                - {formatCFA(d.montant)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredDepenses.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <Receipt className="h-12 w-12 mb-4 opacity-20" />
                                    <p>Aucune dépense enregistrée.</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AddDepenseModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchDepenses}
            />
        </div>
    );
};

export default DepensesPage;