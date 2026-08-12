import { useEffect, useState } from 'react';
import { proprietaireApi } from '@/api/proprietaire.api';
import { EtatProprietaireResponse } from '@/types/proprietaire.type';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, UserSquare, FileText, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { AddProprietaireModal } from '@/components/proprietaires/AddProprietaireModal';

const formatCFA = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n);

const ProprietairesPage = () => {
    const [etats, setEtats] = useState<EtatProprietaireResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchEtats();
    }, []);

    const fetchEtats = async () => {
        try {
            const data = await proprietaireApi.obtenirEtats();
            setEtats(data);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les propriétaires.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = async () => {
        setExportLoading(true);
        try {
            await proprietaireApi.exportExcel();
            toast({ title: "Succès", description: "Fichier Excel téléchargé." });
        } catch (error) {
            toast({ title: "Erreur", description: "Échec de l'export Excel.", variant: "destructive" });
        } finally {
            setExportLoading(false);
        }
    };

    const handleExportPdf = async () => {
        setExportLoading(true);
        try {
            await proprietaireApi.exportPdf();
            toast({ title: "Succès", description: "Fichier PDF téléchargé." });
        } catch (error) {
            toast({ title: "Erreur", description: "Échec de l'export PDF.", variant: "destructive" });
        } finally {
            setExportLoading(false);
        }
    };

    const filteredEtats = etats.filter(e =>
        e.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.prenoms?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Propriétaires & États Financiers</h1>
                    <p className="text-sm text-muted-foreground">Gérez les propriétaires et générez leurs rapports de rentabilité.</p>
                </div>
                <Button className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4" /> Nouveau Propriétaire
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un propriétaire..."
                            className="pl-8 bg-muted/50 border-transparent focus:bg-background"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={handleExportExcel} disabled={exportLoading || etats.length === 0}>
                            <FileText className="h-4 w-4 mr-2" /> Excel
                        </Button>
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleExportPdf} disabled={exportLoading || etats.length === 0}>
                            <Download className="h-4 w-4 mr-2" /> PDF
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent mb-4"></div>
                            Calcul des états financiers...
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-md border border-border/50">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50 bg-muted/50">
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Propriétaire</th>
                                        <th className="h-12 px-4 text-right font-medium text-muted-foreground">Total Versements</th>
                                        <th className="h-12 px-4 text-right font-medium text-muted-foreground">Total Dépenses</th>
                                        <th className="h-12 px-4 text-right font-medium text-muted-foreground">Gain Net</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredEtats.map((etat) => (
                                        <tr key={etat.idProprietaire} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                                                        <UserSquare className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">{etat.nom} {etat.prenoms}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right font-medium text-green-600">
                                                {formatCFA(etat.totalVersements)}
                                            </td>
                                            <td className="p-4 text-right font-medium text-red-500">
                                                - {formatCFA(etat.totalDepenses)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className={`inline-flex items-center gap-1 font-bold ${etat.gainNet >= 0 ? 'text-primary' : 'text-destructive'}`}>
                                                    {etat.gainNet >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                                    {formatCFA(etat.gainNet)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredEtats.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <UserSquare className="h-12 w-12 mb-4 opacity-20" />
                                    <p>Aucun propriétaire trouvé.</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AddProprietaireModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchEtats}
            />
        </div>
    );
};

export default ProprietairesPage;