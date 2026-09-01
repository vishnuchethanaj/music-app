/**
 * SoundWave App
 * React Native Web Compatible
 *
 * @format
 */

import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <AppContent isDarkMode={isDarkMode} />
    </SafeAreaProvider>
  );
}

function AppContent({ isDarkMode }: { isDarkMode: boolean }) {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.darkBg : styles.lightBg,
        { paddingTop: safeAreaInsets.top },
      ]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
          🎵 SoundWave
        </Text>
        <Text style={[styles.subtitle, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
          Your music experience
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome to SoundWave</Text>
          <Text style={styles.cardText}>
            Your React Native app is now running on the web! 🚀
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Getting Started</Text>
          <Text style={styles.cardText}>
            Edit App.tsx to customize your application. Changes will hot-reload automatically.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%' as any,
  },
  darkBg: {
    backgroundColor: '#0a0a1a',
  },
  lightBg: {
    backgroundColor: '#f0f4ff',
  },
  header: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' as any,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 8,
    opacity: 0.9,
  },
  darkText: {
    color: '#ffffff',
  },
  lightText: {
    color: '#ffffff',
  },
  darkSubtext: {
    color: '#e0e0ff',
  },
  lightSubtext: {
    color: '#e0e0ff',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    gap: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
});

export default App;
