/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';
const primaryColor = '#ff0019';
const blurLight = '#ffffd5';
const blurDark = 'rgba(43,42,42,0.5)';
export const Colors = {
    light: {
        text: '#11181C',
        background: '#fff',
        tint: tintColorLight,
        blur: blurLight,
        inputColor: '#282828',
        blurBorder: '#rgba(74,74,74,0.78)',
        borderColor: primaryColor,
        linkText: '#ffffff',
        buttonBackground: primaryColor,
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: tintColorLight,
        shadow: '#fff'
    },
    dark: {
        text: '#ECEDEE',
        background: '#151718',
        tint: tintColorDark,
        blur: blurDark,
        inputColor: '#282828',
        blurBorder: '#rgba(74,74,74,0.78)',
        linkText: primaryColor,
        borderColor: primaryColor,
        buttonBackground: blurDark,
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: tintColorDark,
        shadow: '#000'
    },
};
