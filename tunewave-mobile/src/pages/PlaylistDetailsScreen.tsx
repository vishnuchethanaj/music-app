import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/axios';
import { usePlayer, type Song } from '../context/PlayerContext';

type Playlist = {
    _id: string;
    name: string;
    songs: Song[];
};

const PlaylistDetailsScreen = ({ route }: any) => {
  const { playlistId } = route.params;
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const { playSong } = usePlayer();

  useEffect(() => {
    api.get<{ data: Playlist }>(`/playlists/${playlistId}`).then((res) => setPlaylist(res.data.data));
  }, [playlistId]);

  if (!playlist) return <SafeAreaView style={styles.container}><Text style={{color: '#FFF', padding: 16}}>Loading...</Text></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>{playlist.name}</Text>
        <TouchableOpacity style={styles.playButton} onPress={() => playlist.songs.length > 0 && playSong(playlist.songs[0], playlist.songs)}>
          <Text style={styles.buttonText}>Play All</Text>
        </TouchableOpacity>
        
        {playlist.songs.map((song) => (
          <TouchableOpacity key={song._id} style={styles.item} onPress={() => playSong(song, playlist.songs)}>
            <Text style={styles.itemText}>{song.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContent: { padding: 16 },
  header: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 20 },
  playButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginBottom: 20 },
  buttonText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold' },
  item: { padding: 15, backgroundColor: '#1E1E1E', borderRadius: 8, marginBottom: 10 },
  itemText: { color: '#FFF' },
});

export default PlaylistDetailsScreen;
