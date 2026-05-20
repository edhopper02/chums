import { theme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { RelativePathString, Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function TabLayout() {
    const router = useRouter();

    useEffect(() => {
        const handleDeepLink = (event: { url:string }) => {
            const { path, queryParams } = Linking.parse(event.url);
            if (path) {
                const pathname = `/${path}` as RelativePathString;
                router.push({
                    pathname,
                    params: queryParams ?? undefined,
                });
            }
        };
    
        const sub = Linking.addEventListener('url', handleDeepLink);

        Linking.getInitialURL().then((url) => {
            if (url) handleDeepLink({ url });
        });

        return () => sub.remove();
    }, []);

    return (
        <Tabs screenOptions={{
                    tabBarActiveTintColor: theme.colors.secondary,
                    headerStyle: {
                        backgroundColor: theme.colors.background,
                        },
                    headerShadowVisible: false,
                    headerTintColor: '#000000',
                    tabBarStyle: {
                        backgroundColor: theme.colors.background,
                        },
                }}
            >
            <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={focused ? color : '#000000'} size={24}  />
            ) }} />
            <Tabs.Screen name="events" options={{ title: 'Events', tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'calendar' : 'calendar-outline'} color={focused ? color : '#000000'} size={24} />
            ) }} />
            <Tabs.Screen name="createEvent" options={{ title: 'Create', tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} color={focused ? color : '#000000'} size={24} />
            ) }} />
            <Tabs.Screen name="verifyProfile" options={{ title: 'Account', tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} color={focused ? color : '#000000'} size={24}/>
            ) }} />
        </Tabs>
    );

}
