import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      duration,
      show: true
    };

    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, show: false } : notif
    ));

    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 300);
  }, []);

  const showSuccess = useCallback((message, duration) => addNotification(message, 'success', duration), [addNotification]);
  const showError = useCallback((message, duration) => addNotification(message, 'error', duration), [addNotification]);
  const showWarning = useCallback((message, duration) => addNotification(message, 'warning', duration), [addNotification]);
  const showInfo = useCallback((message, duration) => addNotification(message, 'info', duration), [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        {notifications.map(notification => (
          <Toast
            key={notification.id}
            show={notification.show}
            onClose={() => removeNotification(notification.id)}
            delay={notification.duration}
            autohide={notification.duration > 0}
            bg={notification.type === 'error' ? 'danger' : notification.type}
          >
            <Toast.Header>
              <strong className="me-auto">
                {notification.type === 'success' && 'Success'}
                {notification.type === 'error' && 'Error'}
                {notification.type === 'warning' && 'Warning'}
                {notification.type === 'info' && 'Info'}
              </strong>
            </Toast.Header>
            <Toast.Body className="text-white">
              {notification.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </NotificationContext.Provider>
  );
};