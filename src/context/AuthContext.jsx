import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProfile(user) {
      if (!user) {
        if (active) setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, role, xp, created_at')
        .eq('id', user.id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error('Profile error:', error.message);
        setProfile(null);
        return;
      }

      setProfile(data);
    }

    async function initialise() {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (error) {
        console.error(error.message);
        setLoading(false);
        return;
      }

      setSession(data.session);
      await loadProfile(data.session?.user ?? null);

      if (active) setLoading(false);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(true);

      Promise.resolve()
        .then(() => loadProfile(nextSession?.user ?? null))
        .finally(() => {
          if (active) setLoading(false);
        });
    });

    initialise();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signUp({ fullName, email, password }) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName.trim() },
      },
    });
  }

  async function signIn({ email, password }) {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async function signInWithProvider(provider) {
    if (!['google', 'facebook'].includes(provider)) {
      return {
        data: null,
        error: new Error('Unsupported provider.'),
      };
    }

    return supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo:
          window.location.origin + window.location.pathname,
      },
    });
  }

  async function signOut() {
    return supabase.auth.signOut();
  }

  async function resetPassword(email) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        window.location.origin + window.location.pathname,
    });
  }

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    resetPassword,
  }), [session, profile, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
  }
        
