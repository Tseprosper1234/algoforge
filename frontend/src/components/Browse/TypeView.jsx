import React from 'react';

const TypeView = ({ category, types, onBack, onSelectType }) => {
  return (
    <>
      <div className="section-title">📂 {category.display_name}</div>
      <div className="list-card">
        <div className="list-item" onClick={onBack}>
          <span>← Back to Categories</span>
        </div>
        {types.map(type => (
          <div
            key={type.id}
            className="list-item"
            onClick={() => onSelectType(type)}
          >
            <span>📂 {type.name}</span>
            <span className="chevron">›</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default TypeView;