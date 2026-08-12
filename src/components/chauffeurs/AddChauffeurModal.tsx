import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { chauffeurApi } from '@/api/chauffeur.api';
import { ChauffeurRequest } from '@/types/chauffeur.type';
import { UserPlus } from 'lucide-react';

interface AddChauffeurModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Pour rafraîchir la liste après l'ajout
}

export const AddChauffeurModal = ({ isOpen, onClose, onSuccess }: AddChauffeurModalProps) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Notre état local correspond exactement à votre ChauffeurRequest Java
    const [formData, setFormData] = useState<ChauffeurRequest>({
        nom: '',
        prenoms: '',
        telephone: '',
        numeroPermis: '',
        adresse: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await chauffeurApi.enregistrer(formData);
            toast({
                title: "Succès",
                description: "Le chauffeur a été enregistré avec succès.",
                className: "bg-green-50 border-green-200 text-green-800",
            });
            onSuccess(); // On rafraîchit le tableau
            onClose();   // On ferme la fenêtre

            // On vide le formulaire
            setFormData({
                nom: '',
                prenoms: '',
                telephone: '',
                numeroPermis: '',
                adresse: '',
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible d'enregistrer ce chauffeur. Vérifiez les informations.",
                variant: "destructive",
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
                        <UserPlus className="h-5 w-5 text-primary" />
                        Nouveau Chauffeur
                    </DialogTitle>
                    <DialogDescription>
                        Saisissez les informations du chauffeur. Son statut sera "ACTIF" par défaut.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nom">Nom *</Label>
                            <Input
                                id="nom"
                                name="nom"
                                placeholder="Ex: KONE"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="prenoms">Prénoms *</Label>
                            <Input
                                id="prenoms"
                                name="prenoms"
                                placeholder="Ex: Moussa"
                                value={formData.prenoms}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="telephone">Téléphone *</Label>
                        <Input
                            id="telephone"
                            name="telephone"
                            placeholder="Ex: 0102030405"
                            value={formData.telephone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="numeroPermis">Numéro de Permis *</Label>
                        <Input
                            id="numeroPermis"
                            name="numeroPermis"
                            placeholder="Ex: PC-12345678"
                            value={formData.numeroPermis}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="adresse">Adresse complète *</Label>
                        <Input
                            id="adresse"
                            name="adresse"
                            placeholder="Ex: Abidjan, Yopougon Maroc"
                            value={formData.adresse}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};