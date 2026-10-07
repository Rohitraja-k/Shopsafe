import React from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={18} className="text-emerald" />;
      case 'error':
        return <AlertTriangle size={18} className="text-crimson" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-amber" />;
      default:
        return <Info size={18} className="text-cyan" />;
    }
  };

  return (
    <div className={`toast-notification toast-${toast.type || 'info'}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">
        <span className="toast-title">{toast.title || 'Notification'}</span>
        {toast.message && <p className="toast-desc">{toast.message}</p>}
      </div>
      <button className="toast-close-btn" onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
}
