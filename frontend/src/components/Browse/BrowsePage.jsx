import React, { useState, useEffect } from 'react';
import { getFilesHierarchy } from '../../services/fileService';
import CategoryView from './CategoryView';
import TypeView from './TypeView';
import SubtypeView from './SubtypeView';
import FileList from './FileList';

const BrowsePage = () => {
  const [hierarchy, setHierarchy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSubtype, setSelectedSubtype] = useState(null);

  useEffect(() => {
    loadHierarchy();
  }, []);

  const loadHierarchy = async () => {
    try {
      const data = await getFilesHierarchy();
      setHierarchy(data);
    } catch (error) {
      console.error('Failed to load hierarchy', error);
    } finally {
      setLoading(false);
    }
  };

  // Build data structures
  const categories = {};
  hierarchy.forEach(item => {
    if (!categories[item.category_id]) {
      categories[item.category_id] = {
        id: item.category_id,
        name: item.category_name,
        display_name: item.display_name,
        types: {}
      };
    }
    if (item.type_id && !categories[item.category_id].types[item.type_id]) {
      categories[item.category_id].types[item.type_id] = {
        id: item.type_id,
        name: item.type_name,
        subtypes: {}
      };
    }
    if (item.subtype_id && categories[item.category_id].types[item.type_id] && 
        !categories[item.category_id].types[item.type_id].subtypes[item.subtype_id]) {
      categories[item.category_id].types[item.type_id].subtypes[item.subtype_id] = {
        id: item.subtype_id,
        name: item.subtype_name,
        files: []
      };
    }
    if (item.file_id && categories[item.category_id].types[item.type_id] && 
        categories[item.category_id].types[item.type_id].subtypes[item.subtype_id]) {
      categories[item.category_id].types[item.type_id].subtypes[item.subtype_id].files.push({
        id: item.file_id,
        name: item.file_name
      });
    }
  });

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setSelectedType(null);
    setSelectedSubtype(null);
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
    setSelectedSubtype(null);
  };

  const handleSelectSubtype = (subtype) => {
    setSelectedSubtype(subtype);
  };

  const handleBack = () => {
    if (selectedSubtype) {
      setSelectedSubtype(null);
    } else if (selectedType) {
      setSelectedType(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  // Render appropriate view based on selection state
  if (!selectedCategory) {
    return (
      <CategoryView 
        categories={Object.values(categories)}
        onSelectCategory={handleSelectCategory}
      />
    );
  }

  if (selectedCategory && !selectedType) {
    const types = Object.values(selectedCategory.types);
    return (
      <TypeView 
        category={selectedCategory}
        types={types}
        onBack={handleBack}
        onSelectType={handleSelectType}
      />
    );
  }

  if (selectedCategory && selectedType && !selectedSubtype) {
    const subtypes = Object.values(selectedType.subtypes);
    return (
      <SubtypeView 
        type={selectedType}
        subtypes={subtypes}
        onBack={handleBack}
        onSelectSubtype={handleSelectSubtype}
      />
    );
  }

  if (selectedCategory && selectedType && selectedSubtype) {
    const files = selectedSubtype.files;
    return (
      <FileList 
        subtype={selectedSubtype}
        files={files}
        onBack={handleBack}
      />
    );
  }

  return null;
};

export default BrowsePage;