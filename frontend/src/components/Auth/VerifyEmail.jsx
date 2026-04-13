import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Try multiple ways to get the email
    const stateEmail = location.state?.email;
    const storedEmail = localStorage.getItem('pendingVerificationEmail');
    const urlParams = new URLSearchParams(location.search);
    const urlEmail = urlParams.get('email');
    
    console.log('Email sources:', { stateEmail, storedEmail, urlEmail });
    
    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem('pendingVerificationEmail', stateEmail);
      setIsLoading(false);
    } else if (storedEmail) {
      setEmail(storedEmail);
      setIsLoading(false);
    } else if (urlEmail) {
      setEmail(urlEmail);
      localStorage.setItem('pendingVerificationEmail', urlEmail);
      setIsLoading(false);
    } else {
      // Instead of redirecting immediately, show a form to enter email
      setIsLoading(false);
    }
  }, [location]);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    // If no email, get it from input
    const emailToVerify = email || document.getElementById('verificationEmail')?.value;
    
    if (!emailToVerify) {
      setError('Please enter your email address');
      return;
    }
    
    if (!code || code.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/verify-email', { email: emailToVerify, code });
      setMessage('Email verified successfully! Redirecting to login...');
      
      // Clear stored email
      localStorage.removeItem('pendingVerificationEmail');
      
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Verification failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const emailToVerify = email || document.getElementById('verificationEmail')?.value;
    
    if (!emailToVerify) {
      setError('Please enter your email address');
      return;
    }
    
    setResendLoading(true);
    setError('');
    setMessage('');
    try {
      await api.post('/auth/resend-verification', { email: emailToVerify });
      setMessage('New verification code sent to your email.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  // If still loading, show loading spinner
  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify Your Email</h2>
        
        {!email ? (
          // Show email input if no email was passed
          <div>
            <p style={{ marginBottom: '16px', color: '#64748b', textAlign: 'center' }}>
              Please enter the email address you registered with
            </p>
            <input
              id="verificationEmail"
              type="email"
              placeholder="Enter your email address"
              style={{ marginBottom: '16px' }}
            />
          </div>
        ) : (
          <p style={{ marginBottom: '16px', color: '#64748b', textAlign: 'center' }}>
            We've sent a 6-digit verification code to<br />
            <strong>{email}</strong>
          </p>
        )}
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            maxLength="6"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            required
            style={{ 
              textAlign: 'center', 
              fontSize: '1.2rem', 
              letterSpacing: '4px',
              fontWeight: 'bold'
            }}
            autoFocus
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
        
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            onClick={handleResend}
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
            {resendLoading ? 'Sending...' : 'Resend Code'}
          </button>
        </div>
        
        <div className="link" onClick={() => navigate('/login')}>
          Back to Login
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;