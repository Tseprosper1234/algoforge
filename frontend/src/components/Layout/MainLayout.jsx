import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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

      <BottomNav />
    </div>
  );
};

export default MainLayout;