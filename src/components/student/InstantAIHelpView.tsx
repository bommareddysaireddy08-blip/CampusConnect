import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECTS_LIST, FACULTY_DIRECTORY } from '../../services/storage.ts';
import { searchInstantAcademicHelp } from '../../services/aiHelp.ts';
import { InstantHelpResult } from '../../types/index.ts';
import { 
  Sparkles, 
  Send, 
  Search, 
  ThumbsUp, 
  ThumbsDown, 
  BookOpen, 
  ArrowRight, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  FileText,
  AlertCircle
} from 'lucide-react';

export const InstantAIHelpView: React.FC = () => {
  const { faqs, submitQuestion, setActiveTab, currentUser } = useApp();

  const [query, setQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS_LIST[0]);
  const [result, setResult] = useState<InstantHelpResult | null>(null);
  const [followUps, setFollowUps] = useState<{ query: string; answer: string }[]>([]);
  const [followUpText, setFollowUpText] = useState('');
  const [isSubmittingToFaculty, setIsSubmittingToFaculty] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const res = searchInstantAcademicHelp(query, selectedSubject, faqs);
    setResult(res);
    setFollowUps([]);
    setFeedbackGiven(null);
  };

  const handleAskSuggested = (suggested: string) => {
    setQuery(suggested);
    const res = searchInstantAcademicHelp(suggested, selectedSubject, faqs);
    setResult(res);
    setFollowUps([]);
    setFeedbackGiven(null);
  };

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpText.trim() || !result) return;

    const followUpRes = searchInstantAcademicHelp(`${query} ${followUpText}`, selectedSubject, faqs);
    setFollowUps((prev) => [
      ...prev,
      {
        query: followUpText,
        answer: followUpRes.answer
      }
    ]);
    setFollowUpText('');
  };

  const handleEscalateToFaculty = () => {
    if (!query.trim()) return;

    const matchedFaculty = FACULTY_DIRECTORY.find((f) => f.subjects.includes(selectedSubject)) || FACULTY_DIRECTORY[0];

    const submission = submitQuestion({
      facultyId: matchedFaculty.id,
      facultyName: matchedFaculty.name,
      subject: selectedSubject,
      title: query.length > 80 ? `${query.substring(0, 77)}...` : query,
      description: `Student sought instant help on this topic and requested comprehensive faculty explanation.\n\nInitial query: "${query}"`,
      category: 'Concept Clarification',
      sendDirectlyToFaculty: true
    });

    if (submission.success) {
      setIsSubmittingToFaculty(true);
      setTimeout(() => {
        setActiveTab('my-questions');
      }, 1200);
    }
  };

  return (
    <div>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-deep-teal) 0%, #1a423e 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem 2.25rem',
        color: '#ffffff',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(213, 164, 91, 0.2)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)', color: 'var(--color-warm-amber)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> Instant Academic Guidance
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', color: '#ffffff', marginBottom: '0.4rem' }}>
            Instant Academic Help Assistant
          </h2>
          <p style={{ color: 'var(--color-soft-sage)', fontSize: '0.92rem', maxWidth: '640px' }}>
            Receive immediate, verified explanations from our curated syllabus knowledge base. 
            No waiting—get instant insights, follow-up clarifications, and direct faculty escalation when needed.
          </p>
        </div>
      </div>

      {/* Query Search Card */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem', marginBottom: '1.1rem' }}>
            <div>
              <label className="form-label required">What academic doubt or concept do you have?</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Why does Belady's anomaly occur only in FIFO and not LRU?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label required">Course Subject</label>
              <select
                className="form-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {SUBJECTS_LIST.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Tip: Search algorithms, synchronization barriers, BCNF decomposition, TCP handshake, or Knapsack.
            </div>

            <button type="submit" className="btn btn-primary btn-sm" disabled={!query.trim()}>
              <Search size={14} /> Get Instant Answer
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Section A: Instant Guidance */}
          <div className="card" style={{ border: '1.5px solid var(--color-deep-teal)' }}>
            <div className="card-header" style={{ background: 'var(--color-soft-sage)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={18} color="var(--color-deep-teal)" />
                <h3 className="card-title" style={{ color: 'var(--color-deep-teal)' }}>
                  Section A: Instant Academic Help
                </h3>
              </div>
              <span className="badge badge-instant">
                {result.confidence === 'high' ? 'High Confidence Match' : result.confidence === 'medium' ? 'Verified Match' : 'Unmatched'}
              </span>
            </div>

            <div className="card-body">
              <div style={{ fontSize: '0.94rem', color: 'var(--color-text-main)', lineHeight: 1.65, whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
                {result.answer}
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', padding: '0.5rem 0.8rem', background: 'var(--color-warm-ivory)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', marginBottom: '1.25rem' }}>
                <strong>Knowledge Source:</strong> {result.source}
              </div>

              {/* Study Resources */}
              {result.studyResources.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.88rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                    Recommended Study Resources:
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {result.studyResources.map((res, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'var(--color-card-bg)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.65rem 0.9rem',
                          fontSize: '0.84rem'
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--color-deep-teal)' }}>
                          [{res.type}] {res.title}
                        </span>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '0.15rem' }}>
                          Ref: {res.linkOrRef}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback Rating */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                    Was this instant answer helpful?
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ background: feedbackGiven === 'yes' ? 'var(--color-success-bg)' : '#ffffff', color: feedbackGiven === 'yes' ? 'var(--color-success)' : 'inherit' }}
                    onClick={() => setFeedbackGiven('yes')}
                  >
                    <ThumbsUp size={13} /> Yes
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ background: feedbackGiven === 'no' ? 'var(--color-error-bg)' : '#ffffff', color: feedbackGiven === 'no' ? 'var(--color-error)' : 'inherit' }}
                    onClick={() => setFeedbackGiven('no')}
                  >
                    <ThumbsDown size={13} /> No
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn-amber btn-sm"
                  onClick={handleEscalateToFaculty}
                  disabled={isSubmittingToFaculty}
                >
                  <UserCheck size={14} /> Send to Faculty for Clarification
                </button>
              </div>
            </div>
          </div>

          {/* Follow-up Question Thread */}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Ask a Follow-Up Question</h4>
            </div>

            <div className="card-body">
              {followUps.map((fu, idx) => (
                <div key={idx} style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-deep-teal)', marginBottom: '0.35rem' }}>
                    Q: {fu.query}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: 1.55 }}>
                    {fu.answer}
                  </div>
                </div>
              ))}

              <form onSubmit={handleFollowUpSubmit}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ask a clarifying follow-up regarding this topic..."
                    value={followUpText}
                    onChange={(e) => setFollowUpText(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" disabled={!followUpText.trim()}>
                    <Send size={14} /> Ask
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Suggested Related Questions */}
          {result.suggestedQuestions.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Suggested Related Questions</h4>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {result.suggestedQuestions.map((sq, i) => (
                    <div
                      key={i}
                      onClick={() => handleAskSuggested(sq)}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-warm-ivory)',
                        cursor: 'pointer',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: 'var(--color-deep-teal)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <span>{sq}</span>
                      <ArrowRight size={14} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section B: Faculty Response preview */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Section B: Faculty Response</h3>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                When you forward this doubt to your professor, their personalized guidance, code reviews, or recommended office visit notes will appear here.
              </p>
              <button className="btn btn-primary btn-sm" onClick={handleEscalateToFaculty}>
                Forward Question to Faculty
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
