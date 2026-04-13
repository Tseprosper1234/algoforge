import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [quizProgress, setQuizProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadProfile();
    loadQuizProgress();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setProfile(response.data);
      setUsername(response.data.username);
    } catch (error) {
      console.error('Failed to load profile', error);
    }
  };

  const loadQuizProgress = async () => {
    try {
      const response = await api.get('/user/quiz-progress');
      setQuizProgress(response.data);
    } catch (error) {
      console.error('Failed to load quiz progress', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.put('/user/profile', { username });
      setEditing(false);
      loadProfile();
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, GIF, WEBP)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB');
      return;
    }
    
    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const response = await api.post('/user/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, avatar_url: response.data.avatarUrl }));
      alert('Avatar updated successfully!');
    } catch (error) {
      console.error('Failed to upload avatar', error);
      alert('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  // Helper function to get full avatar URL
  /*const getAvatarUrl = (avatarUrl) => {
    if (!avatarUrl) return null;
    // If it's already a full URL (Supabase), return as is
    if (avatarUrl.startsWith('http')) return avatarUrl;
    // Otherwise, assume it's a local path (for backward compatibility)
    return `http://localhost:5000${avatarUrl}`;
  };*/

  /*const getAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return null;
  // If it's already a full URL (Supabase), return as is
  if (avatarUrl.startsWith('http')) return avatarUrl;
  // For local development
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:5000${avatarUrl}`;
  }
  // For production
  return `${import.meta.env.VITE_API_URL?.replace('/api', '')}${avatarUrl}`;
};*/

const getAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return null;
  // If it's already a full URL (Supabase), return as is
  if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
    return avatarUrl;
  }
  // For local development (relative paths)
  return `http://localhost:5000${avatarUrl}`;
};

  if (loading) return <div className="loading">Loading...</div>;
  if (!profile) return <div className="loading">Profile not found</div>;

  return (
    <>
      <div className="breadcrumb">
        <span className="breadcrumb-item">👤 Profile</span>
      </div>
      
      <div className="profile-container">
        {/* Avatar section */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <div className="avatar" style={{ 
            backgroundImage: profile.avatar_url ? `url(${getAvatarUrl(profile.avatar_url)})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            {!profile.avatar_url && (profile.username?.charAt(0).toUpperCase() || 'U')}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleAvatarUpload}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '0.7rem',
              cursor: 'pointer'
            }}
          >
            {uploading ? 'Uploading...' : 'Change Photo'}
          </button>
        </div>
        
        {editing ? (
          <>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid var(--border)', width: '100%', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleUpdateProfile} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save</button>
              <button onClick={() => setEditing(false)} style={{ padding: '10px 20px', background: '#64748b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div className="profile-name">{profile.username}</div>
            <div className="profile-email">{profile.email}</div>
            <div className="profile-badge">🌟 DSA Enthusiast</div>
            <div style={{ marginTop: '16px' }}>
              <button onClick={() => setEditing(true)} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Edit Profile</button>
            </div>
          </>
        )}
        
        <div style={{ marginTop: '32px', width: '100%', textAlign: 'left' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>📊 Quiz Progress</h3>
          {quizProgress.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)' }}>No quizzes attempted yet.</div>
          ) : (
            quizProgress.map((progress, index) => (
              <div key={progress.id || progress.quiz_id || index} style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{progress.file_name}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Score: {progress.score}%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Completed: {new Date(progress.completed_at).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;