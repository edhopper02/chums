
import { globalStyles } from "@/styles/globalStyles";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import 'react-native-url-polyfill/auto';
import { useSupabase } from "../components/supabaseListener";


export default function Index() {

    interface EventData {
        event_title: string;
        event_location: string;
        event_description: string;
        event_id: string;
    };

    interface UserDetails {
        username: string;
        account_id: string | number;
    }

    const [userID, setUserID] = useState<UserDetails | null>(null);
    const [events, setEvents] = useState<EventData[]>([]);
    const [savedEventTitle, setSavedEventTitle] = useState<string>('');
    const [savedEventDescription, setSavedEventDescription] = useState<string>('');
    const [savedEventLocation, setSavedEventLocation] = useState<string>('');
    const [savedEventID, setSavedEventID] = useState<string>('');
    const [counter, setCounter] = useState(0);
    const [remainingEvents, setRemainingEvents] = useState(true);
    const [initialEvents, setInitialEvents] = useState(true);
    const { user, session, supabase } = useSupabase();
    const [friendsList, setFriendsList] = useState<string[] | null>([]);
    const [userDetails, setUserDetails] = useState<EventData>();



    async function checkFriendsList(userID: string | number) {
    const { data, error } = await supabase
    .from('friends')
    .select('friend_account_id')
    .eq('account_id', userID)
    if (error) {
        console.log('Error:', error);
    } else {
        const friendIDs = data?.map(item => item.friend_account_id.toString())
        setFriendsList(friendIDs)
        return friendIDs;
        }
    }

    async function fetchEvents(friendsList: string[], userID: string | number) {
        if (!userID) {
            return;
        } else {
            const { data, error } = await supabase.rpc('get_unresponded_events', {
                user_id: userID,
            });
            if (error) {
                console.log('Error running function:', error);
                return;
            } else {
                setEvents(data);
                console.log('Data: ', data)
                if (data.length === 0){
                    setInitialEvents(false);
                };
            };
        }
    }

    async function getUserDetails() {
        const { data, error } = await supabase
        .from('user_details')
        .select('account_id')
        .limit(1)
        .single();
        if (error) console.log('Error egetting user id:', error);
        else setUserID(data?.account_id);
        return data;
    }

    async function displayEvent() {
        setSavedEventTitle(events[counter].event_title);
        setSavedEventDescription(events[counter].event_description);
        setSavedEventLocation(events[counter].event_location);
        setSavedEventID(events[counter].event_id);
    }

    async function initialLoad() {
        const userDetailsResult = await getUserDetails();
        if (userDetailsResult != null) {
            const checkFriendsListResult = await checkFriendsList(userDetailsResult?.account_id);
            if (checkFriendsListResult != null) {
                await fetchEvents(checkFriendsListResult, userDetailsResult?.account_id);
            } else {
                setFriendsList(null);
            }
        } else {
            setUserID(null);
        }
        
        setCounter(0);
        setRemainingEvents(true);
    };

    async function voteYes() {
        const { data, error } = await supabase
        .from('user_details_events')
        .insert([{ event_id: savedEventID, respondant_user_id: userID?.account_id, response: 'yes' }])
        if (error) console.log('Error:', error);
        else console.log('Voted Yes')

        if (counter < events.length - 1 ) {
            setCounter((prev) => prev + 1);
        } else {
            setRemainingEvents(false);
        }
    }

    async function voteNo() {
        const { data, error } = await supabase
        .from('user_details_events')
        .insert([{ event_id: savedEventID, respondant_user_id: userID?.account_id, response: 'no' }])
        if (error) console.log('Error:', error);
        else console.log('Voted No')

        if (counter < events.length - 1 ) {
            setCounter((prev) => prev + 1);
        } else {
            setRemainingEvents(false);
        }
    }

    useEffect(() => {
        if (user) {
            initialLoad();
        } else {
            setUserID(null);
        };
    }, [user]);

    useEffect(() => {
        if (events.length > 0 && counter < events.length) {
            displayEvent();
        } 
    }, [events, counter]);

    if (userID === null) {
        return(
            <View style={globalStyles.screenContainer}>
                <Text>Please log in to view events.</Text>
            </View>
        )
    } else if (friendsList === null) {
        return(
            <View style={globalStyles.screenContainer}>
                <Text>Add friends to get started!</Text>
            </View>
        )
    } else if (initialEvents === false) {
        return(
            <View style={globalStyles.screenContainer}>
                <Text>No new events yet. Get your friends to add some!</Text>
            </View>
        )

    } else if (events.length === 0 && remainingEvents === true) {
        return(
            <View style={globalStyles.screenContainer}>
                <Text>Loading events...</Text>
            </View>
        )
    } else if (remainingEvents === false) {
        return(
            <View style={globalStyles.screenContainer}>
                <Text>No more events! Go bug your friends to add more...</Text>
            </View>
        )
    } else {
    
    return (
        <>
        <ScrollView contentContainerStyle={globalStyles.screenContainer}>
            <View style={[globalStyles.mainTileContainer, {  }]}>
                <View style={[styles.titleContainer, { width: '90%' }]}>
                    <Text>{savedEventTitle}</Text>  
                </View>
                <View style={[globalStyles.itemContainer]}>
                    <View style={[styles.titleContainer]}>
                        <Text>Description</Text>   
                    </View>
                    <View style={[styles.itemBody]}>   
                        <Text>{savedEventDescription}</Text>
                    </View>
                </View>
                <View style={[globalStyles.itemContainer]}>
                    <View style={[styles.titleContainer]}>
                        <Text>Location</Text>   
                    </View>   
                    <View style={[styles.itemBody]}> 
                        <Text>{savedEventLocation}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
        <Pressable onPress={() => voteNo()}>
            <View style={[globalStyles.button, styles.floatingButton, styles.circleButton, { left: '5%', bottom: 0 }]}>
                <Ionicons name="close" size={28} style={{ color: '#FFFFFF' }}/>
            </View>
        </Pressable>
        <Pressable onPress={() => voteYes()}>
            <View style={[globalStyles.button, styles.floatingButton, styles.circleButton, { right: '5%', bottom: 0 }]}>
                <Ionicons name="checkmark" size={28} style={{ color: '#FFFFFF' }}/>
            </View>
        </Pressable>
        </>
    )};







/*
    return (
        <>
        <ScrollView contentContainerStyle={globalStyles.screenContainer}>
            <View style={[globalStyles.mainTileContainer, { marginTop: 50 }]}>
                <View style={styles.titleContainer}>
                    <Text>Sample Title</Text>   
                </View>
                <View style={[styles.itemContainer]}>
                    <View style={[styles.titleContainer]}>
                        <Text>Description</Text>   
                    </View>   
                    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                </View>
                <View style={[styles.itemContainer]}>
                    <View style={[styles.titleContainer]}>
                        <Text>Location</Text>   
                    </View>   
                    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                </View>
            </View>
        </ScrollView>
        <View style={[globalStyles.button, styles.floatingButton, styles.circleButton, { left: '5%', bottom: 0 }]}>
            <Ionicons name="close" size={28} style={{ color: '#FFFFFF' }}/>
        </View>
        <View style={[globalStyles.button, styles.floatingButton, styles.circleButton, { right: '5%', bottom: 0 }]}>
            <Ionicons name="checkmark" size={28} style={{ color: '#FFFFFF' }}/>
        </View>
        </>
    );
*/

};

const styles = StyleSheet.create({
    titleContainer: {
        paddingTop: 10,
        color: theme.colors.primary,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.primary,
    },


    itemContainer: {
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: 5,
        marginVertical: 10,
        padding: 5,
    },

    itemBody: {
        paddingVertical: 5,
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
    }
})