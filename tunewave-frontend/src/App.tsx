import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { LibraryProvider } from './context/LibraryContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import ArtistProtectedRoute from './components/ArtistProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import BottomNav from './components/BottomNav';
import MusicPlayer from './components/MusicPlayer';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Upload from './pages/Upload';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Following from './pages/Following';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ArtistDashboard from './pages/ArtistDashboard';
import ArtistProfile from './pages/ArtistProfile';
import SongDetails from './pages/SongDetails';
import NowPlaying from './pages/NowPlaying';
import NotificationsPage from './pages/Notifications';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSongs from './pages/admin/AdminSongs';

const AuthRedirect = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, loading } = useAuth();
  if (!loading && isAuthenticated) return <Navigate to="/home" replace />;
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/now-playing';

  return (
    <div className="flex h-screen flex-col bg-bg-base text-text-primary">
      <main className={`flex-1 overflow-y-auto ${!isAuthPage ? 'pb-32' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
          <Route path="/signup" element={<AuthRedirect><Signup /></AuthRedirect>} />
          <Route path="/home" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/upload" element={<ArtistProtectedRoute><Upload /></ArtistProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/following" element={<ProtectedRoute><Following /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/artist-dashboard" element={<ArtistProtectedRoute><ArtistDashboard /></ArtistProtectedRoute>} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/song/:id" element={<SongDetails />} />
          <Route path="/now-playing" element={<NowPlaying />} />
          
          <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
          <Route path="/admin/songs" element={<AdminProtectedRoute><AdminSongs /></AdminProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
      {!isAuthPage && <BottomNav />}
      {!isAuthPage && <MusicPlayer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <LibraryProvider>
          <NotificationProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </NotificationProvider>
        </LibraryProvider>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;
