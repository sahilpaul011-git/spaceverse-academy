import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  supabase,
  supabaseConfigError,
} from '../lib/supabase';

const AuthContext = createContext(null);

function unavailableResult() {
  return {
    data: null,
    error: new Error(
      supabaseConfigError || 'Authentication is temporarily unavailable.'
    ),
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

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
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!active) return;

        if (error) {
          console.error('Session error:', error.message);
          setLoading(false);
          return;
        }

        setSession(data.session);
        await loadProfile(data.session?.user ?? null);
      } catch (error) {
        console.error('Authentication startup error:', error);
      } finally {
        if (active) setLoading(false);
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(true);

      Promise.resolve()
        .then(() => loadProfile(nextSession?.user ?? null))
        .catch((error) => {
          console.error('Profile loading error:', error);
        })
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
    if (!supabase) return unavailableResult();

    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName.trim() },
      },
    });
  }

  async function signIn({ email, password }) {
    if (!supabase) return unavailableResult();

    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async function signInWithProvider(provider) {
    if (!supabase) return unavailableResult();

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
    if (!supabase) return unavailableResult();

    return supabase.auth.signOut();
  }

  async function resetPassword(email) {
    if (!supabase) return unavailableResult();

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