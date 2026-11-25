import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map((toast) => {
        const icon = {
          success: <CheckCircle2 size={18} color="var(--color-success)" />,
          error: <AlertCircle size={18} color="var(--color-error)" />,
          warning: <AlertTriangle size={18} color="var(--color-warning)" />,
          info: <Info size={18} color="var(--color-secondary-purple)" />
        }[toast.type];

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
            <div className="toast-message">{toast.message}</div>
            <button
              onClick={() => dismissToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Close"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
