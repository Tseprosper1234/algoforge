// components/Ads/AdUnit.jsx
import React, { useEffect } from 'react';

const AdUnit = ({ slot, format = 'auto', style = {} }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <ins className="adsbygoogle"
         style={{ display: 'block', ...style }}
         data-ad-client="ca-pub-XXXXXXXXXXXXXX"
         data-ad-slot={slot}
         data-ad-format={format}
         data-full-width-responsive="true"></ins>
  );
};

export default AdUnit;