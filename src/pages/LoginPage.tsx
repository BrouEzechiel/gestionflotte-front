import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useToast } from '@/hooks/use-toast.ts';

// 1. IMPORTATION DU LOGO ICI
import logoFlotte from '@/assets/logo.jpeg';

const LoginPage = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [identifiant, setIdentifiant] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login({ identifiant: identifiant, motDePasse: password });
            navigate('/dashboard');
        } catch (err: unknown) {
            let message = "Identifiants incorrects ou serveur injoignable.";

            if (typeof err === 'object' && err !== null) {
                const errorWithResponse = err as {
                    response?: {
                        data?: { message?: string }
                    }
                };

                if (errorWithResponse.response?.data?.message) {
                    message = errorWithResponse.response.data.message;
                }
            } else if (err instanceof Error) {
                message = err.message;
            }

            toast({
                title: 'Erreur',
                description: message,
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-md animate-fade-in">

                {/* 2. REMPLACEMENT DU LOGO ICI */}
                <div className="mb-6 flex flex-col items-center text-center">
                    <img
                        src={logoFlotte}
                        alt="FlotteGo Logo"
                        className="h-20 w-auto object-contain mb-2 rounded-lg"
                    />
                    <p className="text-muted-foreground text-sm">Gestion de flotte intelligente</p>
                </div>

                <Card className="shadow-xl border-0 bg-card">
                    <CardHeader className="text-center">
                        <CardTitle className="font-display text-xl">Connexion</CardTitle>
                        <CardDescription>Accédez à votre espace de gestion</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="identifiant">Identifiant (Nom d'utilisateur)</Label>
                                <Input
                                    id="identifiant"
                                    type="text"
                                    placeholder="admin@flotte.com"
                                    value={identifiant}
                                    onChange={e => setIdentifiant(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Connexion en cours...' : 'Se connecter'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;