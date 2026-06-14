import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PopupAd = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const popupRef = useRef(null);
  const adLoadedRef = useRef(false);
  const location = useLocation();
  const { user } = useAuth();
  
  // Only show on content pages AFTER login
  const adAllowedPaths = ['/browse', '/files/'];
  const shouldShowAd = adAllowedPaths.some(path => location.pathname.startsWith(path)) && user;
  
  useEffect(() => {
    // Reset states when location changes
    setShowPopup(false);
    setShowCloseButton(false);
    adLoadedRef.current = false;
    
    if (!shouldShowAd || !import.meta.env.PROD) return;
    
    // Check if user has seen popup in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenAdPopup');
    
    if (!hasSeenPopup) {
      // Show popup after 5 seconds (not immediate)
      const showTimer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem('hasSeenAdPopup', 'true');
        
        // Show close button after 5 seconds (AdSense requires close button to be visible)
        const closeButtonTimer = setTimeout(() => {
          setShowCloseButton(true);
        }, 5000);
        
        return () => clearTimeout(closeButtonTimer);
      }, 5000);
      
      return () => clearTimeout(showTimer);
    }
  }, [location, shouldShowAd, user]);
  
  useEffect(() => {
    if (showPopup && popupRef.current && !adLoadedRef.current && window.adsbygoogle) {
      try {
        adLoadedRef.current = true;
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.warn('Popup ad push failed:', error);
      }
    }
  }, [showPopup]);
  
  const handleClose = () => {
    setShowPopup(false);
  };
  
  if (!showPopup || !shouldShowAd) return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '300px',
      maxWidth: '90%',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      zIndex: 1000,
      padding: '12px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      {showCloseButton && (
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            background: '#ef4444',
            border: 'none',
            color: 'white',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            zIndex: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
          aria-label="Close ad"
        >
          ✕
        </button>
      )}
      <ins
        ref={popupRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID}
        data-ad-slot="YOUR_POPUP_SLOT_ID"
        data-ad-format="rectangle"
        data-full-width-responsive="true"
      />
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default PopupAd;