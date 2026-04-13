import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AdInitializer = () => {
  const location = useLocation();

  useEffect(() => {
    // Load Google Ads script
    const loadAdsScript = () => {
      if (!document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.setAttribute('data-ad-client', 'ca-pub-XXXXXXXXXXXXXXXX');
        document.head.appendChild(script);
      }
    };

    loadAdsScript();

    // Push ads when they're loaded
    const pushAds = () => {
      if (window.adsbygoogle) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error('Ad error:', e);
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(pushAds, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
};

export default AdInitializer;