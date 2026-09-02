import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Compass, UploadCloud, Library, User } from 'lucide-react-native';
import HomeScreen from '../pages/HomeScreen';
import DiscoverScreen from '../pages/DiscoverScreen';
import UploadScreen from '../pages/UploadScreen';
import LibraryScreen from '../pages/LibraryScreen';
import ProfileScreen from '../pages/ProfileScreen';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
