import React, { useState, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ExampleCodesTab = ({ codes }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const codeContainerRef = useRef(null);

  const languageMap = {
    python: { label: 'Python', extension: 'python' },
    javascript: { label: 'JavaScript', extension: 'javascript' },
    cpp: { label: 'C++', extension: 'cpp' },
    java: { label: 'Java', extension: 'java' }
  };

  const languages = Object.keys(languageMap);
  const filteredCodes = codes.filter(code => code.language === selectedLanguage);

  const handleCopy = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Could not copy to clipboard. Please select and copy manually.');
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  if (codes.length === 0) {
    return <div>No example codes available for this topic.</div>;
  }

  return (
    <div>
      <div className="language-selector">
        {languages.map(lang => (
          <button
            key={lang}
            className={`lang-btn ${selectedLanguage === lang ? 'active' : ''}`}
            onClick={() => setSelectedLanguage(lang)}
          >
            {languageMap[lang].label}
          </button>
        ))}
      </div>

      {filteredCodes.length === 0 ? (
        <div>No examples for {languageMap[selectedLanguage].label} yet.</div>
      ) : (
        filteredCodes.map((code, idx) => (
          <div 
            key={code.id || idx} 
            className="code-block" 
            style={{ 
              position: 'relative',
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-x pan-y pinch-zoom'
            }}
          >
            {/* Zoom Controls */}
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              display: 'flex',
              gap: '4px',
              zIndex: 2,
              background: 'rgba(0,0,0,0.7)',
              borderRadius: '8px',
              padding: '4px'
            }}>
              <button
                onClick={handleZoomOut}
                style={{
                  background: '#3b82f6',
                  border: 'none',
                  color: 'white',
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                −
              </button>
              <button
                onClick={handleResetZoom}
                style={{
                  background: '#3b82f6',
                  border: 'none',
                  color: 'white',
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                style={{
                  background: '#3b82f6',
                  border: 'none',
                  color: 'white',
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                +
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={() => handleCopy(code.code, idx)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: '#3b82f6',
                border: 'none',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                zIndex: 2,
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
            >
              {copiedIndex === idx ? '✓ Copied!' : '📋 Copy'}
            </button>

            {/* Code Container with Zoom */}
            <div
              ref={codeContainerRef}
              style={{
                overflowX: 'auto',
                overflowY: 'auto',
                maxHeight: '500px',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-x pan-y pinch-zoom'
              }}
            >
              <div style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                transition: 'transform 0.2s ease'
              }}>
                <SyntaxHighlighter
                  language={languageMap[selectedLanguage].extension}
                  style={tomorrow}
                  showLineNumbers
                  wrapLines
                  wrapLongLines={false}
                  customStyle={{
                    margin: 0,
                    fontSize: `${14 / zoomLevel}px`,
                    lineHeight: '1.5'
                  }}
                >
                  {code.code}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Add pinch-zoom instructions */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
        marginTop: '8px',
        padding: '4px'
      }}>
        💡 Pinch with two fingers to zoom • Use +/- buttons to adjust size
      </div>
    </div>
  );
};

export default ExampleCodesTab;