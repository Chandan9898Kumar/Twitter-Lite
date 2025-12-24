import { AuthProvider } from './components/AuthProvider';
import { useAuth } from './hooks/useAuthHook';
import Auth from './components/Auth';
import Feed from './components/Feed';
import './App.css';

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="App">
      {isAuthenticated ? <Feed /> : <Auth />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
