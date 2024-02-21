import React from "react";
import { MD2Theme, MD3Theme, useTheme } from "react-native-paper";

export const PreferencesContext = React.createContext<{
    toggleShouldUseDeviceColors?: () => void;
    toggleTheme: () => void;
    toggleRtl: () => void;
    toggleThemeVersion: () => void;
    toggleCollapsed: () => void;
    toggleCustomFont: () => void;
    toggleRippleEffect: () => void;
    customFontLoaded: boolean;
    rippleEffectEnabled: boolean;
    collapsed: boolean;
    rtl: boolean;
    theme: MD2Theme | MD3Theme;
    shouldUseDeviceColors?: boolean;
    changeThemeColor: (color: string) => void
} | null>(null);

export const useExampleTheme = () => useTheme<MD2Theme | MD3Theme>();