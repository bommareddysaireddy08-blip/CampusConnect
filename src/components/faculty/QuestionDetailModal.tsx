import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/Badge';
import { Question, QuestionStatus } from '../../types/index.ts';
import { 
  Send, 
  MessageSquare, 
  Sparkles, 
  BookOpen, 
  Paperclip,
  Clock,
  Calendar
} from 'lucide-react';

interface QuestionDetailModalProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  question,
  isOpen,
  onClose
}) => {
  const { replyToQuestion, markRepeatedDoubt, createFaq } = useApp();

  const [replyText, setReplyText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<QuestionStatus>(question?.status || 'Answered');
  const [suggestMeeting, setSuggestMeeting] = useState(false);
  const [meetingNote, setMeetingNote] = useState('Please book a 15-minute slot in my Wednesday office hours.');
  const [isExportingFaq, setIsExportingFaq] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState(question?.title || '');
  const [faqAnswer, setFaqAnswer] = useState('');

  if (!question) return null;

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    replyToQuestion(
      question.id,
      replyText.trim(),
      selectedStatus,
      suggestMeeting,
      suggestMeeting ? meetingNote : undefined
    );

    setReplyText('');
    onClose();
  };

  const handleExportToFaq = () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      alert('Please fill both the FAQ question and answer before publishing.');
      return;
    }

    createFaq({
      subject: question.subject,
      category: question.category,
      question: faqQuestion,
      answer: faqAnswer
    });

    markRepeatedDoubt(question.id, true);
    setIsExportingFaq(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Academic Doubt Review & Reply"
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              type="button"
              className={`btn btn-sm ${question.isRepeatedDoubt ? 'btn-amber' : 'btn-outline'}`}
              onClick={() => markRepeatedDoubt(question.id, !question.isRepeatedDoubt)}
              title="Tag as repeated query across sections"
            >
              <Sparkles size={14} />
              {question.isRepeatedDoubt ? 'Repeated Doubt ✓' : 'Mark as Repeated'}
            </button>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setFaqQuestion(question.title);
                setFaqAnswer(replyText || (question.replies[0]?.content ?? question.description));
                setIsExportingFaq(!isExportingFaq);
              }}
            >
              <BookOpen size={14} /> Publish to FAQ Bank
            </button>
          </div>

          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      }
    >
      <div>
        {/* Header Details */}
        <div style={{
          background: 'var(--color-soft-sage)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.2rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-deep-teal)', textTransform: 'uppercase' }}>
                {question.subject} • {question.category}
              </span>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', marginTop: '0.2rem' }}>
                {question.title}
              </h3>
            </div>
            <StatusBadge status={question.status} />
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
            <div>
              Student: <strong>{question.studentName}</strong> (Roll: {question.studentRoll})
            </div>
            <div>
              Submitted: <strong>{new Date(question.createdAt).toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Student Description & Attachments */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.88rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
            Student Classroom Context:
          </h4>
          <div style={{
            background: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.1rem 1.25rem',
            fontSize: '0.92rem',
            lineHeight: 1.6
          }}>
            {question.description}

            {question.attachments && question.attachments.length > 0 && (
              <div style={{ marginTop: '0.85rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.65rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                  Student Attached Files:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.35rem' }}>
                  {question.attachments.map((att) => (
                    <span key={att.id} style={{ fontSize: '0.78rem', background: 'var(--color-soft-sage)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', color: 'var(--color-deep-teal)' }}>
                      <Paperclip size={12} style={{ display: 'inline', marginRight: '3px' }} />
                      {att.name} ({att.size})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Export to FAQ form if opened */}
        {isExportingFaq && (
          <div style={{
            background: 'var(--color-warm-amber-light)',
            border: '1px solid rgba(213, 164, 91, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ fontSize: '0.95rem', color: '#885c18', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={16} /> Publish as Official Subject FAQ
            </h4>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Question Headline</label>
              <input
                type="text"
                className="form-input"
                value={faqQuestion}
                onChange={(e) => setFaqQuestion(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Curated Answer</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={faqAnswer}
                onChange={(e) => setFaqAnswer(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="btn btn-outline btn-sm" onClick={() => setIsExportingFaq(false)}>
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleExportToFaq}>
                Publish FAQ
              </button>
            </div>
          </div>
        )}

        {/* Conversation History */}
        {question.replies.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.92rem', color: 'var(--color-text-main)', marginBottom: '0.6rem' }}>
              Discussion Thread ({question.replies.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {question.replies.map((reply) => (
                <div
                  key={reply.id}
                  style={{
                    background: reply.authorRole === 'faculty' ? 'var(--color-card-bg)' : 'var(--color-soft-sage)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    fontSize: '0.88rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontWeight: 600, color: 'var(--color-deep-teal)' }}>
                    <span>{reply.authorName} ({reply.authorRole === 'faculty' ? 'Faculty Professor' : 'Student Follow-up'})</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', fontWeight: 400 }}>
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p>{reply.content}</p>
                  {reply.suggestOfficeMeeting && (
                    <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--color-warm-amber)', fontWeight: 600 }}>
                      Office Meeting Recommended: {reply.meetingNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Write Faculty Reply */}
        <form onSubmit={handleSubmitReply}>
          <div className="form-group">
            <label className="form-label required">Write Pedagogical Guidance / Answer</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Provide a clear, pedagogical answer, references to textbook chapters, or clarification..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Set Question Status</label>
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as QuestionStatus)}
              >
                <option value="Answered">Answered</option>
                <option value="Resolved">Resolved</option>
                <option value="Sent to Faculty">Keep in Queue</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                <input
                  type="checkbox"
                  checked={suggestMeeting}
                  onChange={(e) => setSuggestMeeting(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                Recommend In-Person Office Hours Visit
              </label>
            </div>
          </div>

          {suggestMeeting && (
            <div className="form-group">
              <label className="form-label">Office Hours Instructions for Student</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Please bring your lab workbook to Block 3 Cabin 402 on Wednesday at 2 PM."
                value={meetingNote}
                onChange={(e) => setMeetingNote(e.target.value)}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!replyText.trim()}
            >
              <Send size={15} /> Submit Response to Student
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
