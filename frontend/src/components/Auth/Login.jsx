import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowResend(false);
    setResendMessage('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      
      if (errorMessage.toLowerCase().includes('verify') || 
          errorMessage.toLowerCase().includes('verification') ||
          errorMessage.includes('not verified')) {
        setShowResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    
    setResendLoading(true);
    setResendMessage('');
    setError('');
    
    try {
      await api.post('/auth/resend-verification', { email });
      setResendMessage('New verification code sent! Check your email.');
      setShowResend(false);
      
      setTimeout(() => {
        navigate('/verify-email', { 
          state: { email: email },
          replace: true 
        });
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        
        {error && <div className="error-message">{error}</div>}
        {resendMessage && <div className="success-message">{resendMessage}</div>}
        
        <form onSubmit={handleSubmit}>
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {showResend && (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button
              onClick={handleResendVerification}
              disabled={resendLoading}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '0.85rem',
                textDecoration: 'underline'
              }}
            >
              {resendLoading ? 'Sending...' : 'Resend Verification Email'}
            </button>
          </div>
        )}
        
        <div className="link" onClick={() => navigate('/forgot-password')}>
          Forgot Password?
        </div>
        <div className="link" onClick={() => navigate('/register')}>
          Don't have an account? Register
        </div>
        
        {/* Footer Links - Visible before authentication */}
        <div style={{ 
          marginTop: '24px', 
          paddingTop: '16px', 
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          fontSize: '0.75rem'
        }}>
          <Link to="/about" style={{ color: '#64748b', textDecoration: 'none' }}>About</Link>
          <Link to="/privacy" style={{ color: '#64748b', textDecoration: 'none' }}>Privacy</Link>
          <Link to="/terms" style={{ color: '#64748b', textDecoration: 'none' }}>Terms</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;