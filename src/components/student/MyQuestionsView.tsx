import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { Modal } from '../common/Modal';
import { Question } from '../../types/index.ts';
import { 
  HelpCircle, 
  Search, 
  Plus, 
  MessageSquare, 
  Calendar, 
  User, 
  Clock, 
  Sparkles, 
  ChevronRight,
  Send,
  Bookmark,
  CheckCircle2,
  ThumbsUp,
  Paperclip,
  Share2
} from 'lucide-react';

interface MyQuestionsViewProps {
  onOpenAskModal: () => void;
}

export const MyQuestionsView: React.FC<MyQuestionsViewProps> = ({ onOpenAskModal }) => {
  const { 
    questions, 
    currentUser, 
    setActiveTab, 
    addFollowUpReply, 
    markQuestionResolved, 
    sendQuestionToFaculty, 
    rateAnswerHelpful, 
    toggleBookmark 
  } = useApp();

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [followUpText, setFollowUpText] = useState<string>('');

  // Strict privacy: Student only sees their own questions
  const studentQuestions = questions.filter((q) => q.studentId === currentUser?.id);

  const filteredQuestions = studentQuestions.filter((q) => {
    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.facultyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpText.trim() || !selectedQuestion) return;

    addFollowUpReply(selectedQuestion.id, followUpText.trim());
    setFollowUpText('');

    // Update locally in modal
    const updated = questions.find((q) => q.id === selectedQuestion.id);
    if (updated) setSelectedQuestion(updated);
  };

  return (
    <div>
      {/* Top Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        {/* Status Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          {['All', 'Instant Help Available', 'Sent to Faculty', 'Answered', 'Resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className="btn btn-sm"
              style={{
                borderRadius: 'var(--radius-pill)',
                background: statusFilter === status ? 'var(--color-deep-teal)' : 'var(--color-card-bg)',
                color: statusFilter === status ? '#ffffff' : 'var(--color-text-main)',
                border: statusFilter === status ? '1px solid var(--color-deep-teal)' : '1px solid var(--color-border)',
                fontWeight: 600
              }}
            >
              {status}
              {status === 'All' && ` (${studentQuestions.length})`}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-secondary)'
              }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search doubts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2rem', height: '36px', fontSize: '0.84rem' }}
            />
          </div>

          <button className="btn btn-primary btn-sm" onClick={onOpenAskModal}>
            <Plus size={15} /> Ask Doubt
          </button>
        </div>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={HelpCircle}
            title={studentQuestions.length === 0 ? "You haven't submitted any doubts yet" : "No questions match your filter"}
            description={
              studentQuestions.length === 0
                ? "Heard a difficult concept in lecture today? Ask a question to get instant help and faculty answers."
                : "Try clearing your search query or choosing 'All' status."
            }
            actionText={studentQuestions.length === 0 ? "Ask Your First Question" : undefined}
            onAction={studentQuestions.length === 0 ? onOpenAskModal : undefined}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredQuestions.map((q) => {
            const hasReplies = q.replies && q.replies.length > 0;
            const latestReply = hasReplies ? q.replies[q.replies.length - 1] : null;
            const isBookmarked = currentUser?.bookmarks?.includes(q.id);

            return (
              <div
                key={q.id}
                className="card"
                style={{
                  padding: '1.35rem 1.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedQuestion(q)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                      <span style={{
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        color: 'var(--color-deep-teal)',
                        background: 'var(--color-soft-sage)',
                        padding: '0.15rem 0.55rem',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        {q.subject}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                        • {q.category}
                      </span>
                      {q.attachments && q.attachments.length > 0 && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-teal)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Paperclip size={12} /> {q.attachments.length} attachment
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1.35 }}>
                      {q.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(q.id);
                        }}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isBookmarked ? 'var(--color-warm-amber)' : 'var(--color-text-muted)' }}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark answer'}
                      >
                        <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>
                      <StatusBadge status={q.status} />
                    </div>
                    <span style={{ fontSize: '0.73rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {formatDate(q.createdAt)}
                    </span>
                  </div>
                </div>

                <p style={{
                  fontSize: '0.88rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {q.description}
                </p>

                {/* Instant Help Preview Badge */}
                {q.instantHelp && q.instantHelp.confidence !== 'none' && (
                  <div style={{
                    background: 'var(--color-soft-sage)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 0.95rem',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: 'var(--color-deep-teal)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={14} /> Instant Academic Guidance Available
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      Click to read explanation
                    </span>
                  </div>
                )}

                {/* Latest Faculty Reply Preview */}
                {latestReply && (
                  <div style={{
                    background: 'var(--color-card-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-deep-teal)' }}>
                        Faculty Response from {latestReply.authorName}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                        {formatDate(latestReply.createdAt)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--color-text-main)', lineHeight: 1.45 }}>
                      {latestReply.content}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '0.7rem', marginTop: '0.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    <User size={13} /> Assigned Faculty: <strong>{q.facultyName}</strong>
                  </div>

                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-secondary-teal)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    View full discussion <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Question Details Modal */}
      {selectedQuestion && (
        <Modal
          isOpen={!!selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          title="Academic Doubt Conversation"
          size="lg"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {selectedQuestion.status !== 'Resolved' && (
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--color-success)', borderColor: 'rgba(46, 125, 99, 0.3)' }}
                    onClick={() => {
                      markQuestionResolved(selectedQuestion.id);
                      setSelectedQuestion(null);
                    }}
                  >
                    <CheckCircle2 size={14} /> Mark as Resolved
                  </button>
                )}
                {!selectedQuestion.sentToFaculty && (
                  <button
                    className="btn btn-amber btn-sm"
                    onClick={() => {
                      sendQuestionToFaculty(selectedQuestion.id);
                      setSelectedQuestion(null);
                    }}
                  >
                    Send to Faculty for Clarification
                  </button>
                )}
              </div>

              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedQuestion(null)}>
                Close
              </button>
            </div>
          }
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge" style={{ background: 'var(--color-soft-sage)', color: 'var(--color-deep-teal)' }}>
                    {selectedQuestion.subject}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                    {selectedQuestion.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-main)' }}>
                  {selectedQuestion.title}
                </h3>
              </div>
              <StatusBadge status={selectedQuestion.status} />
            </div>

            {/* Question description */}
            <div style={{
              background: 'var(--color-warm-ivory)',
              padding: '1.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              marginBottom: '1.5rem',
              fontSize: '0.92rem',
              lineHeight: 1.6
            }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 700, marginBottom: '0.4rem' }}>
                Your Submitted Question:
              </div>
              {selectedQuestion.description}

              {selectedQuestion.attachments && selectedQuestion.attachments.length > 0 && (
                <div style={{ marginTop: '0.85rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.65rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                    Attached Materials:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.35rem' }}>
                    {selectedQuestion.attachments.map((att) => (
                      <span key={att.id} style={{ fontSize: '0.78rem', background: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                        📎 {att.name} ({att.size})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION A: Instant Help */}
            {selectedQuestion.instantHelp && (
              <div style={{
                background: 'var(--color-soft-sage)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-deep-teal)' }}>
                    <Sparkles size={16} /> Instant Academic Guidance
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem' }}
                    onClick={() => rateAnswerHelpful(selectedQuestion.id, true)}
                  >
                    <ThumbsUp size={12} /> Was this helpful?
                  </button>
                </div>

                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {selectedQuestion.instantHelp.answer}
                </div>

                <div style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)', marginTop: '0.75rem' }}>
                  Source: {selectedQuestion.instantHelp.source}
                </div>
              </div>
            )}

            {/* SECTION B: Faculty Response */}
            <h4 style={{ fontSize: '1.02rem', color: 'var(--color-text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={16} color="var(--color-deep-teal)" /> Faculty Guidance & Follow-Up Discussion
            </h4>

            {selectedQuestion.replies.length === 0 ? (
              <div style={{
                padding: '1.75rem',
                textAlign: 'center',
                background: 'var(--color-warm-ivory)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                fontSize: '0.88rem',
                marginBottom: '1.25rem'
              }}>
                <Clock size={24} style={{ display: 'block', margin: '0 auto 0.5rem', color: 'var(--color-secondary-teal)' }} />
                Your question has been forwarded to <strong>{selectedQuestion.facultyName}</strong>. 
                Faculty responses appear immediately when submitted.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {selectedQuestion.replies.map((reply) => (
                  <div
                    key={reply.id}
                    style={{
                      background: reply.authorRole === 'faculty' ? '#ffffff' : 'var(--color-soft-sage)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.1rem 1.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-text-main)', fontSize: '0.88rem' }}>
                        {reply.authorName} ({reply.authorRole === 'faculty' ? 'Faculty Professor' : 'Student Follow-up'})
                      </div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>
                        {formatDate(reply.createdAt)}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.55 }}>
                      {reply.content}
                    </p>

                    {reply.suggestOfficeMeeting && (
                      <div style={{
                        marginTop: '0.75rem',
                        padding: '0.65rem 0.9rem',
                        background: 'var(--color-warm-amber-light)',
                        border: '1px solid rgba(213, 164, 91, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#885c18' }}>
                            📅 Office Hours Consultation Recommended
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-main)' }}>
                            {reply.meetingNote || 'Professor recommended scheduling an in-person discussion.'}
                          </div>
                        </div>

                        <button
                          className="btn btn-amber btn-sm"
                          style={{ fontSize: '0.74rem', padding: '0.2rem 0.6rem' }}
                          onClick={() => {
                            setSelectedQuestion(null);
                            setActiveTab('appointments');
                          }}
                        >
                          Book Slot <Calendar size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Follow-up input form */}
            <form onSubmit={handleFollowUpSubmit}>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ask a follow-up question or provide more clarification to your professor..."
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={!followUpText.trim()}>
                  <Send size={14} /> Send
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};
