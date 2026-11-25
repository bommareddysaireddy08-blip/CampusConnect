import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { SUBJECTS_LIST, FACULTY_DIRECTORY } from '../../services/storage.ts';
import { QuestionCategory, Attachment } from '../../types/index.ts';
import { Send, AlertCircle, Sparkles, Paperclip, X, Image as ImageIcon, FileText } from 'lucide-react';

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskQuestionModal: React.FC<AskQuestionModalProps> = ({ isOpen, onClose }) => {
  const { submitQuestion, setActiveTab, questions, currentUser } = useApp();

  const [subject, setSubject] = useState<string>(SUBJECTS_LIST[0]);
  const [facultyId, setFacultyId] = useState<string>(FACULTY_DIRECTORY[0].id);
  const [category, setCategory] = useState<QuestionCategory>('Concept Clarification');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [priority, setPriority] = useState<'Normal' | 'Medium' | 'High'>('Normal');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-filter faculty when subject changes
  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    const matchedFac = FACULTY_DIRECTORY.find((f) => f.subjects.includes(newSubject));
    if (matchedFac) {
      setFacultyId(matchedFac.id);
    }
  };

  // Similar existing questions detection while typing
  const similarQuestions = title.trim().length > 4
    ? questions.filter((q) =>
        q.title.toLowerCase().includes(title.toLowerCase().trim()) ||
        title.toLowerCase().includes(q.title.toLowerCase().trim())
      ).slice(0, 2)
    : [];

  const handleSimulateAttachment = () => {
    const sampleFiles: Attachment[] = [
      { id: `att-${Date.now()}-1`, name: 'lecture_14_whiteboard_notes.png', size: '1.2 MB', type: 'image', url: '#' },
      { id: `att-${Date.now()}-2`, name: 'algorithm_trace_error.txt', size: '14 KB', type: 'text', url: '#' },
      { id: `att-${Date.now()}-3`, name: 'schema_normalization_diagram.pdf', size: '320 KB', type: 'pdf', url: '#' }
    ];
    const pick = sampleFiles[attachments.length % sampleFiles.length];
    setAttachments((prev) => [...prev, pick]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Question title is required.';
    } else if (title.trim().length < 8) {
      newErrors.title = 'Title must be at least 8 characters long.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please describe what was taught in class or where you got stuck.';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Description should be at least 15 characters.';
    }

    if (!subject) newErrors.subject = 'Subject selection is required.';
    if (!facultyId) newErrors.faculty = 'Faculty selection is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const faculty = FACULTY_DIRECTORY.find((f) => f.id === facultyId) || FACULTY_DIRECTORY[0];

    const result = submitQuestion({
      facultyId: faculty.id,
      facultyName: faculty.name,
      subject,
      title,
      description,
      category,
      attachments,
      priority,
      sendDirectlyToFaculty: true
    });

    if (result.success) {
      setTitle('');
      setDescription('');
      setAttachments([]);
      setErrors({});
      onClose();
      setActiveTab('my-questions');
    }
  };

  const categories: QuestionCategory[] = [
    'Concept Clarification',
    'Assignment / Lab',
    'Exam Preparation',
    'Project Guidance',
    'General Academic'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ask an Academic Doubt"
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
            Author: <strong>{currentUser?.name || 'Student'}</strong> ({currentUser?.identifier})
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit}>
              <Send size={14} /> Submit Doubt
            </button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Similar Questions Detection Callout */}
        {similarQuestions.length > 0 && (
          <div className="info-panel" style={{ background: 'var(--color-warm-amber-light)', borderColor: 'rgba(213, 164, 91, 0.4)', marginBottom: '1.25rem' }}>
            <Sparkles size={18} color="var(--color-warm-amber)" />
            <div className="info-panel-content">
              <div className="info-panel-title" style={{ color: '#8c5e18' }}>
                Similar Questions Found in Knowledge Base:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.35rem' }}>
                {similarQuestions.map((sq) => (
                  <div key={sq.id} style={{ fontSize: '0.82rem', color: 'var(--color-text-main)' }}>
                    • <strong>{sq.title}</strong> ({sq.status})
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label required">Course Subject</label>
            <select
              className="form-select"
              value={subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
            >
              {SUBJECTS_LIST.map((subj) => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required">Assign to Professor</label>
            <select
              className="form-select"
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
            >
              {FACULTY_DIRECTORY.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name} ({fac.department})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label required">Category of Doubt</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-pill)',
                  border: category === cat ? '1px solid var(--color-deep-teal)' : '1px solid var(--color-border)',
                  background: category === cat ? 'var(--color-deep-teal)' : 'var(--color-card-bg)',
                  color: category === cat ? '#ffffff' : 'var(--color-text-main)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label required">Question Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Why does Belady's anomaly occur only in FIFO and not in LRU?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <div className="form-error"><AlertCircle size={13} /> {errors.title}</div>}
        </div>

        <div className="form-group">
          <label className="form-label required">Detailed Explanation & Classroom Context</label>
          <textarea
            className="form-textarea"
            rows={4}
            placeholder="Describe what was taught in class, where you felt stuck, formulas involved, or code snippet references..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <div className="form-error"><AlertCircle size={13} /> {errors.description}</div>}
        </div>

        {/* Attachments Section */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Attachments (Notes / Screenshots / Code Trace)</label>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem' }}
              onClick={handleSimulateAttachment}
            >
              <Paperclip size={13} /> Add Attachment
            </button>
          </div>

          {attachments.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
              {attachments.map((att) => (
                <div
                  key={att.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-soft-sage)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-main)'
                  }}
                >
                  <FileText size={14} color="var(--color-deep-teal)" />
                  <span>{att.name}</span>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.72rem' }}>({att.size})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(att.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: 0 }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
              No files attached yet. You can attach lecture notes, handwritten formulas, or console traces.
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};
