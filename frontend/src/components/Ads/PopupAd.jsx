import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const PopupAd = () => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const adLoadedRef = useRef(false);
  const location = useLocation();
  
  // Only show on content pages
  const adAllowedPaths = ['/browse', '/files/'];
  const shouldShowAd = adAllowedPaths.some(path => location.pathname.startsWith(path));
  
  useEffect(() => {
    // Reset state when location changes
    setShowPopup(false);
    adLoadedRef.current = false;
    
    if (!shouldShowAd || !import.meta.env.PROD) return;
    
    // Show popup after 10 seconds only once per session
    const hasSeenPopup = sessionStorage.getItem('hasSeenAdPopup');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem('hasSeenAdPopup', 'true');
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [location, shouldShowAd]);
  
  useEffect(() => {
    if (showPopup && popupRef.current && !adLoadedRef.current && window.adsbygoogle) {
      const hasAdContent = popupRef.current.querySelector('iframe') || 
                          popupRef.current.getAttribute('data-adsbygoogle-status') === 'done';
      
      if (!hasAdContent) {
        try {
          adLoadedRef.current = true;
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.warn('Popup ad push failed:', error);
        }
      }
    }
  }, [showPopup]);
  
  if (!showPopup || !shouldShowAd) return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '300px',
      background: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      padding: '10px'
    }}>
      <button
        onClick={() => setShowPopup(false)}
        style={{
          float: 'right',
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer'
        }}
      >
        ×
      </button>
      <ins
        ref={popupRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID}
        data-ad-slot="YOUR_POPUP_SLOT_ID"
        data-ad-format="rectangle"
      />
    </div>
  );
};

export default PopupAd;