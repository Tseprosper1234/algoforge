import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const TopBannerAd = () => {
  const adRef = useRef(null);
  const location = useLocation();
  const adLoadedRef = useRef(false);
  const intervalRef = useRef(null);
  
  // Only show on content pages
  const adAllowedPaths = ['/browse', '/files/'];
  const shouldShowAd = adAllowedPaths.some(path => location.pathname.startsWith(path));
  
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Reset loaded flag when location changes
    adLoadedRef.current = false;
    
    const isProduction = import.meta.env.PROD;
    const isAdSenseConfigured = import.meta.env.VITE_ADSENSE_CLIENT_ID && 
                                 import.meta.env.VITE_ADSENSE_CLIENT_ID !== 'ca-pub-xxxxxxxxxxxxxxxx';
    
    if (!isProduction || !isAdSenseConfigured || !shouldShowAd || !adRef.current) {
      return;
    }
    
    // Function to load ad
    const loadAd = () => {
      if (adRef.current && !adLoadedRef.current && window.adsbygoogle) {
        const hasAdContent = adRef.current.querySelector('iframe') || 
                            adRef.current.getAttribute('data-adsbygoogle-status') === 'done';
        
        if (!hasAdContent) {
          try {
            adLoadedRef.current = true;
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (error) {
            console.warn('Top banner ad push failed:', error);
          }
        }
      }
    };
    
    // Load ad after a short delay
    const timeoutId = setTimeout(loadAd, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [location]);
  
  if (!shouldShowAd || !import.meta.env.PROD) {
    return null;
  }
  
  return (
    <div style={{ textAlign: 'center', margin: '10px 0', minHeight: '90px' }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID}
        data-ad-slot="YOUR_TOP_BANNER_SLOT_ID"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default TopBannerAd;