import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
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
    // This assumes an endpoint like /api/artist/analytics
    // Need to verify backend route for artist analytics
    api.get<{ data: AnalyticsData }>('/artist/analytics').then((res) => setAnalytics(res.data.data)).catch(console.error);
  }, []);

  if (!analytics) return <Text style={{color: '#FFF'}}>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Artist Dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.text}>Total Plays: {analytics.totalPlays}</Text>
        <Text style={styles.text}>Total Likes: {analytics.totalLikes}</Text>
        <Text style={styles.text}>Followers: {analytics.followersCount}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50, backgroundColor: '#121212' },
  header: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 20 },
  card: { padding: 20, backgroundColor: '#1E1E1E', borderRadius: 8 },
  text: { color: '#FFF', marginBottom: 10, fontSize: 16 },
});

export default ArtistDashboardScreen;
