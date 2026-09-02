import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/axios';
import { type Song } from '../context/PlayerContext';

type Playlist = {
    _id: string;
    name: string;
    songs: Song[];
};

const LibraryScreen = ({ navigation }: any) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const fetchPlaylists = async () => {
    const res = await api.get<{ data: Playlist[] }>('/playlists');
    setPlaylists(res.data.data);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const createPlaylist = async () => {
    if (!newPlaylistName) return;
    await api.post('/playlists', { name: newPlaylistName });
    setNewPlaylistName('');
    fetchPlaylists();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Your Library</Text>
        
        <View style={styles.inputContainer}>
          <TextInput 
              style={styles.input} 
              placeholder="New Playlist Name" 
              placeholderTextColor="#666" 
              value={newPlaylistName} 
              onChangeText={setNewPlaylistName} 
          />
          <TouchableOpacity style={styles.createButton} onPress={createPlaylist}><Text style={styles.buttonText}>Create</Text></TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Playlists</Text>
        {playlists.map((pl) => (
          <TouchableOpacity key={pl._id} style={styles.item} onPress={() => navigation.navigate('PlaylistDetails', { playlistId: pl._id })}>
            <Text style={styles.itemText}>{pl.name}</Text>
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
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, backgroundColor: '#1E1E1E', color: '#FFF', padding: 10, borderRadius: 8 },
  createButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8, marginLeft: 10 },
  buttonText: { color: '#FFF' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
  item: { padding: 15, backgroundColor: '#1E1E1E', borderRadius: 8, marginBottom: 10 },
  itemText: { color: '#FFF' },
});

export default LibraryScreen;
