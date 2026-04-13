import React from 'react';

const SubtypeView = ({ type, subtypes, onBack, onSelectSubtype }) => {
  return (
    <>
      <div className="section-title">📂 {type.name}</div>
      <div className="list-card">
        <div className="list-item" onClick={onBack}>
          <span>← Back to {type.name}</span>
        </div>
        {subtypes.map(subtype => (
          <div
            key={subtype.id}
            className="list-item"
            onClick={() => onSelectSubtype(subtype)}
          >
            <span>📂 {subtype.name}</span>
            <span className="chevron">›</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default SubtypeView;