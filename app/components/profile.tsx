import { globalStyles } from "@/styles/globalStyles";
import { theme } from "@/styles/theme";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from "./supabase";

export default function Profile({ session }: any) {

  interface EventData {
      username: string;
      account_id: string;
  };

  const user = session.user;
  const [loading, setLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<EventData>();
  const [searchUser, setSearchUser] = useState<EventData[]>([]);
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [friendsListDetails, setFriendsListDetails] = useState<EventData[]>([]);
  const [addFriendsVisible, setAddFriendsVisible] = useState<boolean>(false);
  const [viewFriendsVisible, setViewFriendsVisible] = useState<boolean>(false);
  const [text, setText] = useState<string>();

  async function signOut() {
      await supabase.auth.signOut();
  }

  async function getUserDetails() {
      const { data, error } = await supabase
      .from('user_details')
      .select('username, account_id')
      .limit(1)
      .single();
      if (error) {console.log('Error getting username:', error);
      } else {
        setUserDetails({username: data?.username, account_id: data?.account_id})};
  }



  async function searchUsers(text: string) {
    setText(text)

    if (text.length < 2) {
      setSearchUser([]);
      return;
    } else {
      const { data, error } = await supabase
      .from('user_public_profile')
      .select('username, account_id')
      .ilike('username', `%${text}%`)
      .limit(10)
      if (error) console.log('Error:', error);
      else setSearchUser(data);
    }
  }

  async function checkFriendsList() {
    const { data, error } = await supabase
    .from('friends')
    .select('friend_account_id')
    .eq('account_id', userDetails?.account_id)
    if (error) {
      console.log('Error:', error);
    } else {
      const friendIDs = data?.map(item => item.friend_account_id.toString())
      setFriendsList(friendIDs)
    }
  }

  async function getFriendDetails() {
    const { data, error } = await supabase
    .from('user_public_profile')
    .select('username, account_id')
    .in('account_id', friendsList)
    if (error) {console.log('Error getting username:', error);
    } else if (data) {
      setFriendsListDetails(data)};
      console.log('Supabase data:', data, 'error:', error);
  }

  async function addFriend(account_id: string) {
    const { data, error } = await supabase
    .from('friends')
    .insert([{ account_id: userDetails?.account_id, friend_account_id: account_id, status: 'added' }])
    if (error) console.log('Error:', error);
    else console.log('Friend added')
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    checkFriendsList();
  }, [userDetails]);

  useEffect(() => {
    getFriendDetails();
  }, [friendsList]);

  return (
    <>
    <View style={[globalStyles.screenContainer, { justifyContent: 'flex-start', paddingVertical: 20 }]}>
      <View style={[styles.horizontalItemContainer]}>
        <View style={ [{ flex: 1, paddingHorizontal: 5 }]}>
          <Ionicons name="person-circle" size={40}/>
        </View>
        <View style={ [{ alignItems: 'flex-end', flex: 5, paddingHorizontal: 5 }]}>
          <Text>Hi, {userDetails ? userDetails.username : 'Username' }</Text>
        </View>
      </View>
      <View style={[styles.horizontalItemContainer, { paddingHorizontal: 30 }]}>
        <Pressable onPress={loading ? undefined : () => setViewFriendsVisible(true)} style={globalStyles.button}>
          <Text style={globalStyles.buttonText}>View Friends List</Text>
        </Pressable>
        <Pressable onPress={loading ? undefined : () => setAddFriendsVisible(true)} style={globalStyles.button}>
          <Text style={globalStyles.buttonText}>Add Friends</Text>
        </Pressable>
      </View>
      <View style={[globalStyles.mainTileContainer, { marginTop: 15 }]}>
        <Text style={{ fontWeight: 'bold' }}>Settings</Text>
        <Text style={styles.bodyText}>The rest of the stuff here can be app settings, like notifications, dark mode, change password, etc.</Text>
      </View>


      <Pressable onPress={loading ? undefined : () => signOut()} style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>Sign Out</Text>
      </Pressable>
    </View>


{/* View friends list modal: */}
    <Modal transparent allowSwipeDismissal={true} animationType="slide" visible={viewFriendsVisible} onRequestClose={() => setViewFriendsVisible(false)}>
      <View style={globalStyles.modalContainer}>
        <View style={styles.horizontalItemContainer}>
          <View style={ [{ alignItems: 'center', flex: 4 }]}>
            <Text>Friends list</Text>
          </View>
          <View style={ [{ alignItems: 'center', flex: 1 }]}>
            <Pressable onPress={() => setViewFriendsVisible(false)}><Ionicons name='close-circle-outline' size={25} /></Pressable>
          </View>
        </View>
        <FlatList data = {friendsListDetails} keyExtractor={(item) => item.account_id} keyboardShouldPersistTaps='handled'
          style={{ width: '90%' }} contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
          renderItem={({ item }) => (
            <View style={styles.horizontalItemContainer}>
              <View style={ [{ alignItems: 'center', flex: 1 }]}>
                <Ionicons name="person-circle" size={40}/>
              </View>
              <View style={ [{ alignItems: 'center', flex: 5 }]}>
                <Text>{item.username}</Text>
              </View>
            </View>
           )}
        />
      </View>
    </Modal>

{/* Add friends modal: */}
    <Modal transparent allowSwipeDismissal animationType="slide" visible={addFriendsVisible} onRequestClose={() => setAddFriendsVisible(false)}>
      <View style={[globalStyles.modalContainer, { }]}>
        <View style={[styles.horizontalItemContainer, { paddingHorizontal: 10 }]}>
          <View style={{ flex: 1 }}>
            <Ionicons name='search-sharp' size={25} color={theme.colors.primary} />
          </View>
          <View style={[globalStyles.searchBarContainer, { flex: 8 }]}>
            <TextInput value={text} onChangeText={searchUsers} placeholder='Username...' style={globalStyles.searchBar} placeholderTextColor={'#000000'} /> 
          </View>
          <View style={ [{ alignItems: 'center', flex: 1 }]}>
            <Pressable onPress={() => setAddFriendsVisible(false)}><Ionicons name='close-circle-outline' size={25} /></Pressable>
          </View>
        </View>
        
        {/* Search result user list - should only populate with the searched usernames 
        Should have an object that stores every username and user id that matches the current search
        Then make an array that contains just the usernames and use a flatlist to display them?
        */}

      <FlatList data = {searchUser} keyExtractor={(item) => item.account_id} keyboardShouldPersistTaps='handled'
        style={{ width: '90%' }} contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
        renderItem={({ item }) => (
          <View style={styles.horizontalItemContainer}>
            <View style={ [{ alignItems: 'center', flex: 1 }]}>
              <Ionicons name="person-circle" size={40}/>
            </View>
            <View style={ [{ alignItems: 'center', flex: 5 }]}>
              <Text>{item.username}</Text>
            </View>
            <View style={ [{ alignItems: 'center', flex: 1, borderColor: '#bfbfbf', borderLeftWidth: 1, paddingLeft: 12 }]}>

              {friendsList.includes(item.account_id) ? (
                <Ionicons name="checkbox-outline" size={25}/>
              ) : (
                <Pressable onPress={() => addFriend(item.account_id)}>
                  <Ionicons name="add-circle-outline" size={25}/>
                </Pressable>
              )}
            </View>
          </View>
        )}
      />


{/*
        <View style={[globalStyles.mainTileContainer, { flex: 1 }]}>
          <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.horizontalItemContainer}>
              <View style={ [{ alignItems: 'center', flex: 1 }]}>
                <Ionicons name="person-circle" size={40}/>
              </View>
              <View style={ [{ alignItems: 'center', flex: 5 }]}>
                <Text>{userName}</Text>
              </View>
              <View style={ [{ alignItems: 'center', flex: 1, borderColor: '#bfbfbf', borderLeftWidth: 1, paddingLeft: 12 }]}>
                <Ionicons name="add-circle-outline" size={25}/>
              </View>
            </View>
          </ScrollView>
        </View>
*/}


      </View>
    </Modal>
    </>
  );

}

const styles = StyleSheet.create({

  horizontalItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    padding: 5,
  },
  bodyText: {
    padding: 5,
  },
})