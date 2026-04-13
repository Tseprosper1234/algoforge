import React, { useState, useEffect } from 'react';

const TopBannerAd = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    let interval;
    let timeout;

    const showBannerWithTimeout = () => {
      setShowBanner(true);
      // Hide after 5 seconds
      timeout = setTimeout(() => {
        setShowBanner(false);
      }, 5000);
    };

    // Start showing banner every 60 seconds
    interval = setInterval(showBannerWithTimeout, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '1cm',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Google Ad Unit - Horizontal Banner */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="0987654321"
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default TopBannerAd;