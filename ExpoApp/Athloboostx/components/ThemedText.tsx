import {Text, type TextProps, StyleSheet} from 'react-native';

import {useThemeColor} from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'title' | 'defaultBold' | 'subtitle' | 'link' | 'button' | 'error' | 'bar' | 'description';
};

export function ThemedText({
                               style,
                               lightColor,
                               darkColor,
                               type = 'default',
                               ...rest
                           }: ThemedTextProps) {
    const colorLink = useThemeColor({light: lightColor, dark: darkColor}, 'linkText');
    const colorDefaultText = useThemeColor({light: lightColor, dark: darkColor}, 'text');

    return (
        <Text
            style={[
                {color: colorDefaultText},
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'defaultBold' ? styles.defaultBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? [styles.button, {color: colorLink}] : undefined,
                type === 'button' ? [styles.button, {color: colorLink}] : undefined,
                type === 'error' ? [styles.error, {color: colorLink}] : undefined,
                type === 'bar' ? [styles.bar, {color: colorLink}] : undefined,
                type === 'description' ? styles.description : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
    defaultBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        position: 'absolute',
        top: '5%',
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
    },
    button: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        marginBottom: 10,
    },
    bar: {
        fontSize: 22,
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    }
});
