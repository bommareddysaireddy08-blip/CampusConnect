import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEPARTMENTS_LIST, YEARS_OF_STUDY } from '../../services/storage.ts';
import { 
  User, 
  Mail, 
  Building, 
  CreditCard, 
  RotateCcw, 
  ShieldCheck, 
  Lock, 
  Moon, 
  Sun, 
  LogOut, 
  Edit3, 
  Check, 
  Camera,
  Calendar
} from 'lucide-react';

interface ProfileViewProps {
  onOpenRoleSwitcher: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenRoleSwitcher }) => {
  const { 
    currentUser, 
    role, 
    updateUserProfile, 
    changePassword, 
    logoutUser, 
    resetDemoData, 
    themeMode, 
    toggleThemeMode 
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [department, setDepartment] = useState(currentUser?.department || DEPARTMENTS_LIST[0]);
  const [yearOfStudy, setYearOfStudy] = useState(currentUser?.yearOfStudy || YEARS_OF_STUDY[2]);
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  // Password change state
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = updateUserProfile({
      name,
      department,
      yearOfStudy,
      avatar
    });
    if (ok) setIsEditing(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    if (!oldPass || !newPass) {
      setPassError('Please enter both old and new passwords.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match.');
      return;
    }
    const res = changePassword(oldPass, newPass);
    if (res.success) {
      setIsChangingPass(false);
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setPassError(res.message);
    }
  };

  return (
    <div>
      {/* Profile Header Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: 'var(--radius-lg)',
                  objectFit: 'cover',
                  border: '3px solid var(--color-warm-amber)',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
              {isEditing && (
                <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'var(--color-deep-teal)', color: '#ffffff', borderRadius: '50%', padding: '4px' }}>
                  <Camera size={13} />
                </div>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text-main)' }}>
                  {currentUser?.name}
                </h3>
                <span className="badge" style={{ background: 'var(--color-soft-sage)', color: 'var(--color-deep-teal)', fontSize: '0.8rem' }}>
                  {role === 'student' ? 'Student' : role === 'faculty' ? 'Faculty Professor' : 'Class Representative'}
                </span>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                {currentUser?.department} • Roll/ID: {currentUser?.identifier}
              </p>
              {currentUser?.yearOfStudy && (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-teal)', fontWeight: 600, marginTop: '0.2rem' }}>
                  {currentUser.yearOfStudy}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 size={14} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={toggleThemeMode}
              title="Toggle Dark / Light Mode"
            >
              {themeMode === 'dark' ? <Sun size={14} /> : <Moon size={14} />} {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={logoutUser}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Profile Edit Form if open */}
      {isEditing && (
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', border: '1.5px solid var(--color-deep-teal)' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--color-deep-teal)' }}>
            Edit Profile Information
          </h4>
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label required">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Profile Photo URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label required">Department</label>
                <select
                  className="form-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {DEPARTMENTS_LIST.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {role === 'student' && (
                <div className="form-group">
                  <label className="form-label required">Year of Study</label>
                  <select
                    className="form-select"
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                  >
                    {YEARS_OF_STUDY.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                <Check size={14} /> Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Two Column Layout: Parameters & Security */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem', marginBottom: '2rem' }}>
        {/* Account Details */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Institutional Account Details</h4>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} /> Campus Email:
                </span>
                <strong style={{ color: 'var(--color-text-main)' }}>{currentUser?.email}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={16} /> Roll / ID:
                </span>
                <strong style={{ color: 'var(--color-text-main)' }}>{currentUser?.identifier}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building size={16} /> Department:
                </span>
                <strong style={{ color: 'var(--color-text-main)' }}>{currentUser?.department}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={16} /> Role Privilege:
                </span>
                <span className="badge badge-answered">{currentUser?.role.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Password */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Security & Credentials</h4>
          </div>
          <div className="card-body">
            {isChangingPass ? (
              <form onSubmit={handleChangePassword}>
                {passError && (
                  <div style={{ color: 'var(--color-error)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                    {passError}
                  </div>
                )}
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label required" style={{ fontSize: '0.8rem' }}>Current Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label required" style={{ fontSize: '0.8rem' }}>New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label required" style={{ fontSize: '0.8rem' }}>Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsChangingPass(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Update Password
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Manage your account password. For local demonstration, passwords are client-side hashed with salts.
                </p>
                <button className="btn btn-outline btn-sm" onClick={() => setIsChangingPass(true)} style={{ alignSelf: 'flex-start' }}>
                  <Lock size={14} /> Change Account Password
                </button>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--color-text-main)' }}>
                      Reset Demo Database
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                      Restores initial sample data
                    </div>
                  </div>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--color-error)', borderColor: 'rgba(185, 74, 74, 0.3)' }}
                    onClick={() => {
                      if (window.confirm('Reset all accounts, questions, and appointments to initial demo state?')) {
                        resetDemoData();
                      }
                    }}
                  >
                    <RotateCcw size={13} /> Reset Demo Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
