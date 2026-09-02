import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Profile</Text>
        {user && (
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Username: {user.username}</Text>
            <Text style={styles.text}>Email: {user.email}</Text>
            {user.isArtist && (
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ArtistDashboard')}>
                <Text style={styles.buttonText}>Artist Dashboard</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContent: { padding: 16 },
  header: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 20 },
  infoContainer: { marginBottom: 20 },
  text: { color: '#FFF', marginBottom: 10 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginBottom: 15 },
  logoutButton: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 8 },
  buttonText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold' },
});

export default ProfileScreen;
