import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/auth';

export default function TabLayout() {
    const { session } = useAuth();  // Change from isAuthenticated to session

    if (!session) {  // Check for session instead of isAuthenticated
        return <Redirect href="/login" />;
    }

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#622eab',
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="material"
                options={{
                    title: 'Material',
                    headerStyle: { height: 80 },
                    tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="quiz"
                options={{
                    title: 'Quiz',
                    headerStyle: { height: 80 },
                    tabBarIcon: ({ color }) => <Ionicons name="checkmark-circle" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="maze-solver"
                options={{
                    title: 'Maze',
                    headerStyle: { height: 80 },
                    tabBarIcon: ({ color }) => <Ionicons name="grid" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}