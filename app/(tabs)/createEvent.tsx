import { globalStyles } from '@/styles/globalStyles';
import { theme } from '@/styles/theme';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSupabase } from '../components/supabaseListener';

export default function createEvent() {
    const [text, setText] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [savedEvent, setSavedEvent] = useState(null);
    const [userID, setUserID] = useState(null);
    const { user, session, supabase } = useSupabase();


    useEffect(() => {
        if (user) {
            getUserDetails();
        } else {
            setUserID(null);
        };
    }, [user]);

    async function getUserDetails() {
        const { data, error } = await supabase
        .from('user_details')
        .select('account_id')
        .limit(1)
        .single();
        if (error) console.log('Error getting user id:', error);
        else setUserID(data?.account_id);
    }

    async function saveEvent() {
        if (!text.trim()) return Alert.alert('Please fill out the title field');
        const { data, error } = await supabase
        .from('events')
        .insert([{ event_title: text , event_owner_user_id: userID, event_description: description, event_location: location }]);
        if (error) {
            console.error('Save error:', error.message);
            Alert.alert('Error saving event', error.message);
        } else {
            Alert.alert('Event saved!');
            setText('');
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={150}>
        <ScrollView contentContainerStyle={[globalStyles.screenContainer]}>
            <View style={[globalStyles.mainTileContainer, {  }]}>
                <View style={[styles.titleContainer, { width: '90%' }]}>
                    <TextInput value={text} onChangeText={setText} placeholder='Enter Title...' style={styles.textInputStyle} placeholderTextColor={'#636363'} />   
                </View>
                <View style={[globalStyles.itemContainer]}>
                    <View style={[styles.titleContainer]}>
                        <Text>Description</Text>   
                    </View>   
                    <TextInput value={description} onChangeText={setDescription} placeholder='Enter Description...' multiline 
                        style={styles.textInputStyle} placeholderTextColor={'#636363'} />   
                </View>
                <View style={[globalStyles.itemContainer]}>
                    <View style={[styles.titleContainer]}>
                        <Text>Location</Text>   
                    </View>   
                    <TextInput value={location} onChangeText={setLocation} placeholder='Enter Location...' multiline 
                        style={styles.textInputStyle} placeholderTextColor={'#636363'} />   
                </View>
            </View>
        </ScrollView>
        <View style={[globalStyles.button, styles.floatingButton, {  right: '5%', bottom: 0 }]}>
            <Pressable onPress={saveEvent}>
                <Text style={globalStyles.buttonText}>Create Event</Text>
            </Pressable>
        </View>
        </KeyboardAvoidingView>
    )
    
}

const styles = StyleSheet.create({
    titleContainer: {
        paddingVertical: 10,
        color: theme.colors.primary,
        borderBottomWidth: 1,
        paddingBottom: 0,
        borderBottomColor: theme.colors.primary,
    },
    textInputStyle: {
        flex: 1,
    },
    floatingButton: {
        position: 'absolute',
    },
    circleButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        paddingVertical: 0,
        paddingHorizontal: 0,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
    },
    bodyText: {
        color: '#000000',
    },
})