import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const TopBannerAd = () => {
  const adRef = useRef(null);
  const location = useLocation();
  const [showAd, setShowAd] = useState(true);
  const [adLoaded, setAdLoaded] = useState(false);
  const intervalRef = useRef(null);
  
  // Only show on content pages
  const adAllowedPaths = ['/browse', '/files/'];
  const shouldShowAd = adAllowedPaths.some(path => location.pathname.startsWith(path));
  
  // Reset showAd when location changes
  useEffect(() => {
    setShowAd(true);
    setAdLoaded(false);
  }, [location]);
  
  // Rotate ads every 60 seconds
  useEffect(() => {
    if (!shouldShowAd) return;
    
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set up interval to hide then show ad
    intervalRef.current = setInterval(() => {
      setShowAd(false);
      setAdLoaded(false);
      setTimeout(() => {
        setShowAd(true);
      }, 500); // Show after 500ms
    }, 60000); // 60 seconds
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [shouldShowAd, location]);
  
  // Load ad when shown
  useEffect(() => {
    if (showAd && shouldShowAd && !adLoaded && adRef.current && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      } catch (error) {
        console.warn('Ad push failed:', error);
      }
    }
  }, [showAd, shouldShowAd, adLoaded]);
  
  const handleClose = () => {
    setShowAd(false);
  };
  
  if (!shouldShowAd || !showAd || !import.meta.env.PROD) {
    return null;
  }
  
  return (
    <div style={{
      position: 'relative',
      margin: '0 auto 20px auto',
      maxWidth: '728px',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid var(--border)'
    }}>
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: 'rgba(0,0,0,0.5)',
          border: 'none',
          color: 'white',
          width: '24px',
          height: '24px',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '14px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label="Close ad"
      >
        ✕
      </button>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID}
        data-ad-slot="YOUR_TOP_BANNER_SLOT_ID"
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default TopBannerAd;