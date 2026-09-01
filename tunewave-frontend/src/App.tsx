import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ArtistProtectedRoute from './components/ArtistProtectedRoute';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Upload from './pages/Upload';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ArtistDashboard from './pages/ArtistDashboard';
import ArtistProfile from './pages/ArtistProfile';

const AuthRedirect = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="flex h-screen flex-col bg-bg-base text-text-primary">
      <main className={`flex-1 overflow-y-auto ${!isAuthPage ? 'pb-20' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
          <Route path="/signup" element={<AuthRedirect><Signup /></AuthRedirect>} />
          <Route path="/home" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/artist-dashboard" element={<ArtistProtectedRoute><ArtistDashboard /></ArtistProtectedRoute>} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      {!isAuthPage && <BottomNav />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
