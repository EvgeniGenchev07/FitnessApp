import {StatusBar, StyleSheet, View, type ViewProps} from 'react-native';

import {useThemeColor} from '@/hooks/useThemeColor';
import {SafeAreaView} from "react-native-safe-area-context";

export type ThemedBackgroundProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedBackground({style, lightColor, darkColor, ...otherProps}: ThemedBackgroundProps) {
    const backgroundColor = useThemeColor({light: lightColor, dark: darkColor,}, 'background');
    return <SafeAreaView style={[styles.container, {backgroundColor: backgroundColor},
        style]} {...otherProps} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    }
});
