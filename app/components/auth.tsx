import { globalStyles } from "@/styles/globalStyles";
import { theme } from "@/styles/theme";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from "./supabase";



/*
=========
To-do:
=========

Functionality:
> Add error catching on the sign up page, e.g. if supabase rejects the sign up (i.e. password doesn't meet requirements) do not alert about the 2fa email
> Add usernames to account creation (requires supabase config - need to plan my database structure to do this)

QoL:
> Set up in-app error messaging to appear when apsswords do not meet the required criteria 

*/




export default function Auth() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('')
    const [username, setUsername] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
        })
        if (error) Alert.alert(error.message)
        setLoading(false)
    }

    async function signUpWithEmail() {
        setLoading(true)
        const {data: { session }, error,} = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { emailRedirectTo: 'https://www.chumsapp.co.uk/authenticated.html' },
        });
        if (error) Alert.alert(error.message)
        if (!session) Alert.alert('Please check your inbox for email verification!')  // this should eventually be changed to redirect to a "check your email for confirmation" screen rather than just giving a popup
        setLoading(false)
    }

    return (                               // if mode is set to signIn display the signIn options
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={150}>
        <ScrollView contentContainerStyle={globalStyles.screenContainer}>
            <View style={globalStyles.mainTileContainer}>
                <View style={styles.toggleContainer}>
                    <Pressable onPress={() => setMode('signIn')} style={[styles.toggleButton, mode === 'signIn' && styles.activeToggleButton]}>
                        <Text style={[styles.toggleText, mode === 'signIn' && styles.activeToggleText]}>Sign In</Text>
                    </Pressable>
                    <Pressable onPress={() => setMode('signUp')} style={[styles.toggleButton, mode === 'signUp' && styles.activeToggleButton]}>
                        <Text style={[styles.toggleText, mode === 'signUp' && styles.activeToggleText]}>Sign Up</Text>
                    </Pressable>
                </View>

                {mode === 'signIn' ? (
                    <>
                        <Text style={styles.buttonLabel}>Enter your email address</Text>
                        <View style={styles.inputContainer}>
                            <TextInput value={email} 
                            onChangeText={setEmail}
                            placeholder="example@email.com" 
                            keyboardType="email-address" 
                            autoCapitalize="none" />
                        </View>
                        <Text style={styles.buttonLabel}>Enter your password</Text>
                        <View style={styles.inputContainer}>
                            <TextInput value={password} 
                            onChangeText={setPassword}
                            placeholder="password" 
                            secureTextEntry 
                            autoCapitalize="none" />
                        </View>
                        <Pressable onPress={loading ? undefined : () => signInWithEmail()} style={globalStyles.button}>
                            <Text style={globalStyles.buttonText}>Sign In</Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <Text style={styles.buttonLabel}>Enter your email address</Text>
                        <View style={styles.inputContainer}>
                            <TextInput value={email} 
                            onChangeText={setEmail}
                            placeholder="example@email.com" 
                            keyboardType="email-address" 
                            autoCapitalize="none" />
                        </View>
                        <Text style={styles.buttonLabel}>Choose a password</Text>
                        <View style={styles.inputContainer}>
                            <TextInput value={password} 
                            onChangeText={setPassword}
                            placeholder="password" 
                            secureTextEntry 
                            autoCapitalize="none" />
                        </View>
                        <Text style={styles.buttonLabel}>Confirm password</Text>
                        <View style={styles.inputContainer}>
                            <TextInput value={passwordCheck} 
                            onChangeText={setPasswordCheck}
                            placeholder="password" 
                            secureTextEntry 
                            autoCapitalize="none" />
                        </View>
                        {password === passwordCheck ? (     // checks is the password and password check variable match. If they do it presetns the sign up button, otherwise it gives a warning and the button is greyed out and not functional
                        <Pressable onPress={loading ? undefined : () => signUpWithEmail()} 
                        style={({ pressed }) => [
                            globalStyles.button, {
                                backgroundColor: loading ? '#808080b6' : pressed ? '#80808081' : '#26667F',
                            },
                        ]}>
                            <Text style={globalStyles.buttonText}>Sign Up</Text>
                        </Pressable>
                            ) : (<View>                          
                                <Text style={styles.warningText}>Your passwords do not match</Text>
                                <Pressable onPress={undefined} style={[ globalStyles.button, { backgroundColor: '#80808081' }]}>
                                    <Text style={globalStyles.buttonText}>Sign Up</Text>
                                </Pressable>
                                </View>)}

                    </>
                )}
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
    )

}

const styles = StyleSheet.create({
    mainTileContainer: {
        width: '80%',
        borderColor: theme.colors.primary,
        borderWidth: 2,
        borderRadius: 25,
        alignItems: 'center',
        padding: 20,
    },
    inputContainer: {
        height: 50,
        width: '100%',
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        justifyContent: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        width: '80%',
        height: 40,
        backgroundColor: theme.colors.primary,
        borderRadius: 10,
    },
    toggleButton:{
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    activeToggleButton:{
        backgroundColor: theme.colors.secondary
    },
    toggleText: {
        color: '#FFFFFF'
    },
    activeToggleText: {
        color: '#000000'
    },
    buttonLabel: {
        marginTop: 20,
    },
    warningText: {
        color: '#ff0000ff'
    }
})