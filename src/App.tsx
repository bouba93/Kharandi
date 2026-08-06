import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoadingScreen }   from './components/features/LoadingScreen';
import { Dashboard }       from './components/features/Dashboard';
import { Login }           from './components/features/Login';
import { LandingPage }     from './components/features/LandingPage';
import { PaymentSuccess }  from './components/features/PaymentSuccess';
import { PaymentFailure }  from './components/features/PaymentFailure';
import { PWAInstallPrompt} from './components/features/PWAInstallPrompt';
import { CartProvider }    from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary }   from './components/ErrorBoundary';
import { Toaster }         from 'sonner';
import { EcoleApp }        from './components/ecole/EcoleApp';
import { AdminDashboard }  from './components/features/AdminDashboard';
import { Onboarding }      from './components/features/Onboarding';
import { MaintenanceMode } from './components/features/MaintenanceMode';
import { StandaloneNewsReader } from './components/features/StandaloneNewsReader';
import { StandaloneResultsReader } from './components/features/StandaloneResultsReader';

function AppRoutes() {
  const queryParams = new URLSearchParams(window.location.search);
  const isSharedArticle = queryParams.has('article');
  const isSharedResults = queryParams.has('results') || queryParams.has('result');

  if (isSharedArticle) {
    return <StandaloneNewsReader />;
  }

  if (isSharedResults) {
    return <StandaloneResultsReader />;
  }

  const { userProfile, isGuest, isAuthReady, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [minLoadingDone, setMinLoadingDone] = React.useState(false);
  const [justFinishedOnboarding, setJustFinishedOnboarding] = React.useState(false);

  React.useEffect(() => {
    const isFirstTime = !sessionStorage.getItem('first_connection_done');
    if (!isFirstTime) {
      setMinLoadingDone(true);
    } else {
      const t = setTimeout(() => {
        setMinLoadingDone(true);
        sessionStorage.setItem('first_connection_done', 'true');
      }, 150);
      return () => clearTimeout(t);
    }
  }, []);

  if (!isAuthReady || !minLoadingDone) return <LoadingScreen />;

  // Maintenance désactivée globalement : tout utilisateur a pleinement accès à la plateforme
  const isExcludedFromMaintenance = true;

  const isLoginPath = window.location.pathname === '/login';

  if (!isExcludedFromMaintenance && !isLoginPath) {
    return <MaintenanceMode />;
  }

  const isAuthenticated = !!userProfile || isGuest;
  const isAdmin = userProfile?.role?.toLowerCase() === 'admin';

  const isNewlyRegistered = sessionStorage.getItem('just_registered') === 'true';

  if (isAuthenticated && !isGuest && userProfile && isNewlyRegistered && !justFinishedOnboarding) {
    return <Onboarding onComplete={async () => {
      sessionStorage.removeItem('just_registered');
      setJustFinishedOnboarding(true);
      await refreshProfile();
    }} />;
  }

  return (
    <>
      <Routes>
        <Route path="/"
          element={isAuthenticated ? <Dashboard /> : <LandingPage onLogin={() => navigate('/login')} />} />
        <Route path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/paiement/succes"  element={<PaymentSuccess />} />
        <Route path="/paiement/echec"   element={<PaymentFailure />} />
        <Route path="/payment/success"  element={<PaymentSuccess />} />
        <Route path="/payment/failure"  element={<PaymentFailure />} />
        <Route path="/ecole/*"
          element={<EcoleApp />} />
        <Route path="/admin"
          element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/*"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
      <PWAInstallPrompt />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster position="top-center" richColors />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
