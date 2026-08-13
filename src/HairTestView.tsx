import React from 'react';
import type { Product } from './types';
import { quizQuestions } from './types';

interface HairTestViewProps {
  quizStep: number;
  quizAnswers: Record<string, string>;
  handleQuizSelect: (optionText: string) => void;
  resetQuiz: () => void;
  setCurrentView: (view: 'home' | 'shop' | 'checkout' | 'assessment' | 'success') => void;
  addToCart: (product: Product) => void;
  products: Product[];
}

export const HairTestView: React.FC<HairTestViewProps> = ({
  quizStep,
  quizAnswers,
  handleQuizSelect,
  resetQuiz,
  setCurrentView,
  addToCart,
  products
}) => {
  const currentQ = quizQuestions[quizStep];
  const isCompleted = quizStep >= quizQuestions.length;

  return (
    <div style={{ background: '#F8FAF8', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #062319 0%, #0B3C2D 60%, #135541 100%)',
        color: '#ffffff',
        padding: '50px 40px 70px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            color: '#FEF3C7',
            fontSize: '11px',
            fontWeight: 800,
            padding: '5px 16px',
            borderRadius: '9999px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            CLINICAL TRICHOLOGY & AYURVEDIC DIAGNOSTIC SYSTEM
          </span>

          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '38px', fontWeight: 800, margin: '14px 0 10px', color: '#ffffff' }}>
            Free Hair Root & Scalp Assessment
          </h1>
          <p style={{ color: '#E6F7F2', fontSize: '15px', margin: 0, lineHeight: 1.6 }}>
            Answer 7 clinical diagnostic questions to pinpoint your hair loss stage, root metabolic causes, and receive your personalized doctor formulation kit.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '860px', margin: '-40px auto 0', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '44px',
          boxShadow: '0 20px 50px rgba(6, 35, 25, 0.1)',
          border: '1px solid rgba(19, 85, 65, 0.1)'
        }}>
          {!isCompleted ? (
            <div>
              {/* Progress Indicator */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#0B3C2D', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {currentQ.category} • QUESTION {quizStep + 1} OF {quizQuestions.length}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>
                    {Math.round(((quizStep + 1) / quizQuestions.length) * 100)}% Completed
                  </span>
                </div>
                <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${((quizStep + 1) / quizQuestions.length) * 100}%`,
                    background: 'linear-gradient(90deg, #32B690 0%, #0B3C2D 100%)',
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>

              {/* Question Header */}
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px', lineHeight: 1.3 }}>
                  {currentQ.title}
                </h2>
                <p style={{ color: '#64748B', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
                  {currentQ.subtitle}
                </p>
              </div>

              {/* Option Cards Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizSelect(opt.text)}
                    style={{
                      background: '#F8FAFC',
                      border: '2px solid #E2E8F0',
                      borderRadius: '16px',
                      padding: '20px 24px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#32B690';
                      e.currentTarget.style.background = '#F0FDF4';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.background = '#F8FAFC';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                        {opt.text}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                        {opt.desc}
                      </div>
                    </div>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      border: '1px solid #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0B3C2D',
                      fontWeight: 800,
                      fontSize: '16px',
                      flexShrink: 0
                    }}>
                      ➔
                    </div>
                  </button>
                ))}
              </div>

              {/* Controls */}
              {quizStep > 0 && (
                <button
                  onClick={() => resetQuiz()}
                  style={{ background: 'none', border: 'none', color: '#64748B', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  ↺ Restart Assessment
                </button>
              )}
            </div>
          ) : (
            /* Results View */
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '50%', background: '#E6F7F2', color: '#0B3C2D', fontSize: '36px', marginBottom: '16px' }}>
                🩺
              </div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '30px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px' }}>
                Diagnostic Profile Completed
              </h2>
              <p style={{ color: '#64748B', fontSize: '15px', maxWidth: '580px', margin: '0 auto 28px' }}>
                Our medical engine has evaluated your inputs across hormonal sensitivity, gut digestion, chronic duration & scalp environment.
              </p>

              {/* Summary Prescription Card */}
              <div style={{
                background: 'linear-gradient(135deg, #F4FAF7 0%, #E6F4EF 100%)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid #32B690',
                textAlign: 'left',
                marginBottom: '32px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 800, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#0B3C2D' }}>PRESCRIBED SYSTEM</span>
                  <span style={{ background: '#0B3C2D', color: '#FBBF24', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '9999px' }}>96.4% MATCH</span>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px' }}>
                  KANCHARA Complete 3-Science Regrowth Kit
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {Object.entries(quizAnswers).map(([key, val]) => (
                    <div key={key} style={{ fontSize: '13px', color: '#334155', display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#269474', fontWeight: 800 }}>✓</span>
                      <span><strong>{key.toUpperCase()}:</strong> {val}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#ffffff', padding: '14px 18px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>
                  💬 <strong>Free Doctor Consultation Included:</strong> A senior KANCHARA Ayurvedic Doctor & Trichologist will review your response on WhatsApp within 15 minutes.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    const kit = products.find(p => p.id === 'p1') || products[0];
                    addToCart(kit);
                    setCurrentView('checkout');
                  }}
                  style={{
                    background: '#0B3C2D',
                    color: '#ffffff',
                    border: 'none',
                    padding: '16px 36px',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(11, 60, 45, 0.3)'
                  }}
                >
                  GET PRESCRIBED KIT & ORDER NOW ➔
                </button>

                <button
                  onClick={resetQuiz}
                  style={{
                    background: '#F1F5F9',
                    color: '#475569',
                    border: 'none',
                    padding: '16px 24px',
                    borderRadius: '9999px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Retake Assessment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
