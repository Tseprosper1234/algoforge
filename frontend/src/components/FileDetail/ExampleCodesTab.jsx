import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ExampleCodesTab = ({ codes }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [copiedIndex, setCopiedIndex] = useState(null);

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
          <div key={code.id || idx} className="code-block" style={{ position: 'relative' }}>
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
                zIndex: 1,
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
            >
              {copiedIndex === idx ? '✓ Copied!' : '📋 Copy'}
            </button>
            <SyntaxHighlighter
              language={languageMap[selectedLanguage].extension}
              style={tomorrow}
              showLineNumbers
              wrapLines
            >
              {code.code}
            </SyntaxHighlighter>
          </div>
        ))
      )}
    </div>
  );
};

export default ExampleCodesTab;