import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { PlayerProvider } from './src/context/PlayerContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PlayerProvider>
    </AuthProvider>
  );
}
