import React, { useState, useEffect } from 'react';
import productImage from './assets/bottle.png';

export const HowItWorksAnimation: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const steps = [
    {
      stage: 'STAGE 01',
      title: 'Deep Scalp Penetration & Sebum Detox',
      subtitle: 'Targeting Scalp Surface & Dormant Follicles',
      desc: 'The bio-active Ayurvedic botanical extract deeply penetrates hair follicles, dissolving hardened DHT sebum buildup and unblocking oxygen pathways to suffocating hair roots.',
      accentColor: '#32B690',
      badge: 'MONTH 1: DE-CLOG & DETOX',
      stat: '98% Sebum Clearance'
    },
    {
      stage: 'STAGE 02',
      title: 'Micro-Circulation & Follicle Reactivation',
      subtitle: 'Dermatological Peptide & Blood Flow Boost',
      desc: 'Clinical Redensyl & Procapil complexes stimulate micro-capillaries around dormant follicles, transitioning hair from resting (Telogen) to active growth phase (Anagen).',
      accentColor: '#F59E0B',
      badge: 'MONTH 2: REACTIVATE ROOTS',
      stat: '+34% Micro-Circulation'
    },
    {
      stage: 'STAGE 03',
      title: 'Internal Pitta & Ama Gut Detox',
      subtitle: 'Metabolic Ayurvedic Gut Oil Action',
      desc: 'Internal Bhringraj and Brahmi formulations cool excess Pitta heat in the stomach, ensuring ingested biotin and zinc are 100% absorbed directly into hair follicles.',
      accentColor: '#10B981',
      badge: 'MONTH 3: GUT-HAIR AXIS',
      stat: '100% Nutrient Absorption'
    },
    {
      stage: 'STAGE 04',
      title: 'Thicker Shaft Density & Sustained Regrowth',
      subtitle: 'Structural Hair Shaft Strengthening',
      desc: 'Essential plant biotin & iron complexes reinforce keratin protein bonds inside the hair shaft, reducing hair breakage by 89% and multiplying strand density.',
      accentColor: '#6366F1',
      badge: 'MONTH 4+: DENSE REGROWTH',
      stat: '10,000+ New Hair Strands'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, steps.length]);

  return (
    <section className="how-it-works-animation-section" style={{
      background: 'linear-gradient(180deg, #062319 0%, #0B3C2D 50%, #062319 100%)',
      color: '#ffffff',
      padding: '36px 20px 44px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glowing Orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(50, 182, 144, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(30px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(40px)'
      }} />

      <div style={{ maxWidth: '1080px', margin: '0 auto', position: 'relative', zIndex: 5 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '4px 14px',
            borderRadius: '9999px',
            marginBottom: '10px'
          }}>
            <span style={{ color: '#FBBF24', fontSize: '11px' }}>⚡</span>
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#FEF3C7' }}>
              FORMULATION MECHANISM
            </span>
          </div>

          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: 900, margin: '0 0 8px', color: '#ffffff', letterSpacing: '-0.3px' }}>
            How KANCHARA Regrowth Formula Works
          </h2>

          <p style={{ color: '#E6F7F2', fontSize: '13px', lineHeight: 1.4, margin: 0 }}>
            Our 3-Science synergistic formula reverses hair loss at the root cause step-by-step.
          </p>
        </div>

        {/* Animation Main Interactive Showcase Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: '24px',
          alignItems: 'center'
        }}>
          {/* Left Column: Product Spotlight Showcase */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '20px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Animated Spotlight Area */}
            <div style={{
              position: 'relative',
              width: '200px',
              height: '210px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              {/* Orbital Ring 1 */}
              <div style={{
                position: 'absolute',
                inset: '-10px',
                borderRadius: '50%',
                border: `2px dashed ${steps[activeStep].accentColor}`,
                opacity: 0.5,
                animation: 'spin 10s linear infinite',
                transition: 'border-color 0.8s ease'
              }} />
              {/* Pulse Glow Background */}
              <div style={{
                position: 'absolute',
                inset: '-30px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${steps[activeStep].accentColor}30 0%, transparent 70%)`,
                animation: 'pulseGlow 2.5s ease-in-out infinite',
                transition: 'background 0.8s ease'
              }} />

              {/* Laser Scanning Beam */}
              <div style={{
                position: 'absolute',
                left: '10%',
                right: '10%',
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${steps[activeStep].accentColor}, #ffffff, ${steps[activeStep].accentColor}, transparent)`,
                boxShadow: `0 0 10px ${steps[activeStep].accentColor}`,
                zIndex: 4,
                animation: 'scanLaser 3s ease-in-out infinite'
              }} />

              <img 
                src={productImage} 
                alt="KANCHARA Formulation"
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 3,
                  filter: `drop-shadow(0 14px 24px ${steps[activeStep].accentColor}50)`,
                  transition: 'filter 0.8s ease',
                  animation: 'smoothFloat 6s ease-in-out infinite'
                }}
              />

              {/* Floating Stage Badge */}
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                background: steps[activeStep].accentColor,
                color: '#062319',
                fontWeight: 800,
                fontSize: '10px',
                padding: '4px 14px',
                borderRadius: '9999px',
                zIndex: 10,
                letterSpacing: '0.4px'
              }}>
                {steps[activeStep].badge}
              </div>
            </div>

            {/* Metric Counter Pill */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '14px',
              padding: '10px 16px',
              width: '100%',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                CLINICAL IMPACT RATING
              </span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 900, color: '#FBBF24' }}>
                {steps[activeStep].stat}
              </span>
            </div>
          </div>

          {/* Right Column: Step Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={idx}
                  className={`how-it-works-step-card ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveStep(idx);
                    setIsAutoPlaying(false);
                  }}
                  style={{
                    background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1.5px solid ${isActive ? step.accentColor : 'rgba(255, 255, 255, 0.08)'}`,
                    borderLeft: isActive ? `4px solid ${step.accentColor}` : '1.5px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '14px 18px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {isActive && isAutoPlaying && (
                    <div 
                      key={`progress-${activeStep}`}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '2.5px',
                        background: step.accentColor,
                        animation: 'autoProgressBar 4s linear forwards'
                      }}
                    />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: isActive ? step.accentColor : '#94A3B8', letterSpacing: '0.8px' }}>
                      {step.stage} • {step.subtitle}
                    </span>

                    {isActive && (
                      <span style={{ background: step.accentColor, color: '#062319', fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px' }}>
                        ACTIVE STAGE
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 800, margin: '0 0 4px', color: isActive ? '#ffffff' : '#CBD5E1' }}>
                    {step.title}
                  </h3>

                  {isActive && (
                    <p style={{ color: '#E6F7F2', fontSize: '12px', lineHeight: 1.45, margin: 0, animation: 'fadeIn 0.25s ease' }}>
                      {step.desc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes autoProgressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
        .how-it-works-step-card:hover {
          transform: translateX(6px) !important;
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.25) !important;
        }
        .how-it-works-step-card:hover h3 {
          color: #ffffff !important;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(0.96); opacity: 0.35; }
          50% { transform: scale(1.06); opacity: 0.8; }
        }
        @keyframes smoothFloat {
          0% { transform: scale(1.28) translateY(0px) rotate(0deg); }
          50% { transform: scale(1.28) translateY(-14px) rotate(1.8deg); }
          100% { transform: scale(1.28) translateY(0px) rotate(0deg); }
        }
        @keyframes scanLaser {
          0% { top: 12%; opacity: 0.15; }
          50% { top: 82%; opacity: 0.85; }
          100% { top: 12%; opacity: 0.15; }
        }
        @keyframes popBadge {
          0% { transform: scale(0.85); opacity: 0.4; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bio-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          opacity: 0.7;
          box-shadow: 0 0 10px currentColor;
        }
        .bio-particle.p1 { top: 20%; left: 15%; animation: floatParticle1 6s ease-in-out infinite; }
        .bio-particle.p2 { bottom: 25%; right: 15%; animation: floatParticle2 7s ease-in-out infinite; }
        .bio-particle.p3 { top: 60%; left: 10%; animation: floatParticle1 8s ease-in-out infinite; }
        @keyframes floatParticle1 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-16px) translateX(12px); opacity: 0.8; }
        }
        @keyframes floatParticle2 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(18px) translateX(-12px); opacity: 0.8; }
        }
      `}</style>
    </section>
  );
};
