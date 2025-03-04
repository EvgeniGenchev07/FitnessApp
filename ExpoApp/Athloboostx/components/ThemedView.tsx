import {StatusBar, StyleSheet, View, type ViewProps} from 'react-native';

import {useThemeColor} from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'content_input' | 'content' | 'blur' | 'side_content' | 'top_bar';
};

export function ThemedView({style, lightColor, darkColor, type = 'default', ...otherProps}: ThemedViewProps) {
    const backgroundColor = useThemeColor({light: lightColor, dark: darkColor,}, 'background');
    const blur = useThemeColor({light: lightColor, dark: darkColor,}, 'blur');
    const blur_border = useThemeColor({light: lightColor, dark: darkColor,}, 'blurBorder');
    return <View style={[
        type === 'default' ? {backgroundColor} : undefined,
        type === 'content' ? styles.content : undefined,
        type === 'content_input' ? styles.content_input : undefined,
        type === 'side_content' ? styles.side_content : undefined,
        type === 'blur' ? [styles.blur, {borderColor: blur_border}, {backgroundColor: blur}] : undefined,
        style]} {...otherProps} />;
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: '3%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    blur: {
        flex: 1,
        zIndex: 1,
        borderWidth: 0.2,
        borderBottomRightRadius: '25%',
        borderTopLeftRadius: '25%',
        marginBottom: "40%",
        marginTop: "30%"
    },
    content_input: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 50,
        marginBottom: "4%",
    },
    side_content: {
        alignItems: 'center',
        paddingBottom: 20,
        marginBottom: '3%'
    },
    top_bar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: StatusBar.currentHeight || 10,
    }
});
