import { View, Text, StyleSheet } from 'react-native';

const UploadScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Upload Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default UploadScreen;
