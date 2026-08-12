import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VehiculesPage from './pages/VehiculesPage';
import ChauffeursPage from './pages/ChauffeursPage';
import AffectationsPage from './pages/affectationsPage';
import VersementsPage from './pages/VersementsPage';
import DepensesPage from './pages/DepensesPage';
import ProprietairesPage from './pages/ProprietairesPage'; // NOUVEL IMPORT

// Layout
import { AppLayout } from './components/layout/AppLayout';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Route publique (hors de la Sidebar) */}
          <Route path="/login" element={<LoginPage />} />

          {/* Routes privées (enveloppées par AppLayout) */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Vos pages */}
            <Route path="/vehicules" element={<VehiculesPage />} />
            <Route path="/chauffeurs" element={<ChauffeursPage />} />
            <Route path="/affectations" element={<AffectationsPage />} />
            <Route path="/versements" element={<VersementsPage />} />
            <Route path="/depenses" element={<DepensesPage />} />
            <Route path="/proprietaires" element={<ProprietairesPage />} /> {/* NOUVELLE ROUTE */}

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Page 404 simple */}
          <Route path="*" element={<div className="p-8">Page non trouvée</div>} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;