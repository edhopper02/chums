import { StyleSheet, Text, View } from "react-native";
import 'react-native-url-polyfill/auto';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={styles.title}>Email verified!</Text>
      <Text>Thank you for verifying your email address!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
})