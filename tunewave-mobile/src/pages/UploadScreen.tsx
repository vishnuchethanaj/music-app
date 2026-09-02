import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import api from '../api/axios';

const UploadScreen = () => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [audioFile, setAudioFile] = useState<any>(null);
  const [coverImage, setCoverImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    if (!result.canceled) {
      setAudioFile(result.assets[0]);
    }
  };

  const pickCover = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true });
    if (!result.canceled) {
      setCoverImage(result.assets[0]);
    }
  };

  const upload = async () => {
    if (!title || !genre || !audioFile) {
      Alert.alert('Error', 'Please fill all fields and pick an audio file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('genre', genre);
    
    // @ts-ignore
    formData.append('audio', {
      uri: audioFile.uri,
      name: audioFile.name,
      type: audioFile.mimeType || 'audio/mpeg',
    });

    if (coverImage) {
      // @ts-ignore
      formData.append('cover', {
        uri: coverImage.uri,
        name: 'cover.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      await api.post('/songs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Success', 'Song uploaded successfully');
      setTitle('');
      setGenre('');
      setAudioFile(null);
      setCoverImage(null);
    } catch (error) {
      Alert.alert('Error', 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Upload Song</Text>
        <TextInput style={styles.input} placeholder="Title" placeholderTextColor="#666" value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Genre" placeholderTextColor="#666" value={genre} onChangeText={setGenre} />
        
        <TouchableOpacity style={styles.button} onPress={pickAudio}><Text style={styles.buttonText}>{audioFile ? 'Audio Selected' : 'Pick Audio'}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickCover}><Text style={styles.buttonText}>{coverImage ? 'Cover Selected' : 'Pick Cover'}</Text></TouchableOpacity>
        
        {coverImage && <Image source={{ uri: coverImage.uri }} style={styles.preview} />}

        <TouchableOpacity style={styles.uploadButton} onPress={upload} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Upload</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContent: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
  input: { backgroundColor: '#1E1E1E', color: '#FFF', padding: 15, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#333', padding: 15, borderRadius: 8, marginBottom: 15 },
  buttonText: { color: '#FFF', textAlign: 'center' },
  uploadButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8 },
  preview: { width: 100, height: 100, marginBottom: 15, borderRadius: 8 }
});

export default UploadScreen;
