import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setActiveTab, currentUser, role } = useApp();

  const userNotifs = notifications.filter(
    (n) => n.userId === currentUser?.id || n.targetRole === role || n.userId === 'all'
  );

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Platform Notifications"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={markAllNotificationsRead}
            disabled={userNotifs.length === 0 || userNotifs.every((n) => n.read)}
          >
            <CheckCheck size={14} /> Mark all read
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      }
    >
      {userNotifs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
          <Bell size={36} color="var(--color-text-muted)" style={{ marginBottom: '0.8rem' }} />
          <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>No notifications yet</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', marginTop: '0.3rem' }}>
            Updates regarding questions, answers, and appointments will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {userNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.linkTab) {
                  setActiveTab(notif.linkTab);
                  onClose();
                }
              }}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: notif.read ? 'var(--color-card-bg)' : 'var(--color-soft-sage)',
                border: notif.read ? '1px solid var(--color-border)' : '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                gap: '0.85rem'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: notif.read ? 'var(--color-warm-ivory)' : 'var(--color-soft-sage)',
                  color: 'var(--color-deep-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Bell size={16} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                    {notif.title}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} /> {formatTime(notif.timestamp)}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', lineHeight: 1.4 }}>
                  {notif.message}
                </p>
                {notif.linkTab && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-deep-teal)', fontWeight: 600, marginTop: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    View details <ExternalLink size={11} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};
