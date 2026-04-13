import React from 'react';
import { useNavigate } from 'react-router-dom';

const FileList = ({ subtype, files, onBack }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="section-title">📄 {subtype.name}</div>
      <div className="list-card">
        <div className="list-item" onClick={onBack}>
          <span>← Back to {subtype.name}</span>
        </div>
        {files.map(file => (
          <div
            key={file.id}
            className="list-item file-item"
            onClick={() => navigate(`/files/${file.id}`)}
          >
            <span>📄 {file.name}</span>
            <span className="chevron">⤴️</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default FileList;