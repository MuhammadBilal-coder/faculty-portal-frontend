import { createContext, useContext, useMemo, useState } from 'react';
import { uid } from '../utils/format';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const pushToast = (toast) => {
    const id = uid('toast');
    setToasts((current) => [...current, { ...toast, id }]);

    setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, toast.duration ?? 4000);
  };

  const removeToast = (id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  };

  const value = useMemo(
    () => ({
      toasts,
      pushToast,
      removeToast,
    }),
    [toasts],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }

  return context;
}
