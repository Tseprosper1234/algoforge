import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import config from '../../config';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users', error);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = async (userId, currentBanStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentBanStatus ? 'unban' : 'ban'} this user?`)) return;
    setActionLoading(`ban-${userId}`);
    try {
      await api.put(`/admin/users/${userId}/ban`, { is_banned: !currentBanStatus });
      await loadUsers();
    } catch (error) {
      console.error('Failed to toggle ban', error);
      alert('Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleAdmin = async (userId, currentRole) => {
    const isCurrentlyAdmin = currentRole === 'admin';
    const newRole = isCurrentlyAdmin ? 'user' : 'admin';
    const action = isCurrentlyAdmin ? 'remove admin privileges from' : 'make an admin';
    
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    setActionLoading(`admin-${userId}`);
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      await loadUsers();
    } catch (error) {
      console.error('Failed to toggle admin', error);
      alert('Failed to update user role');
    } finally {
      setActionLoading(null);
    }
  };

  /*const getAvatarUrl = (avatarUrl, username) => {
    if (avatarUrl) {
      return `http://localhost:5000${avatarUrl}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username || 'User')}&background=3b82f6&color=fff&size=48&bold=true`;
  };*/

  const getAvatarUrl = (avatarUrl, username) => {
  if (avatarUrl) {
    if (avatarUrl.startsWith('http')) return avatarUrl;
    return `${config.baseUrl}${avatarUrl}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username || 'User')}&background=3b82f6&color=fff&size=48&bold=true`;
};

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div>
      <h3>User Management</h3>
      
      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontSize: '0.9rem',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)'
          }}
        />
      </div>

      {/* Users List */}
      <div className="list-card">
        {filteredUsers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No users found
          </div>
        ) : (
          filteredUsers.map(user => (
            <div key={user.id} className="list-item" style={{ 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              gap: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                {/* User Avatar */}
                <img 
                  src={getAvatarUrl(user.avatar_url, user.username)}
                  alt={user.username}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    backgroundColor: '#3b82f6'
                  }}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=3b82f6&color=fff&size=48&bold=true`;
                  }}
                />
                
                {/* User Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{user.username}</strong>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      padding: '2px 8px', 
                      borderRadius: '12px',
                      background: user.role === 'admin' ? '#8b5cf6' : '#3b82f6',
                      color: 'white'
                    }}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                    {user.is_banned && (
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '2px 8px', 
                        borderRadius: '12px',
                        background: '#ef4444',
                        color: 'white'
                      }}>
                        Banned
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {user.email}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'flex-end' }}>
                {/* Toggle Admin Button - Don't show for the current logged-in admin to prevent self-demotion? Optional */}
                <button
                  onClick={() => toggleAdmin(user.id, user.role)}
                  disabled={actionLoading === `admin-${user.id}`}
                  style={{
                    padding: '6px 16px',
                    background: user.role === 'admin' ? '#f59e0b' : '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    opacity: actionLoading === `admin-${user.id}` ? 0.6 : 1
                  }}
                >
                  {actionLoading === `admin-${user.id}` ? 'Updating...' : (user.role === 'admin' ? 'Remove Admin' : 'Make Admin')}
                </button>
                
                {/* Toggle Ban Button */}
                <button
                  onClick={() => toggleBan(user.id, user.is_banned)}
                  disabled={actionLoading === `ban-${user.id}`}
                  style={{
                    padding: '6px 16px',
                    background: user.is_banned ? '#22c55e' : '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    opacity: actionLoading === `ban-${user.id}` ? 0.6 : 1
                  }}
                >
                  {actionLoading === `ban-${user.id}` ? 'Updating...' : (user.is_banned ? 'Unban User' : 'Ban User')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Summary Stats */}
      <div style={{ 
        marginTop: '20px', 
        padding: '16px', 
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-around',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
            {users.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Users</div>
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Admins</div>
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
            {users.filter(u => u.is_banned).length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Banned</div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;