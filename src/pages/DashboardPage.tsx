import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Activity,
    AlertCircle,
    Users,
    Truck,
    Wrench,
    Wallet,
    TrendingDown,
    PiggyBank,
    AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardApi } from '@/api/dashboard.api';
import { KpiJournalierResponse, DashboardStatsResponse } from '@/types/dashboard.type';
import { ChauffeurDetteResponse } from '@/types/chauffeur.type';
import { useToast } from '@/hooks/use-toast';

const formatCFA = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n);

// Fonction pour transformer "2026-03-13" en "ven." pour le graphique
const formatJour = (dateString: string) => {
    const date = new Date(dateString);
    const jour = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(date);
    return jour.charAt(0).toUpperCase() + jour.slice(1, 3);
};

const DashboardPage = () => {
    const { toast } = useToast();

    const [kpis, setKpis] = useState<KpiJournalierResponse | null>(null);
    const [dettes, setDettes] = useState<ChauffeurDetteResponse[]>([]);
    const [statsGen, setStatsGen] = useState<DashboardStatsResponse | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        chargerDonneesInitiales();
    }, []);

    const chargerDonneesInitiales = async () => {
        try {
            const [kpiData, dettesData, statsData] = await Promise.all([
                dashboardApi.getKpis(),
                dashboardApi.getAlertesDettes(),
                dashboardApi.getStatsGenerales()
            ]);
            setKpis(kpiData);
            setDettes(dettesData);
            setStatsGen(statsData);
        } catch (error) {
            toast({ title: 'Erreur', description: 'Impossible de charger les données du dashboard', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Chargement du tableau de bord...</div>;

    const chartData = statsGen?.recettesSur7Jours.map(recette => ({
        date: formatJour(recette.date),
        montant: recette.montant
    })) || [];

    // --- MISE À JOUR : Ajout des Dépenses et du Bénéfice Net ---
    const stats = [
        { label: "Recette Attendue", value: formatCFA(kpis?.recetteAttendueGlobale || 0), icon: Activity, color: 'text-blue-500', bg: 'bg-card' },
        { label: 'Total Encaissé', value: formatCFA(kpis?.totalEncaisse || 0), icon: Wallet, color: 'text-green-500', bg: 'bg-card' },
        { label: 'Dépenses', value: `-${formatCFA(kpis?.totalDepenses || 0)}`, icon: TrendingDown, color: 'text-red-500', bg: 'bg-card' },
        { label: 'Bénéfice Net', value: formatCFA(kpis?.beneficeNet || 0), icon: PiggyBank, color: 'text-primary', bg: 'bg-primary/5 border-primary/20' }, // Mise en évidence du bénéfice
        { label: 'Total Impayés', value: formatCFA(kpis?.totalImpayes || 0), icon: AlertCircle, color: 'text-orange-500', bg: 'bg-card' },
        { label: 'Chauffeurs actifs', value: statsGen?.chauffeursActifs || 0, icon: Users, color: 'text-sky-500', bg: 'bg-card' },
        { label: 'Véhicules en service', value: `${statsGen?.vehiculesEnService || 0} / ${statsGen?.vehiculesTotal || 0}`, icon: Truck, color: 'text-emerald-500', bg: 'bg-card' },
        { label: 'Véhicules en panne', value: statsGen?.vehiculesEnPanne || 0, icon: Wrench, color: 'text-destructive', bg: 'bg-card' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* --- EN-TÊTE --- */}
            <div>
                <h1 className="font-display text-2xl font-bold text-foreground">Tableau de bord</h1>
                <p className="text-sm text-muted-foreground">Vue d'ensemble et rentabilité de votre flotte</p>
            </div>

            {/* KPI Grid : Modifié pour lg:grid-cols-4 car on a 8 cartes maintenant */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                {stats.map((s, index) => (
                    <Card key={index} className={`border border-border/50 shadow-sm hover:shadow-md transition-shadow ${s.bg}`}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <s.icon className={`h-5 w-5 ${s.color}`} />
                            </div>
                            <p className={`mt-2 text-xl font-bold ${s.color === 'text-primary' ? 'text-primary' : 'text-foreground'}`}>
                                {s.value}
                            </p>
                            <p className="text-xs text-muted-foreground">{s.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Chart */}
                <Card className="border-0 shadow-sm lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-display text-base">Recettes des 7 derniers jours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis dataKey="date" fontSize={12} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                                    <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
                                    <Tooltip
                                        formatter={(v: number) => [formatCFA(v), 'Montant']}
                                        cursor={{ fill: 'hsl(var(--muted))' }}
                                        contentStyle={{
                                            background: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Bar dataKey="montant" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Alertes dettes */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-display text-base flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            Chauffeurs Endettés
                        </CardTitle>
                        <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50">
                            {dettes.length}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {dettes.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">Aucune dette enregistrée.</p>
                        ) : (
                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                                {dettes.map(chauffeur => (
                                    <div key={chauffeur.idChauffeur} className="flex items-center justify-between rounded-lg bg-muted/50 p-3 border border-border/50">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{chauffeur.nomComplet}</p>
                                            <p className="text-xs text-muted-foreground">{chauffeur.telephone}</p>
                                        </div>
                                        <Badge variant="destructive" className="text-xs">
                                            {formatCFA(chauffeur.montantTotalDette)}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;