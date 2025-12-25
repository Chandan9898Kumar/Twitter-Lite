import { useState } from 'react';
import { useAuth } from '../hooks/useAuthHook';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (!result.success) {
          setError(result.error || 'Login failed');
        }
      } else {
        const result = await register(formData.username, formData.email, formData.password);
        if (!result.success) {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          color: '#c33', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '15px',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', margin: '10px 0', backgroundColor: '#1da1f2', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>
      <p>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: 'none', border: 'none', color: '#1da1f2', cursor: 'pointer' }}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default Auth;