import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const canGoBack = location.pathname !== '/browse' && location.pathname !== '/';

  return (
    <div className="app" style={{height: '100vh'}}>
      <Header canGoBack={canGoBack} onBack={() => navigate(-1)} />
      <div className="main-content">
        <Outlet />
      </div>

      {/* Footer with Legal Links - ADD THIS */}
      <div style={{ 
        padding: '12px 20px', 
        textAlign: 'center', 
        fontSize: '0.7rem', 
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-card)',
        flexShrink: 0
      }}>
        <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', marginRight: '16px' }}>
          Privacy Policy
        </Link>
        <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
          Terms of Service
        </Link>
        <span style={{ marginLeft: '16px' }}>© 2025 AlgoForge</span>
      </div>

      <BottomNav />
    </div>
  );
};

export default MainLayout;