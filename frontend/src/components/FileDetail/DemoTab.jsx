import React, { useState } from 'react';

const DemoTab = ({ demoCode }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  if (!demoCode) {
    return <div>No demo available for this topic.</div>;
  }
  
  const handleMaximize = () => {
    setIsFullscreen(true);
  };
  
  const handleMinimize = () => {
    setIsFullscreen(false);
  };
  
  if (isFullscreen) {
    return (
      <div className="fullscreen-modal">
        <button className="close-fullscreen" onClick={handleMinimize}>
          ✕ Minimize
        </button>
        <iframe
          srcDoc={demoCode}
          title="Demo Fullscreen"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
        />
      </div>
    );
  }
  
  return (
    <div className="demo-container">
      <iframe
        srcDoc={demoCode}
        title="Demo"
        className="demo-iframe"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
      />
      <div className="demo-controls">
        <button onClick={handleMaximize}>⤢ Maximize</button>
      </div>
    </div>
  );
};

export default DemoTab;