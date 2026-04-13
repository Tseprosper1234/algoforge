import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from './NotificationBell';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from '../../assets/algoforge.jpg';

const Header = ({ canGoBack, onBack }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();

  const handleSearch = () => {
    const query = prompt('Enter search term:');
    if (query && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  return (
    <div className="header">
      {/* Logo */}
        <div 
          onClick={() => navigate('/')} 
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          🧠 <span style={{ fontSize: '18px' }}>AlgoForge</span>
        </div>
      
      <div className="header-actions">
        <button className="header-icon" onClick={handleSearch}>
          🔍
        </button>

        <button className="header-icon" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        
        <NotificationBell />
        
        {isAdmin && (
          <button className="header-icon" onClick={handleAdminPanel}>
            ⚙️
          </button>
        )}
        
        <button className="header-icon" onClick={logout}>
          🚪
        </button>
      </div>
    </div>
  );
};

export default Header;