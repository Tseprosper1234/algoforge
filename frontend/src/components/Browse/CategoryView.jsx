import React from 'react';

const CategoryView = ({ categories, onSelectCategory }) => {
  return (
    <>
      <div className="section-title">📚 Explore Topics</div>
      <div className="list-card">
        {categories.map(category => (
          <div
            key={category.id}
            className="list-item"
            onClick={() => onSelectCategory(category)}
          >
            <span>📁 {category.display_name}</span>
            <span className="chevron">›</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryView;