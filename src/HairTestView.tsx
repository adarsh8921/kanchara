import React, { useState } from 'react';
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
  setQuizStep?: React.Dispatch<React.SetStateAction<number>>;
}

export const HairTestView: React.FC<HairTestViewProps> = ({
  quizStep,
  quizAnswers,
  handleQuizSelect,
  resetQuiz,
  setCurrentView,
  addToCart,
  products,
  setQuizStep
}) => {
  const [photos, setPhotos] = useState<{
    front?: string;
    top?: string;
    left?: string;
    right?: string;
  }>({});

  const totalQuestions = quizQuestions.length; // 30
  const isQuestionStep = quizStep < totalQuestions;
  const isPhotoStep = quizStep === totalQuestions;
  const isResultStep = quizStep > totalQuestions;

  const currentQ = isQuestionStep ? quizQuestions[quizStep] : null;

  const handlePhotoUpload = (key: 'front' | 'top' | 'left' | 'right', file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotos(prev => ({ ...prev, [key]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Profile scores
  const hairCareScore = 78;
  const scalpWellnessScore = 71;
  const lifestyleScore = 68;
  const nutritionScore = 61;
  const digestiveScore = 56;

  return (
    <div style={{ background: '#F4FAF7', minHeight: 'calc(100vh - 70px)', padding: '16px 16px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      
      {/* Sleek Compact Header Card */}
      <div style={{
        width: '100%',
        maxWidth: '820px',
        background: 'linear-gradient(135deg, #062319 0%, #0B3C2D 60%, #135541 100%)',
        color: '#ffffff',
        padding: '16px 24px',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(6, 35, 25, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#32B690', color: '#062319', fontWeight: 900, fontSize: '13px', padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Clinical Diagnostic
          </div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
            Free Hair Root & Scalp Assessment
          </h1>
        </div>

        <div style={{ fontSize: '12px', color: '#FEF3C7', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.1)', padding: '4px 12px', borderRadius: '9999px' }}>
          <span>🩺 Doctor Formulated</span>
          <span>•</span>
          <span>30 Questions + Photo Assessment</span>
        </div>
      </div>

      {/* Main Diagnostic Quiz Box */}
      <div style={{
        width: '100%',
        maxWidth: '820px',
        background: '#ffffff',
        borderRadius: '20px',
        padding: '24px 28px',
        boxShadow: '0 12px 40px rgba(6, 35, 25, 0.08)',
        border: '1px solid rgba(19, 85, 65, 0.12)'
      }}>
        {isQuestionStep && currentQ && (
          <div>
            {/* Progress Bar & Badges */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0B3C2D', letterSpacing: '0.8px', textTransform: 'uppercase', background: '#E6F7F2', padding: '3px 10px', borderRadius: '6px' }}>
                  {currentQ.category}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#0B3C2D' }}>
                    Q{quizStep + 1} / {totalQuestions}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
                    ({Math.round(((quizStep + 1) / totalQuestions) * 100)}%)
                  </span>
                </div>
              </div>

              {/* Progress Line */}
              <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${((quizStep + 1) / totalQuestions) * 100}%`,
                  background: 'linear-gradient(90deg, #32B690 0%, #0B3C2D 100%)',
                  borderRadius: '9999px',
                  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>
            </div>

            {/* Question Title & Subtitle */}
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px', lineHeight: 1.25 }}>
                {currentQ.title}
              </h2>
              {currentQ.subtitle && (
                <p style={{ color: '#64748B', fontSize: '13px', margin: 0, lineHeight: 1.4 }}>
                  {currentQ.subtitle}
                </p>
              )}
            </div>

            {/* Responsive Compact Grid for Options */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: currentQ.options.length <= 4 ? 'repeat(auto-fit, minmax(240px, 1fr))' : 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '10px',
              marginBottom: '20px'
            }}>
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuizSelect(opt.text)}
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    minHeight: '52px'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#32B690';
                    e.currentTarget.style.background = '#F0FDF4';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(50, 182, 144, 0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                      {opt.text}
                    </div>
                    {opt.desc && (
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, marginTop: '2px', lineHeight: 1.2 }}>
                        {opt.desc}
                      </div>
                    )}
                  </div>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0B3C2D',
                    fontWeight: 800,
                    fontSize: '12px',
                    flexShrink: 0
                  }}>
                    ➔
                  </div>
                </button>
              ))}
            </div>

            {/* Controls Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
              <div>
                {quizStep > 0 && setQuizStep && (
                  <button
                    onClick={() => setQuizStep(prev => prev - 1)}
                    style={{ background: '#F1F5F9', border: 'none', color: '#475569', fontWeight: 700, fontSize: '12px', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    ← Back
                  </button>
                )}
              </div>

              {quizStep > 0 && (
                <button
                  onClick={() => resetQuiz()}
                  style={{ background: 'none', border: 'none', color: '#64748B', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                >
                  ↺ Restart Assessment
                </button>
              )}
            </div>
          </div>
        )}

        {/* PHOTO UPLOAD STEP (After Question 30) */}
        {isPhotoStep && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0B3C2D', letterSpacing: '0.8px', textTransform: 'uppercase', background: '#E6F7F2', padding: '3px 10px', borderRadius: '6px' }}>
                STEP 2 OF 2: VISUAL ASSESSMENT
              </span>
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '8px 0 4px' }}>
                Want a more personalized Kanchara profile?
              </h2>
              <p style={{ color: '#64748B', fontSize: '13px', margin: 0, lineHeight: 1.4 }}>
                Upload 3–4 photos of your hair and scalp. We’ll use them to assess visible hair characteristics and make your profile more personalized.
              </p>
            </div>

            {/* Photo Slots Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {[
                { key: 'front', label: '1. Front', desc: 'Frontal hairline & temples' },
                { key: 'top', label: '2. Top/crown', desc: 'Crown & partition gap' },
                { key: 'left', label: '3. Left', desc: 'Left temporal side profile' },
                { key: 'right', label: '4. Right', desc: 'Right temporal side profile' }
              ].map(slot => {
                const img = photos[slot.key as keyof typeof photos];
                return (
                  <label
                    key={slot.key}
                    style={{
                      background: img ? '#F0FDF4' : '#F8FAFC',
                      border: img ? '2px solid #32B690' : '2px dashed #CBD5E1',
                      borderRadius: '14px',
                      padding: '12px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '130px',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => handlePhotoUpload(slot.key as any, e.target.files?.[0] || null)}
                    />
                    {img ? (
                      <>
                        <img src={img} alt={slot.label} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '6px' }} />
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#065F46' }}>✓ {slot.label}</span>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '24px', marginBottom: '4px' }}>📷</div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>{slot.label}</div>
                        <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>{slot.desc}</div>
                      </>
                    )}
                  </label>
                );
              })}
            </div>

            {/* Disclaimer Alert */}
            <div style={{
              background: '#FFFBEB',
              border: '1px solid #FCD34D',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '12px',
              color: '#92400E',
              lineHeight: 1.4,
              marginBottom: '20px',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: '14px' }}>⚠️</span>
              <div>
                <strong>Important Notice:</strong> The AI assesses only visible characteristics—not medical conditions like alopecia, thyroid problems, nutritional deficiencies, or hormonal disorders.
              </div>
            </div>

            {/* Controls Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {setQuizStep && (
                <button
                  onClick={() => setQuizStep(totalQuestions - 1)}
                  style={{ background: '#F1F5F9', border: 'none', color: '#475569', fontWeight: 700, fontSize: '12px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  ← Back to Questions
                </button>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setQuizStep && setQuizStep(totalQuestions + 1)}
                  style={{ background: 'none', border: 'none', color: '#64748B', fontWeight: 700, fontSize: '13px', cursor: 'pointer', padding: '8px 12px' }}
                >
                  Skip & View Profile
                </button>

                <button
                  onClick={() => setQuizStep && setQuizStep(totalQuestions + 1)}
                  style={{ background: '#0B3C2D', color: '#ffffff', border: 'none', padding: '10px 24px', borderRadius: '9999px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(11, 60, 45, 0.2)' }}
                >
                  Generate My Kanchara Profile ➔
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS SCREEN — YOUR KANCHARA HAIR PROFILE */}
        {isResultStep && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '50%', background: '#E6F7F2', color: '#0B3C2D', fontSize: '24px', marginBottom: '8px' }}>
              🌿
            </div>
            
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: '0 0 14px', letterSpacing: '0.5px' }}>
              YOUR KANCHARA HAIR PROFILE
            </h2>

            {/* Score Box */}
            <div style={{
              background: 'linear-gradient(135deg, #062319 0%, #0B3C2D 100%)',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '16px 24px',
              maxWidth: '360px',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              boxShadow: '0 8px 24px rgba(6, 35, 25, 0.15)'
            }}>
              <div style={{ fontSize: '42px', fontWeight: 900, color: '#32B690', lineHeight: 1 }}>
                72
              </div>
              <div style={{ textAlign: 'left', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '14px' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>/ 100</div>
                <div style={{ fontSize: '11px', color: '#FEF3C7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Overall Hair & Scalp Score</div>
              </div>
            </div>

            {/* Strongest Areas Breakdown */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '18px 22px',
              textAlign: 'left',
              marginBottom: '18px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Your strongest areas
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: '🌿 Hair Care', score: hairCareScore, color: '#269474' },
                  { label: '💧 Scalp Wellness', score: scalpWellnessScore, color: '#0B3C2D' },
                  { label: '😴 Lifestyle', score: lifestyleScore, color: '#32B690' },
                  { label: '🥗 Nutrition Support', score: nutritionScore, color: '#F59E0B' },
                  { label: '🌱 Digestive Wellness', score: digestiveScore, color: '#D97706' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                      <span>{item.label}</span>
                      <span style={{ color: item.color, fontWeight: 800 }}>{item.score}</span>
                    </div>
                    <div style={{ height: '7px', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${item.score}%`,
                        background: item.color,
                        borderRadius: '9999px'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Summary Insight Statement */}
            <div style={{
              background: '#F0FDF4',
              border: '1.5px solid #A7F3D0',
              borderRadius: '14px',
              padding: '14px 18px',
              textAlign: 'left',
              fontSize: '13px',
              color: '#065F46',
              fontWeight: 600,
              lineHeight: 1.5,
              marginBottom: '14px'
            }}>
              💡 Your answers suggest that your routine could benefit from more focus on scalp nourishment, consistent hair care and overall wellness habits.
            </div>

            {/* Answered Diagnostic Tags */}
            {Object.keys(quizAnswers).length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px', justifyContent: 'flex-start' }}>
                {Object.entries(quizAnswers).map(([k, v]) => (
                  <span key={k} style={{ background: '#ffffff', border: '1px solid #E2E8F0', fontSize: '11px', color: '#334155', fontWeight: 600, padding: '3px 8px', borderRadius: '6px' }}>
                    ✓ <strong>{k.replace('_', ' ').toUpperCase()}:</strong> {v}
                  </span>
                ))}
              </div>
            )}

            {/* THE KANCHARA RECOMMENDATION — YOUR PERSONALIZED ROUTINE */}
            <div style={{ textAlign: 'left', marginTop: '24px', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0B3C2D', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                The Kanchara Recommendation
              </div>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: '0 0 16px', letterSpacing: '0.3px' }}>
                YOUR PERSONALIZED ROUTINE
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* STEP 01: Scalp Nourishment */}
                <div style={{ background: '#ffffff', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#269474', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      🌿 STEP 01 — Scalp Nourishment
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '2px' }}>
                      Kanchara Bhringaraj Herbal Premium Hair Oil
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px' }}>
                      Recommended as part of your regular hair-care routine.
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ background: '#F1F5F9', color: '#475569', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>100 ml</span>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#0B3C2D' }}>₹369 <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600 }}>MRP</span></span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const oil = products.find(p => p.id === 'p3') || products[0];
                      addToCart(oil);
                    }}
                    style={{ background: '#0B3C2D', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}
                  >
                    ADD TO CART
                  </button>
                </div>

                {/* STEP 02: Wellness Support */}
                <div style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    🥗 STEP 02 — Wellness Support
                  </div>
                  <div style={{ fontSize: '13px', color: '#334155', fontWeight: 600, marginBottom: '6px' }}>
                    A Kanchara Ayurvedic wellness product may complement your routine.
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.4, background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    ℹ️ For regulated Ayurvedic medicines, practitioner review is required prior to dispensing based on your profile responses.
                  </div>
                </div>

                {/* STEP 03: Lifestyle Support */}
                <div style={{ background: '#F0FDF4', border: '1.5px solid #A7F3D0', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    😴 STEP 03 — Lifestyle Support
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                    Your personalized recommendations:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li>Improve sleep consistency</li>
                    <li>Maintain hydration</li>
                    <li>Include adequate protein</li>
                    <li>Increase fruits & vegetables</li>
                    <li>Maintain regular physical activity</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* THE FINAL CTA CARD */}
            <div style={{
              background: 'linear-gradient(135deg, #062319 0%, #0B3C2D 100%)',
              color: '#ffffff',
              borderRadius: '18px',
              padding: '24px 20px',
              textAlign: 'center',
              marginBottom: '24px',
              boxShadow: '0 10px 30px rgba(6, 35, 25, 0.18)'
            }}>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 900, color: '#FEF3C7', margin: '0 0 8px', letterSpacing: '0.5px' }}>
                YOUR JOURNEY STARTS HERE.
              </h3>
              <p style={{ fontSize: '13px', color: '#E6F7F2', margin: '0 auto 16px', maxWidth: '500px', lineHeight: 1.5 }}>
                Your hair-care routine is not just about what you put on your hair. It’s about understanding your scalp, your habits and your overall wellness.
              </p>
              <button
                onClick={() => {
                  const kit = products.find(p => p.id === 'p1') || products[0];
                  addToCart(kit);
                  setCurrentView('checkout');
                }}
                style={{
                  background: 'linear-gradient(90deg, #32B690 0%, #269474 100%)',
                  color: '#062319',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: '9999px',
                  fontWeight: 900,
                  fontSize: '14px',
                  cursor: 'pointer',
                  letterSpacing: '0.5px',
                  boxShadow: '0 6px 20px rgba(50, 182, 144, 0.3)'
                }}
              >
                START MY KANCHARA JOURNEY →
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={resetQuiz}
                style={{
                  background: '#F1F5F9',
                  color: '#475569',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '13px',
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
  );
};
