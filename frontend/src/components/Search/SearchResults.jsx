import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { search } from '../../services/searchService';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState({ files: [], exampleCodes: [] });
  const [loading, setLoading] = useState(true);
  const query = new URLSearchParams(location.search).get('q');
  
  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);
  
  const performSearch = async () => {
    setLoading(true);
    try {
      const data = await search(query);
      setResults(data);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div className="loading">Searching...</div>;
  
  return (
    <>
      <div className="breadcrumb">
        <span className="breadcrumb-item">🔍 Search Results for "{query}"</span>
      </div>
      
      {results.files.length === 0 && results.exampleCodes.length === 0 ? (
        <div className="empty-message" style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '24px' }}>
          No results found for "{query}"
        </div>
      ) : (
        <>
          {results.files.length > 0 && (
            <>
              <div className="section-title">📁 Files</div>
              <div className="list-card">
                {results.files.map(file => (
                  <div key={file.id} className="list-item" onClick={() => navigate(`/files/${file.id}`)}>
                    <span>📄 {file.name}</span>
                    <span className="chevron">›</span>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {results.exampleCodes.length > 0 && (
            <>
              <div className="section-title" style={{ marginTop: '24px' }}>💻 Code Examples</div>
              <div className="list-card">
                {results.exampleCodes.map(code => (
                  <div key={code.id} className="list-item" onClick={() => navigate(`/files/${code.file_id}`)}>
                    <span>📄 {code.file_name} ({code.language})</span>
                    <span className="chevron">›</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default SearchResults;