import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const AdUnit = ({ slot, format = 'auto', style = {} }) => {
  const adRef = useRef(null);
  const location = useLocation();
  const adLoadedRef = useRef(false); // Track if ad already loaded
  
  // Only these pages are allowed to show ads
  const adAllowedPaths = ['/browse', '/files/'];
  const shouldShowAd = adAllowedPaths.some(path => location.pathname.startsWith(path));
  
  useEffect(() => {
    const isProduction = import.meta.env.PROD;
    const isAdSenseConfigured = import.meta.env.VITE_ADSENSE_CLIENT_ID && 
                                 import.meta.env.VITE_ADSENSE_CLIENT_ID !== 'ca-pub-xxxxxxxxxxxxxxxx';
    
    // Only try to load ad if:
    // 1. We should show it
    // 2. We're in production
    // 3. AdSense is configured
    // 4. The ref exists
    // 5. We haven't already loaded an ad in this element
    // 6. The ad isn't already filled
    if (isProduction && isAdSenseConfigured && shouldShowAd && adRef.current && !adLoadedRef.current && window.adsbygoogle) {
      // Check if ad is already rendered inside this ins element
      const hasAdContent = adRef.current.querySelector('iframe') || adRef.current.getAttribute('data-adsbygoogle-status') === 'done';
      
      if (!hasAdContent) {
        try {
          adLoadedRef.current = true;
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.warn('Ad push failed:', error);
          adLoadedRef.current = false;
        }
      }
    }
  }, [location]);

  // Don't render the ad element at all on disallowed pages or in development
  if (!shouldShowAd || !import.meta.env.PROD) {
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
      data-adsbygoogle-status="pending"
    />
  );
};

export default AdUnit;