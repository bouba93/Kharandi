import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMe, logout as djangoLogout } from '../services/auth';

interface UserProfile {
  uid: string; email: string; role: string; name: string;
  phone?: string; interests: string[]; onboardingCompleted: boolean;
  isApproved?: boolean; points?: number; subscriptionPlan?: string;
  activeAddons?: string[];
  city?: string;
  shopName?: string;
  shopDescription?: string;
}

interface AuthContextType {
  user: any;
  userProfile: UserProfile | null;
  isAuthReady: boolean;
  isGuest: boolean;
  setGuestMode: (isGuest: boolean, role?: string) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, userProfile: null, isAuthReady: false,
  isGuest: false,
  setGuestMode: () => {}, logout: () => {},
  refreshProfile: async () => {},
});

const mapProfile = (data: any): UserProfile => {
  if (!data) return {
    uid: 'unknown', email: '', role: 'student', name: 'Utilisateur',
    interests: [], onboardingCompleted: false, points: 0,
    subscriptionPlan: 'free', activeAddons: [],
  };
  const d = data.data || data;
  const p = d.profile || d;

  let rawRole = (d.role || p.role || 'student').toLowerCase();
  if (rawRole === 'tutor' || rawRole === 'teacher') rawRole = 'repetiteur';
  if (rawRole === 'superadmin') rawRole = 'admin';

  const phone = d.phone || d.username || '';

  return {
    uid:   d.id  || d.uid   || 'unknown',
    email: d.email || phone || '',
    phone,
    role:  rawRole,
    name:  p.first_name
      ? `${p.first_name} ${p.last_name || ''}`.trim()
      : (phone || 'Utilisateur'),
    interests:           p.interests || [],
    onboardingCompleted: (
      p.onboarding_completed === true || d.onboarding_completed === true ||
      p.onboarding_completed === 'true' || d.onboarding_completed === 'true' ||
      p.onboarding_completed === 'True' || d.onboarding_completed === 'True' ||
      p.onboarding_completed === 1 || d.onboarding_completed === 1 ||
      p.onboarding_completed === '1' || d.onboarding_completed === '1'
    ),
    isApproved:       d.is_active ?? true,
    points:           p.points || 0,
    subscriptionPlan: d.subscription_plan || 'free',
    activeAddons:     d.active_addons || [],
    city:             p.city || d.city || '',
    shopName:         p.shop_name || d.shop_name || '',
    shopDescription:  p.shop_description || d.shop_description || '',
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isGuest,     setIsGuest]     = useState(false);

  const setGuestMode = (guest: boolean, role: string = 'student') => {
    setIsGuest(guest);
    if (guest) {
      localStorage.setItem('isGuest', 'true');
      localStorage.setItem('kharandi_guest_role', role);
    } else {
      localStorage.removeItem('isGuest');
      localStorage.removeItem('kharandi_guest_role');
    }
  };

  const logout = () => {
    djangoLogout();
    setUserProfile(null);
    setIsGuest(false);
    localStorage.removeItem('isGuest');
    localStorage.removeItem('kharandi_guest_role');
    localStorage.removeItem('kharandi_cached_profile');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  const fetchProfile = async () => {
    const cached = localStorage.getItem('kharandi_cached_profile');
    const token = localStorage.getItem('access_token');
    if (!token) {
      if (localStorage.getItem('isGuest') === 'true') {
        const guestRole = localStorage.getItem('kharandi_guest_role') || 'student';
        setUserProfile({
          uid: 'guest',
          email: 'guest@kharandi.com',
          role: guestRole,
          name: `Invité (${guestRole === 'student' ? 'Élève' : guestRole === 'repetiteur' || guestRole === 'teacher' ? 'Enseignant' : guestRole === 'parent' ? 'Parent' : guestRole === 'seller' ? 'Vendeur' : 'Admin'})`,
          interests: [],
          onboardingCompleted: true,
          isApproved: true,
          points: 150,
          subscriptionPlan: 'annuel',
          activeAddons: ['all']
        });
      } else {
        setUserProfile(null);
      }
      setIsAuthReady(true);
      return;
    }

    // ── Restaurer le profil mis en cache immédiatement (évite le flash login) ──
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setUserProfile(parsed);
        setIsAuthReady(true);
      } catch {
        // cache corrompu → ignorer
      }
    }

    // ── Vérifier en arrière-plan ───────────────────────────────────────────────
    try {
      const data = await getMe();
      const profile = mapProfile(data);
      setUserProfile(profile);
      setIsAuthReady(true);
      localStorage.setItem('kharandi_cached_profile', JSON.stringify(profile));
    } catch (err: any) {
      if (err?.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('kharandi_cached_profile');
        setUserProfile(null);
        setIsAuthReady(true);
      } else {
        // Erreur réseau / backend endormi → garder le cache si dispo
        if (!cached) setUserProfile(null);
        setIsAuthReady(true);
      }
    }
  };

  useEffect(() => {
    const safety = setTimeout(() => setIsAuthReady(true), 5000);
    const onGuest   = () => setGuestMode(true);
    const onReload  = () => fetchProfile();
    window.addEventListener('auth:guest-login',    onGuest);
    window.addEventListener('auth:reload-profile', onReload);
    fetchProfile().finally(() => clearTimeout(safety));
    return () => {
      clearTimeout(safety);
      window.removeEventListener('auth:guest-login',    onGuest);
      window.removeEventListener('auth:reload-profile', onReload);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user: userProfile, userProfile, isAuthReady, isGuest, setGuestMode, logout, refreshProfile: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
