import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECTS_LIST } from '../../services/storage.ts';
import { FAQItem } from '../../types/index.ts';
import { 
  FileText, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Bookmark
} from 'lucide-react';

interface FAQSectionProps {
  onOpenAskModal?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenAskModal }) => {
  const { faqs, setActiveTab, role, toggleBookmark, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(faqs[0]?.id || null);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSubject = selectedSubject === 'All' || faq.subject === selectedSubject;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  return (
    <div>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-deep-teal) 0%, #1e4540 100%)',
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(213, 164, 91, 0.25)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)', color: 'var(--color-warm-amber)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <BookOpen size={14} /> Knowledge Repository
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', color: '#ffffff', marginBottom: '0.4rem' }}>
            Subject Knowledge Base & Verified FAQs
          </h2>
          <p style={{ color: 'var(--color-soft-sage)', fontSize: '0.92rem', maxWidth: '640px' }}>
            Curated answers synthesized directly from recurring student classroom doubts and professor answers. 
            Search verified explanations before submitting new questions.
          </p>
        </div>

        {role === 'student' && onOpenAskModal && (
          <button className="btn btn-amber" onClick={onOpenAskModal}>
            <HelpCircle size={16} /> Still Stuck? Ask Question
          </button>
        )}
      </div>

      {/* Search & Subject Filters */}
      <div style={{
        background: 'var(--color-card-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search
              size={17}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-secondary)'
              }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search concepts: page replacement, TCP handshake, 3NF, Peterson barrier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', height: '42px' }}
            />
          </div>

          {/* Subject Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {['All', ...SUBJECTS_LIST].map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className="btn btn-sm"
                style={{
                  borderRadius: 'var(--radius-pill)',
                  background: selectedSubject === subj ? 'var(--color-deep-teal)' : 'var(--color-soft-sage)',
                  color: selectedSubject === subj ? '#ffffff' : 'var(--color-text-main)',
                  border: selectedSubject === subj ? '1px solid var(--color-deep-teal)' : '1px solid var(--color-border)',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Accordion List */}
      {filteredFaqs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <FileText size={40} color="var(--color-text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <h4 style={{ fontSize: '1.15rem', color: 'var(--color-text-main)' }}>No FAQs match your search</h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginTop: '0.3rem', maxWidth: '420px', margin: '0.3rem auto 1.5rem' }}>
            Could not find an answer for "{searchQuery}". You can submit this doubt directly to your professor or use Instant AI Help.
          </p>
          {role === 'student' && onOpenAskModal && (
            <button className="btn btn-primary btn-sm" onClick={onOpenAskModal}>
              Ask This Question to Faculty
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            const isBookmarked = currentUser?.bookmarks?.includes(faq.id);

            return (
              <div
                key={faq.id}
                className="card"
                style={{
                  overflow: 'hidden',
                  border: isExpanded ? '1.5px solid var(--color-secondary-teal)' : '1px solid var(--color-border)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div
                  onClick={() => toggleExpand(faq.id)}
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isExpanded ? 'var(--color-soft-sage)' : 'var(--color-card-bg)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 'var(--radius-sm)',
                      background: isExpanded ? 'var(--color-deep-teal)' : 'var(--color-soft-sage)',
                      color: isExpanded ? '#ffffff' : 'var(--color-deep-teal)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <FileText size={16} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-deep-teal)' }}>
                          {faq.subject}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>
                          • {faq.category}
                        </span>
                        {faq.isPopular && (
                          <span style={{ fontSize: '0.68rem', background: 'var(--color-warm-amber-light)', color: '#885c18', padding: '0.05rem 0.45rem', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
                            Popular ({faq.frequencyCount || 12}+ students)
                          </span>
                        )}
                      </div>

                      <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                        {faq.question}
                      </h4>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginLeft: '1rem' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(faq.id);
                      }}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isBookmarked ? 'var(--color-warm-amber)' : 'var(--color-text-muted)' }}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark FAQ'}
                    >
                      <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                    <div style={{ color: 'var(--color-secondary-teal)' }}>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{
                    padding: '1.5rem',
                    background: 'var(--color-card-bg)',
                    borderTop: '1px solid var(--color-border)',
                    fontSize: '0.94rem',
                    lineHeight: 1.65,
                    color: 'var(--color-text-main)'
                  }}>
                    <div style={{ marginBottom: '1.25rem' }}>
                      {faq.answer}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      <span>Faculty Verifier: <strong>{faq.facultyAuthor}</strong></span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-success)', fontWeight: 600 }}>
                        <Sparkles size={13} /> Verified Academic Solution
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Assistance Callout */}
      <div style={{
        marginTop: '3rem',
        background: 'var(--color-soft-sage)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', color: 'var(--color-text-main)', marginBottom: '0.2rem' }}>
            Need direct guidance on a lecture topic?
          </h4>
          <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)' }}>
            Ask an academic question or schedule one-on-one time with your professor during office hours.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {role === 'student' && onOpenAskModal && (
            <button className="btn btn-primary btn-sm" onClick={onOpenAskModal}>
              Ask a Doubt
            </button>
          )}
          <button className="btn btn-outline btn-sm" onClick={() => setActiveTab(role === 'student' ? 'appointments' : 'faculty-slots')}>
            View Consultation Hours
          </button>
        </div>
      </div>
    </div>
  );
};
