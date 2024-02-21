import * as React from 'react';
import { I18nManager } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
    InitialState,
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useKeepAwake } from 'expo-keep-awake';
import * as Updates from 'expo-updates';
import {
    Provider as PaperProvider,
    MD3DarkTheme,
    MD3LightTheme,
    MD2DarkTheme,
    MD2LightTheme,
    // MD2Theme,
    // MD3Theme,
    // useTheme,
    adaptNavigationTheme,
    configureFonts,
} from 'react-native-paper';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import DrawerItems from './DrawerItems';
import App from './RootNavigator';
import { colorThemes } from './utils';
import { PreferencesContext } from './context';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';
const PREFERENCES_KEY = 'APP_PREFERENCES';

const Drawer = createDrawerNavigator<{ Home: undefined }>();

export default function Main() {
    useKeepAwake();

    const [fontsLoaded] = useFonts({
        Abel: require('./assets/fonts/Abel-Regular.ttf'),
    });

    const [isReady, setIsReady] = React.useState(false);
    const [initialState, setInitialState] = React.useState<
        InitialState | undefined
    >();

    const [shouldUseDeviceColors, setShouldUseDeviceColors] =
        React.useState(true);
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [themeVersion, setThemeVersion] = React.useState<2 | 3>(3);
    const [rtl, setRtl] = React.useState<boolean>(
        I18nManager.getConstants().isRTL,
    );
    const [collapsed, setCollapsed] = React.useState(false);
    const [customFontLoaded, setCustomFont] = React.useState(false);
    const [rippleEffectEnabled, setRippleEffectEnabled] = React.useState(true);
    const [themeColor, setThemeColor] = React.useState("");

    const theme = React.useMemo(() => {
        if (themeVersion === 2) {
            return isDarkMode ?
                {
                    ...MD2DarkTheme,
                    colors: {
                        ...MD2DarkTheme.colors,
                        ...colorThemes?.[themeColor != "" ? themeColor : "red"].dark.colors
                    }
                }
                : {
                    ...MD2LightTheme,
                    colors: {
                        ...MD2LightTheme.colors,
                        ...colorThemes?.[themeColor != "" ? themeColor : "red"].light.colors
                    }
                };
        }
        return isDarkMode ?
            {
                ...MD3DarkTheme,
                colors: {
                    ...MD3DarkTheme.colors,
                    ...colorThemes?.[themeColor != "" ? themeColor : "red"].dark.colors,
                    surfaceVariant: '#121212',
                }
            }
            : {
                ...MD3LightTheme,
                colors: {
                    ...MD3LightTheme.colors,
                    ...colorThemes?.[themeColor != "" ? themeColor : "red"].light.colors,
                }
            };
    }, [isDarkMode, themeVersion, themeColor]);

    React.useEffect(() => {
        const restoreState = async () => {
            try {
                const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
                const state = JSON.parse(savedStateString || '');

                setInitialState(state);
            } catch (e) {
                // ignore error
            } finally {
                setIsReady(true);
            }
        };

        if (!isReady) {
            restoreState();
        }
    }, [isReady]);

    React.useEffect(() => {
        const restorePrefs = async () => {
            try {
                const prefString = await AsyncStorage.getItem(PREFERENCES_KEY);
                const preferences = JSON.parse(prefString || '');

                if (preferences) {
                    setIsDarkMode(preferences.theme === 'dark');

                    if (typeof preferences.rtl === 'boolean') {
                        setRtl(preferences.rtl);
                    }

                    if (preferences.color !== "") {
                        setThemeColor(preferences.color);
                    }
                }
            } catch (e) {
                // ignore error
            }
        };

        restorePrefs();
    }, []);

    React.useEffect(() => {
        const savePrefs = async () => {
            try {
                await AsyncStorage.setItem(
                    PREFERENCES_KEY,
                    JSON.stringify({
                        theme: isDarkMode ? 'dark' : 'light',
                        rtl,
                        color: themeColor
                    })
                );
            } catch (e) {
                // ignore error
            }

            if (I18nManager.getConstants().isRTL !== rtl) {
                I18nManager.forceRTL(rtl);
                Updates.reloadAsync();
            }
        };

        savePrefs();
    }, [rtl, isDarkMode, themeColor]);

    const preferences = React.useMemo(
        () => ({
            toggleShouldUseDeviceColors: () =>
                setShouldUseDeviceColors((oldValue) => !oldValue),
            toggleTheme: () => setIsDarkMode((oldValue) => !oldValue),
            toggleRtl: () => setRtl((rtl) => !rtl),
            toggleCollapsed: () => setCollapsed(!collapsed),
            toggleCustomFont: () => setCustomFont(!customFontLoaded),
            toggleRippleEffect: () => setRippleEffectEnabled(!rippleEffectEnabled),
            toggleThemeVersion: () => {
                setCustomFont(false);
                setCollapsed(false);
                setThemeVersion((oldThemeVersion) => (oldThemeVersion === 2 ? 3 : 2));
                setRippleEffectEnabled(true);
            },
            customFontLoaded,
            rippleEffectEnabled,
            collapsed,
            rtl,
            theme,
            shouldUseDeviceColors,
            changeThemeColor: (val: string) => { setThemeColor(val) },

        }),
        [
            rtl,
            theme,
            collapsed,
            customFontLoaded,
            shouldUseDeviceColors,
            rippleEffectEnabled,
            themeColor
        ]
    );

    if (!isReady && !fontsLoaded) {
        return null;
    }

    const { LightTheme, DarkTheme } = adaptNavigationTheme({
        reactNavigationLight: NavigationDefaultTheme,
        reactNavigationDark: NavigationDarkTheme,
    });

    const CombinedDefaultTheme = {
        ...MD3LightTheme,
        ...LightTheme,
        colors: {
            ...MD3LightTheme.colors,
            ...LightTheme.colors,
        },
    };

    const CombinedDarkTheme = {
        ...MD3DarkTheme,
        ...DarkTheme,
        colors: {
            ...MD3DarkTheme.colors,
            ...DarkTheme.colors,
        },
    };

    const combinedTheme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;
    const configuredFontTheme = {
        ...combinedTheme,
        fonts: configureFonts({
            config: {
                fontFamily: 'Abel',
            },
        }),
    };

    return (
        <PaperProvider
            settings={{ rippleEffectEnabled: preferences.rippleEffectEnabled }}
            theme={customFontLoaded ? configuredFontTheme : theme}
        >
            <PreferencesContext.Provider value={preferences}>
                <React.Fragment>
                    <NavigationContainer
                        theme={combinedTheme}
                        initialState={initialState}
                        onStateChange={(state) =>
                            AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
                        }
                    >
                        <SafeAreaInsetsContext.Consumer>
                            {(insets) => {
                                const { left, right } = insets || { left: 0, right: 0 };
                                const collapsedDrawerWidth = 80 + Math.max(left, right);
                                return (
                                    <Drawer.Navigator
                                        screenOptions={{
                                            drawerStyle: collapsed && {
                                                width: collapsedDrawerWidth,
                                            },
                                        }}
                                        drawerContent={() => <DrawerItems />}
                                    >
                                        <Drawer.Screen
                                            name="Home"
                                            component={App}
                                            options={{ headerShown: false }}
                                        />
                                    </Drawer.Navigator>
                                );
                            }}
                        </SafeAreaInsetsContext.Consumer>
                    </NavigationContainer>
                </React.Fragment>
            </PreferencesContext.Provider>
        </PaperProvider>
    );
}