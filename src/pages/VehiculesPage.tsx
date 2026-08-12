import { useEffect, useState } from 'react';
import { vehiculeApi } from '@/api/vehicule.api';
import { proprietaireApi } from '@/api/proprietaire.api';
import { VehiculeResponse, EtatVehicule } from '@/types/vehicule.type';
import { ProprietaireResponse } from '@/types/proprietaire.type';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Car, MoreVertical, Wrench, AlertCircle, CheckCircle2, Archive, Banknote, UserSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { AddVehiculeModal } from '@/components/vehicules/AddVehiculeModal';

// IMPORTS POUR LE MENU DÉROULANT
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getStatusBadge = (etat: EtatVehicule) => {
    switch (etat) {
        case 'ACTIF':
            return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> En service</Badge>;
        case 'EN_PANNE':
            return <Badge variant="destructive" className="animate-pulse"><AlertCircle className="w-3 h-3 mr-1" /> En panne</Badge>;
        case 'AU_GARAGE':
            return <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-200"><Wrench className="w-3 h-3 mr-1" /> Au garage</Badge>;
        case 'VENDU':
            return <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-200"><Banknote className="w-3 h-3 mr-1" /> Vendu</Badge>;
        case 'ARCHIVE':
            return <Badge variant="secondary"><Archive className="w-3 h-3 mr-1" /> Archivé</Badge>;
        default:
            return <Badge variant="outline">{etat}</Badge>;
    }
};

const VehiculesPage = () => {
    const [vehicules, setVehicules] = useState<VehiculeResponse[]>([]);
    const [proprietaires, setProprietaires] = useState<ProprietaireResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchVehicules();
    }, []);

    const fetchVehicules = async () => {
        try {
            const [vehicData, propData] = await Promise.all([
                vehiculeApi.lister(),
                proprietaireApi.lister()
            ]);
            setVehicules(vehicData);
            setProprietaires(propData);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les données", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    // CORRECTION ICI : On force la conversion en String pour éviter les bugs Number vs String
    const getProprietaire = (id: any) => proprietaires.find(p => String(p.id) === String(id));

    const handleChangerEtat = async (id: number, nouvelEtat: EtatVehicule) => {
        try {
            await vehiculeApi.changerEtat(id, nouvelEtat);
            toast({ title: "Succès", description: `Le statut du véhicule a été mis à jour.` });
            fetchVehicules();
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de modifier l'état.", variant: "destructive" });
        }
    };

    const handleArchiver = async (id: number) => {
        if (!window.confirm("Êtes-vous sûr de vouloir archiver ce véhicule ?")) return;
        try {
            await vehiculeApi.archiver(id);
            toast({ title: "Succès", description: "Véhicule archivé avec succès." });
            fetchVehicules();
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible d'archiver ce véhicule.", variant: "destructive" });
        }
    };

    const filteredVehicules = vehicules.filter(v =>
        v.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.modele.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Gestion de la Flotte</h1>
                    <p className="text-sm text-muted-foreground">Consultez et gérez l'état de vos véhicules en temps réel.</p>
                </div>
                <Button className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4" /> Ajouter un véhicule
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher immatriculation, marque, modèle..."
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
                            Chargement des véhicules...
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-md border border-border/50">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50 bg-muted/50">
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Véhicule</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Propriétaire</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Immatriculation</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Mise en circulation</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Statut</th>
                                        <th className="h-12 px-4 text-right font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredVehicules.map((v) => {
                                        // CORRECTION ICI : Détection intelligente du propriétaire
                                        let nomAffiche = "Non défini";
                                        const proprioTrouve = getProprietaire(v.idProprietaire);
                                        const vAny = v as any; // Pour gérer les cas non définis dans le type TypeScript

                                        if (v.nomCompletProprietaire) {
                                            nomAffiche = v.nomCompletProprietaire; // Si le backend renvoie le champ
                                        } else if (vAny.proprietaire && vAny.proprietaire.nom) {
                                            nomAffiche = `${vAny.proprietaire.nom} ${vAny.proprietaire.prenoms}`; // Si le backend renvoie l'objet entier
                                        } else if (proprioTrouve) {
                                            nomAffiche = `${proprioTrouve.nom} ${proprioTrouve.prenoms}`; // Croisement réussi via l'ID
                                        } else if (v.idProprietaire) {
                                            nomAffiche = `ID: ${v.idProprietaire} (Introuvable)`;
                                        }

                                        return (
                                            <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                                                            <Car className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-foreground">{v.marque}</p>
                                                            <p className="text-xs text-muted-foreground">{v.modele}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <UserSquare className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium text-foreground">
                                                            {nomAffiche}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-mono font-medium">
                                                    {v.immatriculation}
                                                </td>
                                                <td className="p-4 text-muted-foreground">
                                                    {v.dateMiseEnCirculation ? new Date(v.dateMiseEnCirculation + 'T00:00:00').toLocaleDateString('fr-FR') : '-'}
                                                </td>
                                                <td className="p-4">
                                                    {getStatusBadge(v.etat)}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="hover:bg-muted">
                                                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />

                                                            {v.etat === EtatVehicule.ACTIF && (
                                                                <>
                                                                    <DropdownMenuItem onClick={() => handleChangerEtat(v.id, EtatVehicule.EN_PANNE)}>
                                                                        <AlertCircle className="mr-2 h-4 w-4 text-red-500" /> Signaler une panne
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleChangerEtat(v.id, EtatVehicule.AU_GARAGE)}>
                                                                        <Wrench className="mr-2 h-4 w-4 text-orange-500" /> Mettre au garage
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}

                                                            {(v.etat === EtatVehicule.EN_PANNE || v.etat === EtatVehicule.AU_GARAGE) && (
                                                                <DropdownMenuItem onClick={() => handleChangerEtat(v.id, EtatVehicule.ACTIF)}>
                                                                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Remettre en service
                                                                </DropdownMenuItem>
                                                            )}

                                                            {v.etat !== EtatVehicule.ARCHIVE && (
                                                                <>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => handleArchiver(v.id)} className="text-destructive focus:text-destructive">
                                                                        <Archive className="mr-2 h-4 w-4" /> Archiver
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {filteredVehicules.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <Car className="h-12 w-12 mb-4 opacity-20" />
                                    <p>Aucun véhicule trouvé.</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AddVehiculeModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchVehicules}
            />
        </div>
    );
};

export default VehiculesPage;