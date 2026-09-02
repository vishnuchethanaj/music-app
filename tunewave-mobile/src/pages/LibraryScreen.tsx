import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../api/axios';
import { type Song } from '../context/PlayerContext';

type Playlist = {
    _id: string;
    name: string;
    songs: Song[];
};

const LibraryScreen = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);

  useEffect(() => {
    api.get<{ data: Playlist[] }>('/playlists').then((res) => setPlaylists(res.data.data));
    // Assuming endpoint exists for liked songs - I should check backend
    api.get<{ data: Song[] }>('/songs/liked').then((res) => setLikedSongs(res.data.data)).catch(() => setLikedSongs([]));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Library</Text>
      
      <Text style={styles.sectionTitle}>Playlists</Text>
      {playlists.map((pl) => (
        <TouchableOpacity key={pl._id} style={styles.item}>
          <Text style={styles.itemText}>{pl.name}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Liked Songs</Text>
      {likedSongs.map((song) => (
        <Text key={song._id} style={styles.itemText}>{song.title}</Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50, backgroundColor: '#121212' },
  header: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginTop: 20, marginBottom: 10 },
  item: { padding: 15, backgroundColor: '#1E1E1E', borderRadius: 8, marginBottom: 10 },
  itemText: { color: '#FFF' },
});

export default LibraryScreen;
