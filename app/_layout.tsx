import { Stack } from 'expo-router';
import { AuthProvider } from '../context/auth';
import { useState, useEffect } from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import { useAuth } from '../context/auth';

function AppLayout() {
    const [isLoading, setIsLoading] = useState(true);

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#161616' }}>
                <LottieView
                    source={require('../assets/opening.json')}
                    autoPlay
                    loop={false}
                    onAnimationFinish={() => setIsLoading(false)}
                    style={{ flex: 1 }}
                />
            </View>
        );
    }

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />  {/* Add this line */}
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <AppLayout />
        </AuthProvider>
    );
}