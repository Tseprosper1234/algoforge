import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = async () => {
    try {
      const response = await api.get('/admin/statistics');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load statistics', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div className="loading">Loading...</div>;
  if (!stats) return <div>Failed to load statistics</div>;
  
  return (
    <div>
      <h3>System Statistics</h3>
      <div className="list-card" style={{ marginTop: '20px' }}>
        <div className="list-item">
          <span>👥 Total Users</span>
          <span style={{ fontWeight: 'bold' }}>{stats.totalUsers}</span>
        </div>
        <div className="list-item">
          <span>🚫 Banned Users</span>
          <span style={{ fontWeight: 'bold' }}>{stats.bannedUsers}</span>
        </div>
        <div className="list-item">
          <span>📄 Total Files</span>
          <span style={{ fontWeight: 'bold' }}>{stats.totalFiles}</span>
        </div>
        <div className="list-item">
          <span>📝 Quiz Attempts</span>
          <span style={{ fontWeight: 'bold' }}>{stats.totalQuizAttempts}</span>
        </div>
        <div className="list-item">
          <span>📊 Average Quiz Score</span>
          <span style={{ fontWeight: 'bold' }}>{stats.averageQuizScore.toFixed(1)}%</span>
        </div>
        <div className="list-item">
          <span>💬 Messages (Last 7 days)</span>
          <span style={{ fontWeight: 'bold' }}>{stats.messagesLast7Days}</span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;