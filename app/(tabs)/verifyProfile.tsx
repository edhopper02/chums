import Auth from '@/app/components/auth';
import Profile from "@/app/components/profile";
import { supabase } from '@/app/components/supabase';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-url-polyfill/auto';

export default function verifyProfile() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    // Get the current session (if any)  --  standard supabase code, not written by me
    supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
    });

    // Listen for auth state changes (sign in/out)  --  standard supabase code, not written by me
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );
        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
            </View>
        );
    } else {
        return session && session.user ? (
            <Profile key={session.user.id} session={session} />
            ) : (
            <Auth />
        );
    }

}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    }
})