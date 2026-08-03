import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let didFinish = false;

    // Failsafe: never let the app hang blank for more than 6 seconds
    const timeout = setTimeout(() => {
      if (!didFinish) {
        console.warn('Supabase session check timed out. Continuing without a session.');
        setLoading(false);
      }
    }, 6000);

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        didFinish = true;
        clearTimeout(timeout);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch((err) => {
        didFinish = true;
        clearTimeout(timeout);
        console.error('Supabase session check failed:', err);
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
  }

  const value = useMemo(
    () => ({ user, session, loading, logout }),
    [user, session, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#666' }}>
          Loading...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}