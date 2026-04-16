import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import PasswordInput from './PasswordInput';

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
            
            if (errorMessage.includes('verify') || errorMessage.includes('verification')) {
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
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '16px',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            marginTop: '8px'
                        }}
                    >
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
            </div>
        </div>
    );
};

export default Login;
