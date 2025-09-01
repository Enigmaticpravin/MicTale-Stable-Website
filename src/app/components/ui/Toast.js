// components/ui/Toast.js
'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

// Toast Context
const ToastContext = createContext();

// Toast Provider Component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, removeAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// Custom Hook
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, removeAllToasts } = context;

  return {
    toast: addToast,
    success: (message, options = {}) => addToast({ ...options, type: 'success', message }),
    error: (message, options = {}) => addToast({ ...options, type: 'error', message }),
    warning: (message, options = {}) => addToast({ ...options, type: 'warning', message }),
    info: (message, options = {}) => addToast({ ...options, type: 'info', message }),
    dismiss: removeToast,
    dismissAll: removeAllToasts,
  };
}

// Toast Container Component
function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

// Individual Toast Component
function Toast({ toast, onRemove }) {
  const { id, type, message, title, action } = toast;

  const getToastStyles = () => {
    const baseStyles = "relative bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-0 animate-in slide-in-from-right-full duration-300";
    
    switch (type) {
      case 'success':
        return `${baseStyles} border-l-4 border-l-green-500`;
      case 'error':
        return `${baseStyles} border-l-4 border-l-red-500`;
      case 'warning':
        return `${baseStyles} border-l-4 border-l-yellow-500`;
      case 'info':
        return `${baseStyles} border-l-4 border-l-blue-500`;
      default:
        return `${baseStyles} border-l-4 border-l-gray-400`;
    }
  };

  const getIcon = () => {
    const iconProps = { size: 20, className: "flex-shrink-0 mt-0.5" };
    
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-600`} />;
      case 'error':
        return <XCircle {...iconProps} className={`${iconProps.className} text-red-600`} />;
      case 'warning':
        return <AlertCircle {...iconProps} className={`${iconProps.className} text-yellow-600`} />;
      case 'info':
        return <Info {...iconProps} className={`${iconProps.className} text-blue-600`} />;
      default:
        return <Info {...iconProps} className={`${iconProps.className} text-gray-600`} />;
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            {title}
          </h4>
        )}
        <p className="text-sm text-gray-700 leading-relaxed">
          {message}
        </p>
        {action && (
          <div className="mt-3">
            {action}
          </div>
        )}
      </div>

      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-150 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

const toastStyles = `
@keyframes slide-in-from-right-full {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-in {
  animation-fill-mode: both;
}

.slide-in-from-right-full {
  animation-name: slide-in-from-right-full;
}

.duration-300 {
  animation-duration: 300ms;
}
`;

export { toastStyles };