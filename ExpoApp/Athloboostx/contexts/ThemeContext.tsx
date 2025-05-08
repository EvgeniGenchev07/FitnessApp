import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => Promise<void>;
    colors: ThemeColors;
}

interface ThemeColors {
    text: string;
    background: string;
    tint: string;
    icon: string;
    tabIconDefault: string;
    tabIconSelected: string;
    card: string;
    border: string;
    blur: string;
    blurBorder: string;
    inputColor: string;
    primary: string;
    button: string;
    error: string;
    success: string;
    modalBackground: string;
}

const lightColors: ThemeColors = {
    text: '#000000',
    background: '#FFFFFF',
    tint: '#ff0019',
    icon: '#ff0019',
    tabIconDefault: '#ccc',
    tabIconSelected: '#ff0019',
    card: '#F2F2F7',
    border: '#C6C6C8',
    blur: 'rgba(255, 255, 255, 0.8)',
    blurBorder: 'rgba(255, 255, 255, 0.8)',
    inputColor: '#000000',
    primary: '#ff0019',
    button: '#E5E5EA',
    error: '#FF3B30',
    success: '#34C759',
    modalBackground: 'rgba(0,0,0,0.3)'
};

const darkColors: ThemeColors = {
    text: '#FFFFFF',
    background: '#000000',
    tint: '#ff0019',
    icon: '#ff0019',
    tabIconDefault: '#ccc',
    tabIconSelected: '#ff0019',
    card: '#1C1C1E',
    border: '#38383A',
    blur: 'rgba(0, 0, 0, 0.8)',
    blurBorder: 'rgba(0, 0, 0, 0.8)',
    inputColor: '#FFFFFF',
    primary: '#ff0019',
    button: '#2C2C2E',
    error: '#FF453A',
    success: '#32D74B',
    modalBackground: 'rgba(0,0,0,0.5)'
};

const ThemeContext = createContext<ThemeContextType>({
    theme: 'system',
    setTheme: async () => {},
    colors: lightColors
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemColorScheme = useColorScheme();
    const [theme, setThemeState] = useState<ThemeType>('system');

    useEffect(() => {
        // Load saved theme preference
        const loadTheme = async () => {
            try {
                const savedTheme = await SecureStore.getItemAsync('theme');
                if (savedTheme) {
                    setThemeState(savedTheme as ThemeType);
                }
            } catch (error) {
                console.error('Error loading theme:', error);
            }
        };
        loadTheme();
    }, []);

    const setTheme = async (newTheme: ThemeType) => {
        try {
            await SecureStore.setItemAsync('theme', newTheme);
            setThemeState(newTheme);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    const colors = theme === 'system' 
        ? (systemColorScheme === 'dark' ? darkColors : lightColors)
        : (theme === 'dark' ? darkColors : lightColors);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};