import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // N'oubliez pas d'installer ce composant shadcn si vous ne l'avez pas (npx shadcn-ui@latest add textarea)
import { useToast } from '@/hooks/use-toast';
import { depenseApi } from '@/api/depense.api';
import { vehiculeApi } from '@/api/vehicule.api';
import { DepenseRequest, TypeDepense } from '@/types/depense.type';
import { VehiculeResponse, EtatVehicule } from '@/types/vehicule.type';
import { Receipt } from 'lucide-react';

interface AddDepenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddDepenseModal = ({ isOpen, onClose, onSuccess }: AddDepenseModalProps) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [vehicules, setVehicules] = useState<VehiculeResponse[]>([]);

    const [formData, setFormData] = useState<DepenseRequest>({
        idVehicule: 0,
        montant: 0,
        description: '',
        typeDepense: TypeDepense.ENTRETIEN,
        dateDepense: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (isOpen) {
            chargerVehicules();
        }
    }, [isOpen]);

    const chargerVehicules = async () => {
        try {
            const data = await vehiculeApi.lister();
            // On affiche tous les véhicules sauf ceux archivés (car on peut réparer un véhicule "EN_PANNE")
            setVehicules(data.filter(v => v.etat !== EtatVehicule.ARCHIVE && v.etat !== EtatVehicule.VENDU));
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les véhicules.", variant: "destructive" });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'idVehicule' || name === 'montant') ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.idVehicule === 0) {
            toast({ title: "Attention", description: "Veuillez sélectionner un véhicule.", variant: "destructive" });
            return;
        }
        if (formData.montant <= 0) {
            toast({ title: "Attention", description: "Le montant doit être supérieur à zéro.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            await depenseApi.ajouter(formData);
            toast({ title: "Succès", description: "Dépense enregistrée avec succès." });
            onSuccess();
            onClose();

            // Réinitialisation
            setFormData({
                idVehicule: 0,
                montant: 0,
                description: '',
                typeDepense: TypeDepense.ENTRETIEN,
                dateDepense: new Date().toISOString().split('T')[0],
            });
        } catch (error) {
            toast({ title: "Erreur", description: "Erreur lors de l'enregistrement de la dépense.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <Receipt className="h-5 w-5" />
                        Nouvelle Dépense
                    </DialogTitle>
                    <DialogDescription>
                        Enregistrez une sortie d'argent liée à un véhicule.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="idVehicule">Véhicule concerné *</Label>
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
                            <Label htmlFor="typeDepense">Catégorie *</Label>
                            <select
                                id="typeDepense"
                                name="typeDepense"
                                value={formData.typeDepense}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            >
                                <option value={TypeDepense.ENTRETIEN}>Entretien</option>
                                <option value={TypeDepense.REPARATION}>Réparation</option>
                                <option value={TypeDepense.ASSURANCE}>Assurance</option>
                                <option value={TypeDepense.IMPOT}>Impôts / Taxes</option>
                                <option value={TypeDepense.VISITE_TECHNIQUE}>Visite Technique</option>
                                <option value={TypeDepense.AUTRE}>Autre</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="montant">Montant (CFA) *</Label>
                            <Input
                                id="montant"
                                name="montant"
                                type="number"
                                min="1"
                                placeholder="Ex: 25000"
                                value={formData.montant || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dateDepense">Date de la dépense *</Label>
                        <Input
                            id="dateDepense"
                            name="dateDepense"
                            type="date"
                            value={formData.dateDepense}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Détails) *</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Ex: Remplacement des plaquettes de frein..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="resize-none"
                            rows={3}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Annuler
                        </Button>
                        <Button type="submit" variant="destructive" disabled={loading}>
                            {loading ? "Enregistrement..." : "Enregistrer la dépense"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};