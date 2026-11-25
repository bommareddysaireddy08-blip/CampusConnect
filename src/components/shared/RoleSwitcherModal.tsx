import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Role } from '../../types/index.ts';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Check, 
  RotateCcw, 
  Sparkles,
  School,
  LogIn
} from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenAuthModal 
}) => {
  const { currentUser, users, switchDemoUser, resetDemoData } = useApp();

  const handleSelectUser = (userId: string) => {
    switchDemoUser(userId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Switch Demo Role & Persona"
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <button
            className="btn btn-outline btn-sm"
            style={{ color: 'var(--color-error)' }}
            onClick={() => {
              if (window.confirm('Reset all accounts, questions, and appointments to initial demo data?')) {
                resetDemoData();
                onClose();
              }
            }}
          >
            <RotateCcw size={14} /> Reset Demo Data
          </button>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                onClose();
                onOpenAuthModal();
              }}
            >
              <LogIn size={14} /> Sign In / Register
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      }
    >
      <div style={{ marginBottom: '1.25rem' }}>
        <div className="info-panel" style={{ marginBottom: 0 }}>
          <Sparkles className="info-panel-icon" size={20} />
          <div className="info-panel-content">
            <div className="info-panel-title">Active Persona & Multi-Account Switching</div>
            <div className="info-panel-text">
              Select any registered student, course professor, or class representative account to test distinct access privileges 
              and cross-dashboard communication in real time.
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {users.map((u) => {
          const isSelected = currentUser?.id === u.id;
          const roleLabel = u.role === 'student' ? 'Student' : u.role === 'faculty' ? 'Faculty Professor' : 'Class Representative';
          const Icon = u.role === 'student' ? GraduationCap : u.role === 'faculty' ? BookOpen : Users;

          return (
            <div
              key={u.id}
              onClick={() => handleSelectUser(u.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1.1rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: isSelected ? '2px solid var(--color-deep-teal)' : '1px solid var(--color-border)',
                background: isSelected ? 'var(--color-soft-sage)' : 'var(--color-card-bg)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--color-deep-teal)' : 'var(--color-soft-sage)',
                  color: isSelected ? '#ffffff' : 'var(--color-deep-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem',
                  flexShrink: 0
                }}
              >
                <Icon size={24} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                    {u.name}
                  </h4>
                  <span style={{ fontSize: '0.74rem', background: 'var(--color-soft-sage)', color: 'var(--color-deep-teal)', padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>
                    {roleLabel}
                  </span>
                  {isSelected && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        background: 'var(--color-deep-teal)',
                        color: '#ffffff',
                        padding: '0.1rem 0.5rem',
                        borderRadius: 'var(--radius-pill)',
                        fontWeight: 600
                      }}
                    >
                      Active Session
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                  {u.department} • {u.identifier} • {u.email}
                </div>
              </div>

              <div style={{ marginLeft: '1rem' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: isSelected ? 'none' : '2px solid var(--color-border)',
                    background: isSelected ? 'var(--color-deep-teal)' : 'transparent',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isSelected && <Check size={14} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
