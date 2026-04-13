import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageFiles = () => {
  const [files, setFiles] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  const [exampleCodes, setExampleCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [formData, setFormData] = useState({
    subtype_id: '',
    name: '',
    notes: '',
    demo_code: ''
  });
  const [codeForm, setCodeForm] = useState({ file_id: '', language: 'python', code: '' });
  
  useEffect(() => {
    loadAll();
  }, []);
  
  const loadAll = async () => {
    try {
      const [filesRes, subtypesRes, codesRes] = await Promise.all([
        api.get('/admin/files'),
        api.get('/admin/subtypes'),
        api.get('/admin/example-codes')
      ]);
      setFiles(filesRes.data);
      setSubtypes(subtypesRes.data);
      setExampleCodes(codesRes.data);
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFile) {
        await api.put(`/admin/files/${editingFile.id}`, formData);
      } else {
        await api.post('/admin/files', formData);
      }
      setShowForm(false);
      setEditingFile(null);
      setFormData({ subtype_id: '', name: '', notes: '', demo_code: '' });
      loadAll();
    } catch (error) {
      console.error('Failed to save file', error);
      alert('Failed to save file');
    }
  };
  
  const handleDeleteFile = async (id) => {
    if (!window.confirm('Delete this file? All associated codes and quizzes will be deleted.')) return;
    try {
      await api.delete(`/admin/files/${id}`);
      loadAll();
    } catch (error) {
      console.error('Failed to delete file', error);
      alert('Failed to delete file');
    }
  };
  
  const handleAddCode = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/example-codes', codeForm);
      setCodeForm({ file_id: '', language: 'python', code: '' });
      loadAll();
    } catch (error) {
      console.error('Failed to add code', error);
      alert('Failed to add code');
    }
  };
  
  const handleDeleteCode = async (id) => {
    try {
      await api.delete(`/admin/example-codes/${id}`);
      loadAll();
    } catch (error) {
      console.error('Failed to delete code', error);
      alert('Failed to delete code');
    }
  };
  
  if (loading) return <div className="loading">Loading...</div>;
  
  return (
    <div>
      <button onClick={() => { setEditingFile(null); setFormData({ subtype_id: '', name: '', notes: '', demo_code: '' }); setShowForm(!showForm); }} style={{ padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px' }}>
        {showForm ? 'Cancel' : '+ Add New File'}
      </button>
      
      {showForm && (
        <div className="list-card" style={{ padding: '20px', marginBottom: '20px' }}>
          <h4>{editingFile ? 'Edit File' : 'Create File'}</h4>
          <form onSubmit={handleSubmit}>
            <select value={formData.subtype_id} onChange={(e) => setFormData({...formData, subtype_id: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <option value="">Select Subtype</option>
              {subtypes.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
            </select>
            <input type="text" placeholder="File Name (e.g., bubble_sort.py)" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
            <textarea placeholder="Notes (Markdown supported)" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows="6" style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
            <textarea placeholder="Demo Code (HTML/CSS/JS)" value={formData.demo_code} onChange={(e) => setFormData({...formData, demo_code: e.target.value})} rows="8" style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontFamily: 'monospace' }} />
            <button type="submit" style={{ padding: '10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{editingFile ? 'Update' : 'Create'}</button>
          </form>
        </div>
      )}
      
      <h4>Files</h4>
      <div className="list-card" style={{ marginBottom: '20px' }}>
        {files.map(file => (
          <div key={file.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <div><strong>{file.name}</strong></div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setEditingFile(file); setFormData({ subtype_id: file.subtype_id, name: file.name, notes: file.notes || '', demo_code: file.demo_code || '' }); setShowForm(true); }} style={{ padding: '4px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
              <button onClick={() => handleDeleteFile(file.id)} style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      
      <h4>Add Example Code</h4>
      <div className="list-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <form onSubmit={handleAddCode}>
          <select value={codeForm.file_id} onChange={(e) => setCodeForm({...codeForm, file_id: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <option value="">Select File</option>
            {files.map(file => <option key={file.id} value={file.id}>{file.name}</option>)}
          </select>
          <select value={codeForm.language} onChange={(e) => setCodeForm({...codeForm, language: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
          <textarea placeholder="Code" value={codeForm.code} onChange={(e) => setCodeForm({...codeForm, code: e.target.value})} required rows="8" style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontFamily: 'monospace' }} />
          <button type="submit" style={{ padding: '10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Add Code</button>
        </form>
      </div>
      
      <h4>Existing Example Codes</h4>
      <div className="list-card">
        {exampleCodes.map(code => {
          const file = files.find(f => f.id === code.file_id);
          return (
            <div key={code.id} className="list-item">
              <span>{file?.name} - {code.language}</span>
              <button onClick={() => handleDeleteCode(code.id)} style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageFiles;