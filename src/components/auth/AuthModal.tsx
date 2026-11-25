import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { DEPARTMENTS_LIST, YEARS_OF_STUDY, DEFAULT_USERS } from '../../services/storage.ts';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  CreditCard, 
  Building, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { loginUser, registerStudent, resetPasswordRequest, users } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS_LIST[0]);
  const [yearOfStudy, setYearOfStudy] = useState(YEARS_OF_STUDY[2]); // 3rd Year default
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [infoMessage, setInfoMessage] = useState<string>('');

  const validateLogin = (): boolean => {
    const err: Record<string, string> = {};
    if (!email.trim()) err.email = 'Email address is required.';
    else if (!email.includes('@')) err.email = 'Please enter a valid college email.';
    if (!password) err.password = 'Password is required.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateRegister = (): boolean => {
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = 'Full name is required.';
    else if (name.trim().length < 3) err.name = 'Name must be at least 3 characters.';

    if (!email.trim()) err.email = 'Email address is required.';
    else if (!email.includes('@')) err.email = 'Please enter a valid email address.';

    if (!identifier.trim()) err.identifier = 'Student ID / Roll Number is required.';

    if (!password) err.password = 'Password is required.';
    else if (password.length < 6) err.password = 'Password must be at least 6 characters.';

    if (password !== confirmPassword) {
      err.confirmPassword = 'Passwords do not match.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    const res = loginUser(email, password);
    if (res.success) {
      setEmail('');
      setPassword('');
      setErrors({});
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;

    const res = registerStudent({
      name,
      email,
      identifier,
      department,
      yearOfStudy,
      password
    });

    if (res.success) {
      setName('');
      setEmail('');
      setIdentifier('');
      setPassword('');
      setConfirmPassword('');
      setErrors({});
      onClose();
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrors({ email: 'Please enter a valid registered email address.' });
      return;
    }
    const res = resetPasswordRequest(email);
    if (res.success) {
      setInfoMessage(res.message);
      setErrors({});
    } else {
      setErrors({ email: res.message });
    }
  };

  // Quick Demo credentials loader
  const fillDemoAccount = (role: 'student' | 'faculty' | 'class_rep') => {
    const target = DEFAULT_USERS.find(u => u.role === role) || DEFAULT_USERS[0];
    const defaultPasswords: Record<string, string> = {
      student: 'Student@123',
      faculty: 'Faculty@123',
      class_rep: 'ClassRep@123'
    };
    setEmail(target.email);
    setPassword(defaultPasswords[role] || 'Student@123');
    setMode('login');
    setErrors({});
    setInfoMessage(`Loaded demo credentials for ${target.name} (${role.toUpperCase()})`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'login'
          ? 'Sign In to CampusConnect'
          : mode === 'register'
          ? 'Create Student Account'
          : 'Reset Forgotten Password'
      }
      size="md"
    >
      <div>
        {/* Quick Demo Selector */}
        <div style={{
          background: 'var(--color-soft-sage)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-deep-teal)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Quick Demo Logins (Testing):
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Click to autofill</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.76rem', padding: '0.25rem 0.6rem' }}
              onClick={() => fillDemoAccount('student')}
            >
              🎓 Student: Aarav
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.76rem', padding: '0.25rem 0.6rem' }}
              onClick={() => fillDemoAccount('faculty')}
            >
              👩‍🏫 Faculty: Dr. Meenakshi
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.76rem', padding: '0.25rem 0.6rem' }}
              onClick={() => fillDemoAccount('class_rep')}
            >
              📊 Class Rep: Riya
            </button>
          </div>
        </div>

        {infoMessage && (
          <div className="info-panel" style={{ background: 'var(--color-success-bg)', borderColor: 'rgba(46, 125, 99, 0.3)', marginBottom: '1rem', padding: '0.75rem 1rem' }}>
            <CheckCircle2 size={16} color="var(--color-success)" />
            <div style={{ fontSize: '0.84rem', color: 'var(--color-success)', fontWeight: 600 }}>
              {infoMessage}
            </div>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label required">College Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. yourname@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && <div className="form-error"><AlertCircle size={13} /> {errors.email}</div>}
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label required" style={{ marginBottom: 0 }}>Password</label>
                <button
                  type="button"
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-secondary-teal)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => setMode('forgot')}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <div className="form-error"><AlertCircle size={13} /> {errors.password}</div>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', color: 'var(--color-text-main)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember this session
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1.25rem' }}>
              Sign In to Account <ArrowRight size={15} />
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Don't have an account yet?{' '}
              <button
                type="button"
                style={{ background: 'transparent', border: 'none', color: 'var(--color-deep-teal)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => {
                  setMode('register');
                  setErrors({});
                  setInfoMessage('');
                }}
              >
                Register as Student
              </button>
            </div>
          </form>
        )}

        {/* REGISTRATION FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label required">Student Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Rohan Varma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <div className="form-error"><AlertCircle size={13} /> {errors.name}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label required">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. rohan.v@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <div className="form-error"><AlertCircle size={13} /> {errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label required">Student ID / Roll No</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 21BCE1155"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
                {errors.identifier && <div className="form-error"><AlertCircle size={13} /> {errors.identifier}</div>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.85rem' }}>
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label required">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <div className="form-error"><AlertCircle size={13} /> {errors.password}</div>}
              </div>

              <div className="form-group">
                <label className="form-label required">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <div className="form-error"><AlertCircle size={13} /> {errors.confirmPassword}</div>}
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              <ShieldCheck size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
              Registration automatically creates a Student account. Faculty & CR accounts are protected by institutional credentials.
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1.25rem' }}>
              Complete Registration & Sign In
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Already have an account?{' '}
              <button
                type="button"
                style={{ background: 'transparent', border: 'none', color: 'var(--color-deep-teal)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => {
                  setMode('login');
                  setErrors({});
                  setInfoMessage('');
                }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword}>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Enter your registered college email. We will verify your account and provide a reset password code.
            </p>

            <div className="form-group">
              <label className="form-label required">Registered College Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. yourname@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div className="form-error"><AlertCircle size={13} /> {errors.email}</div>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1.25rem' }}>
              Send Temporary Password
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.85rem' }}>
              <button
                type="button"
                style={{ background: 'transparent', border: 'none', color: 'var(--color-deep-teal)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setMode('login')}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
