import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { vehiculeApi } from '@/api/vehicule.api';
import { proprietaireApi } from '@/api/proprietaire.api';
import { VehiculeRequest, EtatVehicule } from '@/types/vehicule.type';
import { ProprietaireResponse } from '@/types/proprietaire.type';
import { Car } from 'lucide-react';

interface AddVehiculeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddVehiculeModal = ({ isOpen, onClose, onSuccess }: AddVehiculeModalProps) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [proprietaires, setProprietaires] = useState<ProprietaireResponse[]>([]);

    const [formData, setFormData] = useState<VehiculeRequest>({
        immatriculation: '',
        marque: '',
        modele: '',
        dateMiseEnCirculation: '',
        etat: 'ACTIF' as EtatVehicule,
        idProprietaire: 0,
    });

    useEffect(() => {
        if (isOpen) {
            const fetchProprietaires = async () => {
                try {
                    const data = await proprietaireApi.lister();
                    setProprietaires(data);
                } catch (error) {
                    toast({ title: "Erreur", description: "Impossible de charger les propriétaires.", variant: "destructive" });
                }
            };
            fetchProprietaires();
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'idProprietaire' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // VALIDATION RENFORCÉE : Bloque si l'ID est 0, null, ou invalide
        if (!formData.idProprietaire || formData.idProprietaire <= 0) {
            toast({
                title: "Attention",
                description: "Veuillez sélectionner un propriétaire valide dans la liste.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            await vehiculeApi.ajouter(formData);
            toast({
                title: "Succès",
                description: "Le véhicule a été ajouté avec succès.",
                className: "bg-green-50 border-green-200 text-green-800",
            });
            onSuccess();
            onClose();
            // Réinitialisation du formulaire après succès
            setFormData({
                immatriculation: '',
                marque: '',
                modele: '',
                dateMiseEnCirculation: '',
                etat: 'ACTIF' as EtatVehicule,
                idProprietaire: 0,
            });
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: error.response?.data?.message || "Une erreur est survenue lors de l'ajout.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-primary" />
                        Nouveau Véhicule
                    </DialogTitle>
                    <DialogDescription>
                        Remplissez les informations ci-dessous pour ajouter un véhicule.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="idProprietaire">Propriétaire du véhicule *</Label>
                        <select
                            id="idProprietaire"
                            name="idProprietaire"
                            value={formData.idProprietaire}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            required
                        >
                            <option value={0} disabled>-- Sélectionner un propriétaire --</option>
                            {proprietaires.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.nom} {p.prenoms}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="immatriculation">Immatriculation *</Label>
                        <Input id="immatriculation" name="immatriculation" placeholder="Ex: 1234 AB 01" value={formData.immatriculation} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="marque">Marque *</Label>
                            <Input id="marque" name="marque" placeholder="Ex: Toyota" value={formData.marque} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="modele">Modèle *</Label>
                            <Input id="modele" name="modele" placeholder="Ex: Corolla" value={formData.modele} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dateMiseEnCirculation">Mise en circulation *</Label>
                        <Input id="dateMiseEnCirculation" name="dateMiseEnCirculation" type="date" value={formData.dateMiseEnCirculation} onChange={handleChange} required />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Ajout en cours..." : "Ajouter le véhicule"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};