import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageExampleCodes = () => {
  const [files, setFiles] = useState([]);
  const [exampleCodes, setExampleCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({
    file_id: '',
    language: 'python',
    code: '',
    order_index: 0
  });

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'cpp', label: 'C++' },
    { value: 'java', label: 'Java' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [filesRes, codesRes] = await Promise.all([
        api.get('/admin/files'),
        api.get('/admin/example-codes')
      ]);
      setFiles(filesRes.data);
      setExampleCodes(codesRes.data);
    } catch (error) {
      console.error('Failed to load data', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file_id || !formData.code) {
      alert('Please select a file and enter code');
      return;
    }

    try {
      if (editingCode) {
        await api.put(`/admin/example-codes/${editingCode.id}`, {
          code: formData.code,
          order_index: formData.order_index
        });
      } else {
        await api.post('/admin/example-codes', formData);
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error('Failed to save example code', error);
      alert('Failed to save example code');
    }
  };

  const handleEdit = (code) => {
    setEditingCode(code);
    setFormData({
      file_id: code.file_id,
      language: code.language,
      code: code.code,
      order_index: code.order_index || 0
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this example code?')) return;
    try {
      await api.delete(`/admin/example-codes/${id}`);
      loadData();
    } catch (error) {
      console.error('Failed to delete example code', error);
      alert('Failed to delete example code');
    }
  };

  const resetForm = () => {
    setEditingCode(null);
    setFormData({
      file_id: '',
      language: 'python',
      code: '',
      order_index: 0
    });
  };

  const getFileNames = () => {
    const fileMap = {};
    files.forEach(file => {
      fileMap[file.id] = file.name;
    });
    return fileMap;
  };

  const fileNames = getFileNames();

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h3>Manage Example Codes</h3>
      
      {/* Form */}
      <div className="list-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h4>{editingCode ? 'Edit Example Code' : 'Add New Example Code'}</h4>
        <form onSubmit={handleSubmit}>
          <select
            value={formData.file_id}
            onChange={(e) => setFormData({...formData, file_id: e.target.value})}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
            disabled={editingCode !== null}
          >
            <option value="">Select File</option>
            {files.map(file => (
              <option key={file.id} value={file.id}>{file.name}</option>
            ))}
          </select>

          <select
            value={formData.language}
            onChange={(e) => setFormData({...formData, language: e.target.value})}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>

          <textarea
            placeholder="Code (with proper indentation)"
            value={formData.code}
            onChange={(e) => setFormData({...formData, code: e.target.value})}
            required
            rows="10"
            style={{ 
              width: '100%', 
              padding: '10px', 
              marginBottom: '10px', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '13px'
            }}
          />

          <input
            type="number"
            placeholder="Order Index (0 = first)"
            value={formData.order_index}
            onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ padding: '10px 20px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              {editingCode ? 'Update' : 'Add'}
            </button>
            {editingCode && (
              <button type="button" onClick={resetForm} style={{ padding: '10px 20px', background: '#64748b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List of existing codes */}
      <h4>Existing Example Codes</h4>
      <div className="list-card">
        {exampleCodes.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No example codes added yet.
          </div>
        ) : (
          exampleCodes.map(code => (
            <div key={code.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
              <div>
                <strong>{fileNames[code.file_id] || 'Unknown File'}</strong> - {languages.find(l => l.value === code.language)?.label}
              </div>
              <div style={{ 
                fontSize: '0.85rem', 
                color: '#475569',
                maxHeight: '100px',
                overflow: 'auto',
                background: '#f8fafc',
                padding: '8px',
                borderRadius: '6px',
                width: '100%'
              }}>
                <pre style={{ margin: 0, fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>{code.code.substring(0, 200)}{code.code.length > 200 ? '...' : ''}</pre>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEdit(code)} style={{ padding: '4px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(code.id)} style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageExampleCodes;