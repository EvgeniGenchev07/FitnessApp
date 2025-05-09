import {DarkTheme, DefaultTheme} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {router, Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import 'react-native-reanimated';
import {IsLoggedIn, LocalSaveProfile} from "@/serviceLayer/managerHandler";
import {useColorScheme} from '@/hooks/useColorScheme';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            const res = IsLoggedIn();
            if(res){
                LocalSaveProfile().then(()=> {
                        router.push('/(tabs)');
                        SplashScreen.hideAsync();
                    }
                );
            }
            else {
                router.push('/login');
                SplashScreen.hideAsync();
            }
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <LanguageProvider>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            animation: 'slide_from_right',
                        }}
                    >
                        <Stack.Screen name="index" options={{headerShown: false}}/>
                        <Stack.Screen name="register" options={{headerShown: false}}/>
                        <Stack.Screen name="login" options={{headerShown: false}}/>
                        <Stack.Screen name="editExercise" options={{headerShown: false}}/>
                        <Stack.Screen name="manageWorkout" options={{headerShown: false}}/>
                        <Stack.Screen name="editProfile" options={{headerShown: false}}/>
                        <Stack.Screen name="settings" options={{headerShown: false}}/>
                        <Stack.Screen name="changePassword" options={{headerShown: false}}/>
                        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                        <Stack.Screen name="help" options={{headerShown: false}}/>
                        <Stack.Screen name="reportBug" options={{headerShown: false}}/>
                        <Stack.Screen name="feedback" options={{headerShown: false}}/>
                        <Stack.Screen name="privacy" options={{headerShown: false}}/>
                        <Stack.Screen name="language" options={{headerShown: false}}/>
                        <Stack.Screen name="terms" options={{headerShown: false}}/>
                    </Stack>
                </LanguageProvider>
            </ThemeProvider>
            <StatusBar style="auto"/>
        </SafeAreaProvider>
    );
}
