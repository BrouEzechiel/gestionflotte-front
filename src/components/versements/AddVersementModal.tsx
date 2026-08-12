import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { versementApi } from '@/api/versement.api';
import { affectationApi } from '@/api/affectation.api';
import { chauffeurApi } from '@/api/chauffeur.api';
import { vehiculeApi } from '@/api/vehicule.api';
import { VersementRequest } from '@/types/versement.type';
import { AffectationResponse } from '@/types/affectation.type';
import { ChauffeurResponse } from '@/types/chauffeur.type';
import { VehiculeResponse } from '@/types/vehicule.type';
import { Banknote } from 'lucide-react';

interface AddVersementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddVersementModal = ({ isOpen, onClose, onSuccess }: AddVersementModalProps) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Listes pour l'affichage
    const [affectations, setAffectations] = useState<AffectationResponse[]>([]);
    const [chauffeurs, setChauffeurs] = useState<ChauffeurResponse[]>([]);
    const [vehicules, setVehicules] = useState<VehiculeResponse[]>([]);

    // L'état du formulaire selon votre VersementRequest
    const [formData, setFormData] = useState<VersementRequest>({
        idAffectation: 0,
        montantVerse: 0,
    });

    // Charger les données quand la modale s'ouvre
    useEffect(() => {
        if (isOpen) {
            chargerDonnees();
        }
    }, [isOpen]);

    const chargerDonnees = async () => {
        try {
            const [affData, chauffData, vehicData] = await Promise.all([
                affectationApi.lister(),
                chauffeurApi.lister(),
                vehiculeApi.lister()
            ]);
            // On ne garde que les affectations "EN_COURS" pour les versements
            setAffectations(affData.filter(a => a.statut === 'EN_COURS'));
            setChauffeurs(chauffData);
            setVehicules(vehicData);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les contrats en cours.", variant: "destructive" });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: Number(value) // On convertit tout en nombre car id et montant sont des numbers
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.idAffectation === 0) {
            toast({ title: "Attention", description: "Veuillez sélectionner un contrat (affectation).", variant: "destructive" });
            return;
        }
        if (formData.montantVerse <= 0) {
            toast({ title: "Attention", description: "Le montant versé doit être supérieur à zéro.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            await versementApi.enregistrer(formData);
            toast({
                title: "Versement enregistré",
                description: "La caisse a été mise à jour avec succès.",
                className: "bg-green-50 border-green-200 text-green-800",
            });
            onSuccess();
            onClose();

            // Réinitialisation
            setFormData({
                idAffectation: 0,
                montantVerse: 0,
            });
        } catch (error: any) {
            const message = error.response?.data?.message || "Erreur lors de l'enregistrement du versement.";
            toast({ title: "Erreur", description: message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    // Petite fonction pour trouver les infos à afficher dans le menu déroulant
    const getNomChauffeur = (id: number) => {
        const c = chauffeurs.find(c => c.id === id);
        return c ? `${c.nom} ${c.prenoms}` : `ID ${id}`;
    };

    const getPlaqueVehicule = (id: number) => {
        const v = vehicules.find(v => v.id === id);
        return v ? v.immatriculation : `ID ${id}`;
    };

    // Trouver la recette attendue pour l'afficher à titre indicatif
    const affectationSelectionnee = affectations.find(a => a.id === formData.idAffectation);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Banknote className="h-5 w-5 text-green-600" />
                        Nouveau Versement
                    </DialogTitle>
                    <DialogDescription>
                        Enregistrez la recette déposée par le chauffeur. Le système calculera automatiquement les reliquats ou les avances.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="idAffectation">Contrat (Chauffeur / Véhicule) *</Label>
                        <select
                            id="idAffectation"
                            name="idAffectation"
                            value={formData.idAffectation}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            required
                        >
                            <option value={0} disabled>-- Sélectionnez un contrat en cours --</option>
                            {affectations.map(a => (
                                <option key={a.id} value={a.id}>
                                    {getNomChauffeur(a.idChauffeur)} - {getPlaqueVehicule(a.idVehicule)}
                                </option>
                            ))}
                        </select>
                        {affectationSelectionnee && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Recette journalière attendue : <strong className="text-foreground">{affectationSelectionnee.recetteAttendueJournaliere} CFA</strong>
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="montantVerse">Montant versé (CFA) *</Label>
                        <Input
                            id="montantVerse"
                            name="montantVerse"
                            type="number"
                            min="1"
                            placeholder="Ex: 15000"
                            value={formData.montantVerse || ''}
                            onChange={handleChange}
                            required
                            className="text-lg font-bold text-green-700"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                            {loading ? "Encaissement..." : "Encaisser"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};