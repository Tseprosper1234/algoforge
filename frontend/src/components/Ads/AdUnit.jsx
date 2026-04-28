import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const AdUnit = ({ slot, format = 'auto', style = {} }) => {
  const adRef = useRef(null);
  const location = useLocation();
  
  // Only show ads on content-rich pages, not on auth or empty pages
  const shouldShowAd = () => {
    const path = location.pathname;
    
    // Always hide on these pages
    const hiddenPaths = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];
    if (hiddenPaths.includes(path)) return false;
    
    // Hide on chat page (user-generated content)
    if (path === '/chat') return false;
    
    // Show on content pages
    const contentPaths = ['/browse', '/files/', '/search', '/profile'];
    if (contentPaths.some(p => path.includes(p))) return true;
    
    return false;
  };
  
  useEffect(() => {
    const isProduction = import.meta.env.PROD;
    const isAdSenseConfigured = import.meta.env.VITE_ADSENSE_CLIENT_ID && 
                                 import.meta.env.VITE_ADSENSE_CLIENT_ID !== 'ca-pub-xxxxxxxxxxxxxxxx';
    
    if (isProduction && isAdSenseConfigured && shouldShowAd() && adRef.current && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.warn('Ad push failed:', error);
      }
    }
  }, [location]);

  if (!shouldShowAd() || !import.meta.env.PROD) {
    return null;
  }

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: 'block', ...style }}
      data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
};

export default AdUnit;