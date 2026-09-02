import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Play, Search } from 'lucide-react-native';
import api from '../api/axios';
import { usePlayer, type Song } from '../context/PlayerContext';

const DiscoverScreen = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState('');
  const { playSong } = usePlayer();

  useEffect(() => {
    api.get<{ data: Song[] }>('/songs').then((res) => setSongs(res.data.data));
  }, []);

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(search.toLowerCase()) ||
    song.artistName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search color="#666" size={20} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search songs or artists"
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredSongs.map((song) => (
          <TouchableOpacity key={song._id} style={styles.songCard} onPress={() => playSong(song, filteredSongs)}>
            <Image source={{ uri: song.coverUrl }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={1}>{song.title}</Text>
              <Text style={styles.artist} numberOfLines={1}>{song.artistName}</Text>
            </View>
            <Play size={20} color="#FFF" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50, backgroundColor: '#121212' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', borderRadius: 8, padding: 10, marginBottom: 16 },
  searchInput: { flex: 1, marginLeft: 10, color: '#FFF' },
  scrollContent: { paddingBottom: 100 },
  songCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', padding: 10, borderRadius: 8, marginBottom: 10 },
  image: { width: 50, height: 50, borderRadius: 4 },
  info: { flex: 1, marginLeft: 10 },
  title: { color: '#FFF', fontWeight: 'bold' },
  artist: { color: '#AAA' },
});

export default DiscoverScreen;
