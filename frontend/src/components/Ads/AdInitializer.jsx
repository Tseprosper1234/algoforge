import React, { useEffect } from 'react';

const AdInitializer = () => {
  useEffect(() => {
    const isProduction = import.meta.env.PROD;
    const isAdSenseConfigured = import.meta.env.VITE_ADSENSE_CLIENT_ID && 
                                 import.meta.env.VITE_ADSENSE_CLIENT_ID !== 'ca-pub-xxxxxxxxxxxxxxxx';
    
    if (isProduction && isAdSenseConfigured) {
      // Only initialize AdSense if not already initialized
      if (!window.adsbygoogleLoaded) {
        window.adsbygoogleLoaded = true;
        
        try {
          // Load AdSense script
          const script = document.createElement('script');
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${import.meta.env.VITE_ADSENSE_CLIENT_ID}`;
          script.async = true;
          script.crossOrigin = 'anonymous';
          script.onerror = () => console.warn('AdSense script failed to load');
          document.head.appendChild(script);
          
          // Initialize ads array
          window.adsbygoogle = window.adsbygoogle || [];
        } catch (error) {
          console.warn('AdSense initialization failed:', error);
        }
      }
    }
  }, []);

  return null;
};

export default AdInitializer;