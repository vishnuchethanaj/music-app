import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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

  if (!playlist) return <Text style={{color: '#FFF'}}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{playlist.name}</Text>
      <TouchableOpacity style={styles.playButton} onPress={() => playlist.songs.length > 0 && playSong(playlist.songs[0], playlist.songs)}>
        <Text style={styles.buttonText}>Play All</Text>
      </TouchableOpacity>
      <ScrollView>
        {playlist.songs.map((song) => (
          <TouchableOpacity key={song._id} style={styles.item} onPress={() => playSong(song, playlist.songs)}>
            <Text style={styles.itemText}>{song.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50, backgroundColor: '#121212' },
  header: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 20 },
  playButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginBottom: 20 },
  buttonText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold' },
  item: { padding: 15, backgroundColor: '#1E1E1E', borderRadius: 8, marginBottom: 10 },
  itemText: { color: '#FFF' },
});

export default PlaylistDetailsScreen;
