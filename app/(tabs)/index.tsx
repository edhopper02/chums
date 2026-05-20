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
      <Text style={styles.title}>Chums v0</Text>
      <Text>If you are reading this... how??</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
})