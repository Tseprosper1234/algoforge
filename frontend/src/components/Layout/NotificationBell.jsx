import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_content': return '📚';
      case 'mention': return '💬';
      default: return '🔔';
    }
  };

  // Safely check if notifications is an array
  const notificationsArray = Array.isArray(notifications) ? notifications : [];
  const hasUnread = unreadCount > 0;

  return (
    <div style={{ position: 'relative',  left: '0',}} ref={dropdownRef}>
      <button className="header-icon" onClick={handleBellClick} style={{ position: 'relative' }}>
        🔔
        {hasUnread && <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '45px',
          right: '-100px',
          width: '320px',
          maxHeight: '400px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
          }}>
            <strong style={{ fontSize: '0.9rem' }}>Notifications</strong>
            {hasUnread && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div style={{ overflowY: 'auto', maxHeight: '350px' }}>
            {notificationsArray.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                No notifications
              </div>
            ) : (
              notificationsArray.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => !notif.is_read && markAsRead(notif.id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f0f2f5',
                    backgroundColor: notif.is_read ? 'white' : '#eff6ff',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.2rem' }}>{getNotificationIcon(notif.type)}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>
                        {notif.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '4px' }}>
                        {notif.message}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {new Date(notif.created_at).toLocaleString()}
                      </div>
                    </div>
                    {!notif.is_read && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        alignSelf: 'center'
                      }} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;