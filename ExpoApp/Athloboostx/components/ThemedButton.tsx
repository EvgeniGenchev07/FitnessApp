import {Text, type TextProps, StyleSheet, TouchableOpacity} from 'react-native';

import {useThemeColor} from '@/hooks/useThemeColor';

export type ThemedButtonProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'image' | 'icon';
};

export function ThemedButton({
                                 style,
                                 lightColor,
                                 darkColor,
                                 type = 'default',
                                 ...rest
                             }: ThemedButtonProps) {
    const borderColor = useThemeColor({light: lightColor, dark: darkColor}, 'borderColor');
    const colorDefaultText = useThemeColor({light: lightColor, dark: darkColor}, 'text');

    return (
        <TouchableOpacity
            style={[
                {color: colorDefaultText},
                type === 'default' ? [styles.default, {borderColor}] : undefined,
                type === 'image' ? styles.image : undefined,
                type === 'icon' ? styles.icon : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        width: '100%',
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },
    image: {},
    icon: {},
});
