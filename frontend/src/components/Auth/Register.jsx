import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/register', { email, password, username });
      console.log('Registration response:', response.data);
      
      // Store email in localStorage immediately
      localStorage.setItem('pendingVerificationEmail', email);
      
      setSuccessMessage(response.data.message || 'Registration successful! Please verify your email.');
      
      // Automatically redirect after 2 seconds
      setTimeout(() => {
        navigate('/verify-email', { 
          state: { email: email },
          replace: true 
        });
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
            <div style={{ marginTop: '10px', fontSize: '0.8rem' }}>
              Redirecting to verification...
            </div>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        
        <div className="link" onClick={() => navigate('/login')}>
          Already have an account? Login
        </div>
      </div>
    </div>
  );
};

export default Register;
