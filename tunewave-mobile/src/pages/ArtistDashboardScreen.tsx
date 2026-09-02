import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/axios';

type AnalyticsData = {
  totalPlays: number;
  totalLikes: number;
  followersCount: number;
  publishedSongsCount: number;
};

const ArtistDashboardScreen = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    api.get<{ data: AnalyticsData }>('/artist/analytics').then((res) => setAnalytics(res.data.data)).catch(console.error);
  }, []);

  if (!analytics) return <SafeAreaView style={styles.container}><Text style={{color: '#FFF', padding: 16}}>Loading...</Text></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Artist Dashboard</Text>
        <View style={styles.card}>
          <Text style={styles.text}>Total Plays: {analytics.totalPlays}</Text>
          <Text style={styles.text}>Total Likes: {analytics.totalLikes}</Text>
          <Text style={styles.text}>Followers: {analytics.followersCount}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContent: { padding: 16 },
  header: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 20 },
  card: { padding: 20, backgroundColor: '#1E1E1E', borderRadius: 8 },
  text: { color: '#FFF', marginBottom: 10, fontSize: 16 },
});

export default ArtistDashboardScreen;
