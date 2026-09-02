import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, Compass, UploadCloud, Library, User } from 'lucide-react-native';
import HomeScreen from '../pages/HomeScreen';
import DiscoverScreen from '../pages/DiscoverScreen';
import UploadScreen from '../pages/UploadScreen';
import LibraryScreen from '../pages/LibraryScreen';
import PlaylistDetailsScreen from '../pages/PlaylistDetailsScreen';
import ProfileScreen from '../pages/ProfileScreen';
import ArtistDashboardScreen from '../pages/ArtistDashboardScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const LibraryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LibraryHome" component={LibraryScreen} />
    <Stack.Screen name="PlaylistDetails" component={PlaylistDetailsScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProfileHome" component={ProfileScreen} />
        <Stack.Screen name="ArtistDashboard" component={ArtistDashboardScreen} />
    </Stack.Navigator>
);

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <Home size={size} color={color} />;
          if (route.name === 'Discover') return <Compass size={size} color={color} />;
          if (route.name === 'Upload') return <UploadCloud size={size} color={color} />;
          if (route.name === 'Library') return <Library size={size} color={color} />;
          if (route.name === 'Profile') return <User size={size} color={color} />;
          return null;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="Library" component={LibraryStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};
