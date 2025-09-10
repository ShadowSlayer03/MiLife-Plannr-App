// hooks/useAuth.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); // Set loading to false after initial check
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false); // Ensure loading is false on auth changes
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, loading }; // Return both session and loading
}