import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Play } from 'lucide-react-native';
import api from '../api/axios';
import { usePlayer, type Song } from '../context/PlayerContext';

const HomeScreen = () => {
  const [trending, setTrending] = useState<Song[]>([]);
  const [followed, setFollowed] = useState<Song[]>([]);
  const { playSong } = usePlayer();

  useEffect(() => {
    api.get<{ data: Song[] }>('/songs').then((res) => setTrending(res.data.data));
    api.get<{ data: Song[] }>('/songs/followed').then((res) => setFollowed(res.data.data)).catch(() => setFollowed([]));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>TuneWave</Text>
      
      <Text style={styles.sectionTitle}>From Artists You Follow</Text>
      {followed.length === 0 ? (
        <Text style={styles.emptyText}>Follow artists to see their latest music here.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {followed.map((song) => (
            <View key={song._id} style={styles.card}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: song.coverUrl }} style={styles.image} />
                <TouchableOpacity onPress={() => playSong(song, followed)} style={styles.playButton}>
                  <Play size={16} color="white" fill="white" />
                </TouchableOpacity>
              </View>
              <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
              <Text style={styles.artistName} numberOfLines={1}>{song.artistName}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <Text style={styles.sectionTitle}>Trending Now</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {trending.map((song) => (
          <View key={song._id} style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: song.coverUrl }} style={styles.image} />
              <TouchableOpacity onPress={() => playSong(song, trending)} style={styles.playButton}>
                <Play size={16} color="white" fill="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
            <Text style={styles.artistName} numberOfLines={1}>{song.artistName}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: '900', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#666', marginBottom: 16 },
  horizontalScroll: { marginBottom: 24 },
  card: { width: 140, marginRight: 16 },
  imageContainer: { width: 120, height: 120, borderRadius: 16, overflow: 'hidden', marginBottom: 8 },
  image: { width: '100%', height: '100%' },
  playButton: { position: 'absolute', bottom: 8, right: 8, padding: 8, backgroundColor: '#007AFF', borderRadius: 20 },
  songTitle: { fontSize: 14, fontWeight: '500' },
  artistName: { fontSize: 12, color: '#666' },
});

export default HomeScreen;
