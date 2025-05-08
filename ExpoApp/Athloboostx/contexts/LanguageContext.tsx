import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Languages } from '@/constants/Languages';

type Language = 'en' | 'bg';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => Promise<void>;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLanguage = await SecureStore.getItemAsync('language');
            if (savedLanguage) {
                setLanguageState(savedLanguage as Language);
            }
        } catch (error) {
            console.error('Error loading language:', error);
        }
    };

    const setLanguage = async (lang: Language) => {
        try {
            await SecureStore.setItemAsync('language', lang);
            setLanguageState(lang);
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    const t = (key: string) => {
        const keys = key.split('.');
        let value: any = Languages[language];
        
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key;
            }
        }
        
        return typeof value === 'string' ? value : key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};