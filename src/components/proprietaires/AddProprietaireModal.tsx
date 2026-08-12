import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { proprietaireApi } from '@/api/proprietaire.api';
import { ProprietaireRequest } from '@/types/proprietaire.type';
import { UserSquare } from 'lucide-react';

interface AddProprietaireModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddProprietaireModal = ({ isOpen, onClose, onSuccess }: AddProprietaireModalProps) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ProprietaireRequest>({
        nom: '',
        prenoms: '',
        telephone: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await proprietaireApi.ajouter(formData);
            toast({
                title: "Succès",
                description: "Le propriétaire a été ajouté.",
                className: "bg-green-50 border-green-200 text-green-800",
            });
            onSuccess();
            onClose();
            setFormData({ nom: '', prenoms: '', telephone: '' });
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: error.response?.data?.message || "Impossible d'ajouter le propriétaire.",
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
                        <UserSquare className="h-5 w-5 text-primary" />
                        Nouveau Propriétaire
                    </DialogTitle>
                    <DialogDescription>
                        Renseignez les informations du propriétaire du véhicule.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="nom">Nom *</Label>
                        <Input id="nom" name="nom" placeholder="Ex: DOSSO" value={formData.nom} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prenoms">Prénoms *</Label>
                        <Input id="prenoms" name="prenoms" placeholder="Ex: Souleymane" value={formData.prenoms} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="telephone">Téléphone *</Label>
                        <Input id="telephone" name="telephone" placeholder="Ex: 0102030405" value={formData.telephone} onChange={handleChange} required />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Ajout..." : "Ajouter"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};