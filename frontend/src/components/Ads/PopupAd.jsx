import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { shouldShowPopupAd, recordPopupAdShown } from '../../utils/adTracker';

const PopupAd = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const location = useLocation();

    useEffect(() => {
        let popupTimer;
        let cancelTimer;

        // Only show popup on the home route ('/')
        if (location.pathname === '/browse' && shouldShowPopupAd()) {
            popupTimer = setTimeout(() => {
                setShowPopup(true);
                recordPopupAdShown();

                // Show cancel button after 5 more seconds (10 seconds total)
                cancelTimer = setTimeout(() => {
                    setShowCancel(true);
                }, 5000);
            }, 5000);
        } else {
            // Reset if not on home route
            setShowPopup(false);
            setShowCancel(false);
        }

        return () => {
            clearTimeout(popupTimer);
            clearTimeout(cancelTimer);
        };
    }, [location.pathname]);

    const handleClose = () => {
        setShowPopup(false);
        setShowCancel(false);
    };

    if (!showPopup) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            minWidth: '300px',
            maxWidth: '600px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            zIndex: 10000,
            padding: '20px',
            textAlign: 'center'
        }}>
            {/* Close button - appears after 5 seconds of popup showing */}
            {showCancel && (
                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ✕
                </button>
            )}

            <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>Sponsored Content</h3>

            {/* Google Ad Unit */}
            <div style={{ minHeight: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', width: '100%', height: '250px' }}
                    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                    data-ad-slot="1234567890"
                    data-ad-format="rectangle"
                    data-full-width-responsive="true"
                ></ins>
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '15px' }}>
                {!showCancel ? 'Ad will close in 5 seconds...' : 'Click ✕ to close ad'}
            </p>
        </div>
    );
};

export default PopupAd;