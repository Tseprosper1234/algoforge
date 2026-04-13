import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ManageUsers from './ManageUsers';
import ManageCategories from './ManageCategories';
import ManageFiles from './ManageFiles';
import ManageQuizzes from './ManageQuizzes';
import Statistics from './Statistics';
import Moderation from './Moderation';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', maxHeight: '100vh', overflowY: 'auto'}}>
      <div className="breadcrumb">
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}>←</button>
        <span className="breadcrumb-item">Admin Dashboard</span>
      </div>
      
      <div className="tabs-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>
          <Link to="/admin/users" style={{ textDecoration: 'none' }}>
            <div className="list-item">👥 Manage Users</div>
          </Link>
          <Link to="/admin/categories" style={{ textDecoration: 'none' }}>
            <div className="list-item">📁 Manage Categories/Types/Subtypes</div>
          </Link>
          <Link to="/admin/files" style={{ textDecoration: 'none' }}>
            <div className="list-item">📄 Manage Files & Example Codes</div>
          </Link>
          <Link to="/admin/quizzes" style={{ textDecoration: 'none' }}>
            <div className="list-item">📝 Manage Quizzes</div>
          </Link>
          <Link to="/admin/moderation" style={{ textDecoration: 'none' }}>
            <div className="list-item">💬 Chat Moderation</div>
          </Link>
          <Link to="/admin/statistics" style={{ textDecoration: 'none' }}>
            <div className="list-item">📊 Statistics</div>
          </Link>
        </div>
      </div>
      
      <Routes>
        <Route path="users" element={<ManageUsers />} />
        <Route path="categories" element={<ManageCategories />} />
        <Route path="files" element={<ManageFiles />} />
        <Route path="quizzes" element={<ManageQuizzes />} />
        <Route path="moderation" element={<Moderation />} />
        <Route path="statistics" element={<Statistics />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;