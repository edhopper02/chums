import Auth from '@/app/components/auth';
import { supabase } from '@/app/components/supabase';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-url-polyfill/auto';

export default function verifyProfile() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
    })
    }, [])

    return (        // This currently will just display the user ID under the login form if the user is signed in - POC work only
    <View style={styles.mainContainer}> 
        <Auth />
        {session && session.user && <Text>{session.user.id}</Text>}     
    </View>
    )

}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    }
})