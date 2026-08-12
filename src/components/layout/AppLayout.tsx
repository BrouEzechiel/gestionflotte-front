import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from './AppSidebar';

export const AppLayout = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div className="flex h-screen items-center justify-center">Chargement...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return (
        <div className="min-h-screen bg-muted/30">
            <AppSidebar />
            <main className="lg:pl-64 transition-all duration-300">
                <div className="p-4 md:p-8 pt-20 lg:pt-8 animate-fade-in">
                    {/* Outlet est l'endroit où le Dashboard (ou autre page) va s'afficher */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};