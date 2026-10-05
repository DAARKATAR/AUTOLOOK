import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Timeout de seguridad: NUNCA dejar loading en true por más de 1.5s
    const timer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 1500);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    if (supabaseUrl.includes('tu-proyecto.supabase.co')) {
      clearTimeout(timer);
      setLoading(false);
      return;
    }

    // Verificar sesión inicial
    supabase.auth.getSession()
      .then(({ data }) => {
        if (isMounted) {
          clearTimeout(timer);
          setSession(data?.session || null);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Error al verificar sesión de Supabase:', err);
        if (isMounted) {
          clearTimeout(timer);
          setLoading(false);
        }
      });

    // Escuchar cambios (login, logout, token expirado)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timer);
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
