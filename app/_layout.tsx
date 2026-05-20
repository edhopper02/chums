import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { SupabaseListener } from "./components/supabaseListener";

export default function RootLayout() {
  return (
    <SupabaseListener>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="createEvent" options={{ title: "Create Event" }} />
      </Stack>
      <StatusBar style="dark" />
    </SupabaseListener>
  );
}
