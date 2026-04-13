import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('category');
  const [formData, setFormData] = useState({ name: '', display_name: '', category_id: '', type_id: '' });
  
  useEffect(() => {
    loadAll();
  }, []);
  
  const loadAll = async () => {
    try {
      const [catRes, typeRes, subRes] = await Promise.all([
        api.get('/admin/categories'),
        api.get('/admin/types'),
        api.get('/admin/subtypes')
      ]);
      setCategories(catRes.data);
      setTypes(typeRes.data);
      setSubtypes(subRes.data);
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formType === 'category') {
        await api.post('/admin/categories', { name: formData.name, display_name: formData.display_name });
      } else if (formType === 'type') {
        await api.post('/admin/types', { category_id: formData.category_id, name: formData.name, order_index: 0 });
      } else if (formType === 'subtype') {
        await api.post('/admin/subtypes', { type_id: formData.type_id, name: formData.name });
      }
      setShowForm(false);
      setFormData({ name: '', display_name: '', category_id: '', type_id: '' });
      loadAll();
    } catch (error) {
      console.error('Failed to create', error);
      alert('Failed to create');
    }
  };
  
  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/${type}/${id}`);
      loadAll();
    } catch (error) {
      console.error('Failed to delete', error);
      alert('Failed to delete');
    }
  };
  
  if (loading) return <div className="loading">Loading...</div>;
  
  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => { setFormType('category'); setShowForm(true); }} style={{ padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ Add Category</button>
        <button onClick={() => { setFormType('type'); setShowForm(true); }} style={{ padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ Add Type</button>
        <button onClick={() => { setFormType('subtype'); setShowForm(true); }} style={{ padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ Add Subtype</button>
      </div>
      
      {showForm && (
        <div className="list-card" style={{ padding: '20px', marginBottom: '20px' }}>
          <h4>Add {formType}</h4>
          <form onSubmit={handleSubmit}>
            {formType === 'category' && (
              <>
                <input type="text" placeholder="Name (e.g., algorithm)" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <input type="text" placeholder="Display Name (e.g., Algorithm)" value={formData.display_name} onChange={(e) => setFormData({...formData, display_name: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </>
            )}
            {formType === 'type' && (
              <>
                <select value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.display_name}</option>)}
                </select>
                <input type="text" placeholder="Type Name (e.g., Sorting)" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </>
            )}
            {formType === 'subtype' && (
              <>
                <select value={formData.type_id} onChange={(e) => setFormData({...formData, type_id: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <option value="">Select Type</option>
                  {types.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                </select>
                <input type="text" placeholder="Subtype Name (e.g., Bubble Sort)" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ padding: '10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Create</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px', background: '#64748b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      <h4>Categories</h4>
      <div className="list-card" style={{ marginBottom: '20px' }}>
        {categories.map(cat => (
          <div key={cat.id} className="list-item">
            <span>{cat.display_name} ({cat.name})</span>
            <button onClick={() => handleDelete('categories', cat.id)} style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
          </div>
        ))}
      </div>
      
      <h4>Types</h4>
      <div className="list-card" style={{ marginBottom: '20px' }}>
        {types.map(type => {
          const category = categories.find(c => c.id === type.category_id);
          return (
            <div key={type.id} className="list-item">
              <span>{type.name} ({category?.display_name})</span>
              <button onClick={() => handleDelete('types', type.id)} style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
            </div>
          );
        })}
      </div>
      
      <h4>Subtypes</h4>
      <div className="list-card">
        {subtypes.map(sub => {
          const type = types.find(t => t.id === sub.type_id);
          return (
            <div key={sub.id} className="list-item">
              <span>{sub.name} ({type?.name})</span>
              <button onClick={() => handleDelete('subtypes', sub.id)} style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageCategories;