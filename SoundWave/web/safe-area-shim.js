// Shim for react-native-safe-area-context on web
import React from 'react';

export function SafeAreaProvider({ children }) {
  return React.createElement('div', { style: { display: 'flex', flex: 1, flexDirection: 'column', height: '100%' } }, children);
}

export function useSafeAreaInsets() {
  return { top: 0, right: 0, bottom: 0, left: 0 };
}

export function SafeAreaView({ children, style, ...props }) {
  return React.createElement('div', { style, ...props }, children);
}
