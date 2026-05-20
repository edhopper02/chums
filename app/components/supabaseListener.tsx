import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

interface SupabaseContextType {
  supabase: typeof supabase;
  session: Session | null;
  user: User | null;
}

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export const SupabaseListener = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
    });

    return () => subscription.subscription.unsubscribe();

  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, session, user }}>
      {children}
    </SupabaseContext.Provider>
  );

}

export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (!context) {
        throw new Error("useSupabase must be used within a SupabaseListener");
    }
    return context;
};