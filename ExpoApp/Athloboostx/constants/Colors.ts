/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#ff0019';
const tintColorDark = '#ff0019';
const primaryColor = '#ff0019';
const blurLight = '#ffffd5';
const blurDark = 'rgba(43,42,42,0.5)';
export const Colors = {
    light: {
        text: '#000000',
        background: '#ffffff',
        tint: tintColorLight,
        icon: '#000000',
        tabIconDefault: '#999999',
        tabIconSelected: tintColorLight,
        card: '#f5f5f5',
        border: '#e0e0e0',
        blur: 'rgba(255, 255, 255, 0.8)',
        blurBorder: 'rgba(255, 255, 255, 0.5)',
        inputColor: '#ffffff',
        borderColor: '#e0e0e0',
        linkText: tintColorLight,
        buttonBackground: tintColorLight,
        shadow: 'rgba(0, 0, 0, 0.1)',
        error: '#ff3b30',
        success: '#34c759',
        warning: '#ff9500',
        info: '#007aff',
    },
    dark: {
        text: '#ffffff',
        background: '#000000',
        tint: tintColorDark,
        icon: '#ffffff',
        tabIconDefault: '#666666',
        tabIconSelected: tintColorDark,
        card: '#1c1c1e',
        border: '#2c2c2e',
        blur: 'rgba(0, 0, 0, 0.8)',
        blurBorder: 'rgba(255, 255, 255, 0.1)',
        inputColor: '#1c1c1e',
        borderColor: '#2c2c2e',
        linkText: tintColorDark,
        buttonBackground: tintColorDark,
        shadow: 'rgba(0, 0, 0, 0.3)',
        error: '#ff453a',
        success: '#32d74b',
        warning: '#ff9f0a',
        info: '#0a84ff',
    },
};
