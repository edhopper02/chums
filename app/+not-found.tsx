import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';


export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops! Page Not Found' }} />
            <View style={styles.container}>
                <Link href={"/" as any} style={styles.button}>
                    -- Back to the home screen --
                </Link>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#FFFFFF',
  },
});