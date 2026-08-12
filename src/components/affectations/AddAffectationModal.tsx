import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { affectationApi } from '@/api/affectation.api';
import { chauffeurApi } from '@/api/chauffeur.api';
import { vehiculeApi } from '@/api/vehicule.api';
import { AffectationRequest } from '@/types/affectation.type';
import { ChauffeurResponse } from '@/types/chauffeur.type';
import { VehiculeResponse } from '@/types/vehicule.type';
import { Link2 } from 'lucide-react';

interface AddAffectationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddAffectationModal = ({ isOpen, onClose, onSuccess }: AddAffectationModalProps) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Listes pour les menus déroulants
    const [chauffeurs, setChauffeurs] = useState<ChauffeurResponse[]>([]);
    const [vehicules, setVehicules] = useState<VehiculeResponse[]>([]);

    // L'état du formulaire
    const [formData, setFormData] = useState<AffectationRequest>({
        idChauffeur: 0,
        idVehicule: 0,
        recetteAttendueJournaliere: 0,
        dateDebut: new Date().toISOString().split('T')[0], // Date du jour par défaut
    });

    // Charger les listes quand la modale s'ouvre
    useEffect(() => {
        if (isOpen) {
            chargerListes();
        }
    }, [isOpen]);

    const chargerListes = async () => {
        try {
            const [chauffData, vehicData] = await Promise.all([
                chauffeurApi.lister(),
                vehiculeApi.lister()
            ]);
            // On ne garde idéalement que les chauffeurs et véhicules Actifs
            setChauffeurs(chauffData.filter(c => c.statut === 'ACTIF'));
            setVehicules(vehicData.filter(v => v.etat === 'ACTIF'));
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les listes de sélection.", variant: "destructive" });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            // On convertit en nombre les champs qui sont des IDs ou des montants
            [name]: (name === 'idChauffeur' || name === 'idVehicule' || name === 'recetteAttendueJournaliere')
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Petites validations manuelles
        if (formData.idChauffeur === 0 || formData.idVehicule === 0) {
            toast({ title: "Attention", description: "Veuillez sélectionner un chauffeur et un véhicule.", variant: "destructive" });
            return;
        }
        if (formData.recetteAttendueJournaliere <= 0) {
            toast({ title: "Attention", description: "La recette journalière doit être supérieure à zéro.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            await affectationApi.creer(formData);
            toast({
                title: "Succès",
                description: "L'affectation a été créée avec succès.",
                className: "bg-green-50 border-green-200 text-green-800",
            });
            onSuccess();
            onClose();

            // Réinitialisation
            setFormData({
                idChauffeur: 0,
                idVehicule: 0,
                recetteAttendueJournaliere: 0,
                dateDebut: new Date().toISOString().split('T')[0],
            });
        } catch (error: any) {
            // Afficher le message d'erreur du backend s'il y en a un (ex: "Véhicule déjà affecté")
            const message = error.response?.data?.message || "Erreur lors de la création de l'affectation.";
            toast({ title: "Erreur", description: message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Link2 className="h-5 w-5 text-primary" />
                        Nouvelle Affectation
                    </DialogTitle>
                    <DialogDescription>
                        Associez un chauffeur à un véhicule et définissez la recette exigée.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="idChauffeur">Chauffeur *</Label>
                        <select
                            id="idChauffeur"
                            name="idChauffeur"
                            value={formData.idChauffeur}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            required
                        >
                            <option value={0} disabled>-- Sélectionnez un chauffeur --</option>
                            {chauffeurs.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.nom} {c.prenoms}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="idVehicule">Véhicule *</Label>
                        <select
                            id="idVehicule"
                            name="idVehicule"
                            value={formData.idVehicule}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            required
                        >
                            <option value={0} disabled>-- Sélectionnez un véhicule --</option>
                            {vehicules.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.marque} ({v.immatriculation})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="recetteAttendueJournaliere">Recette / Jour (CFA) *</Label>
                            <Input
                                id="recetteAttendueJournaliere"
                                name="recetteAttendueJournaliere"
                                type="number"
                                min="1"
                                placeholder="Ex: 15000"
                                value={formData.recetteAttendueJournaliere || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dateDebut">Date de début</Label>
                            <Input
                                id="dateDebut"
                                name="dateDebut"
                                type="date"
                                value={formData.dateDebut}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Création..." : "Créer l'affectation"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};