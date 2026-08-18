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
      padding: '80px 40px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glowing Orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(50, 182, 144, 0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(40px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(50px)'
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 5 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 60px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '6px 18px',
            borderRadius: '9999px',
            marginBottom: '16px'
          }}>
            <span style={{ color: '#FBBF24', fontSize: '12px' }}>⚡</span>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#FEF3C7' }}>
              INTERACTIVE FORMULATION MECHANISM
            </span>
          </div>

          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '38px', fontWeight: 800, margin: '0 0 16px', color: '#ffffff', letterSpacing: '-0.5px' }}>
            How KANCHARA Regrowth Formula Works
          </h2>

          <p style={{ color: '#E6F7F2', fontSize: '16px', lineHeight: 1.6, margin: 0 }}>
            Experience how our 3-Science synergistic formula reverses hair loss at the root cause step-by-step.
          </p>
        </div>

        {/* Animation Main Interactive Showcase Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Left Column: Product Interactive Animated Spotlight Showcase */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            borderRadius: '32px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '40px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Animated Pulse Waves around Product */}
            <div style={{
              position: 'relative',
              width: '300px',
              height: '340px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              {/* Orbital Ring 1 */}
              <div style={{
                position: 'absolute',
                inset: '-15px',
                borderRadius: '50%',
                border: `2px dashed ${steps[activeStep].accentColor}`,
                opacity: 0.5,
                animation: 'spin 10s linear infinite',
                transition: 'border-color 0.8s ease'
              }} />
              {/* Orbital Ring 2 (Reverse) */}
              <div style={{
                position: 'absolute',
                inset: '-35px',
                borderRadius: '50%',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                animation: 'spinReverse 16s linear infinite'
              }} />
              {/* Pulse Glow Background */}
              <div style={{
                position: 'absolute',
                inset: '-50px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${steps[activeStep].accentColor}35 0%, transparent 70%)`,
                animation: 'pulseGlow 2.5s ease-in-out infinite',
                transition: 'background 0.8s ease'
              }} />

              {/* Laser Scanning Beam */}
              <div style={{
                position: 'absolute',
                left: '10%',
                right: '10%',
                height: '3px',
                background: `linear-gradient(90deg, transparent, ${steps[activeStep].accentColor}, #ffffff, ${steps[activeStep].accentColor}, transparent)`,
                boxShadow: `0 0 15px ${steps[activeStep].accentColor}`,
                zIndex: 4,
                animation: 'scanLaser 3s ease-in-out infinite',
                transition: 'background 0.8s ease, box-shadow 0.8s ease'
              }} />

              {/* Floating Bio-Particles */}
              <div className="bio-particle p1" style={{ background: steps[activeStep].accentColor }} />
              <div className="bio-particle p2" style={{ background: '#FBBF24' }} />
              <div className="bio-particle p3" style={{ background: steps[activeStep].accentColor }} />

              {/* Product Bottle Image with Ultra-Smooth Continuous Morphing & Glow Transition */}
              <img 
                src={productImage} 
                alt="KANCHARA Formulation"
                style={{
                  maxHeight: '115%',
                  maxWidth: '115%',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 3,
                  filter: `drop-shadow(0 20px 35px ${steps[activeStep].accentColor}60) drop-shadow(0 8px 16px rgba(0,0,0,0.6))`,
                  transition: 'filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  animation: 'smoothFloat 6s ease-in-out infinite',
                  willChange: 'transform, filter',
                  transformStyle: 'preserve-3d'
                }}
              />

              {/* Floating Stage Badge */}
              <div style={{
                position: 'absolute',
                bottom: '-14px',
                background: steps[activeStep].accentColor,
                color: '#062319',
                fontWeight: 800,
                fontSize: '11px',
                padding: '7px 20px',
                borderRadius: '9999px',
                zIndex: 10,
                boxShadow: `0 10px 25px ${steps[activeStep].accentColor}60`,
                letterSpacing: '0.5px',
                animation: 'popBadge 0.4s ease'
              }}>
                {steps[activeStep].badge}
              </div>
            </div>

            {/* Live Clinical Metric Counter Pill */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              padding: '16px 24px',
              width: '100%',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                CLINICAL IMPACT RATING
              </span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: 800, color: '#FBBF24' }}>
                {steps[activeStep].stat}
              </span>
            </div>
          </div>

          {/* Right Column: Step-by-Step Interactive Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    borderLeft: isActive ? `5px solid ${step.accentColor}` : '1.5px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px',
                    padding: '24px 28px',
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: isActive ? `0 16px 36px ${step.accentColor}30` : 'none',
                    transform: isActive ? 'translateX(6px)' : 'translateX(0)'
                  }}
                >
                  {/* Active Step Auto-Progress Bar Indicator */}
                  {isActive && isAutoPlaying && (
                    <div 
                      key={`progress-${activeStep}`}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '3px',
                        background: step.accentColor,
                        animation: 'autoProgressBar 4s linear forwards'
                      }}
                    />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: isActive ? step.accentColor : '#94A3B8',
                      letterSpacing: '1px',
                      transition: 'color 0.3s ease'
                    }}>
                      {step.stage} • {step.subtitle}
                    </span>

                    {isActive && (
                      <span style={{
                        background: step.accentColor,
                        color: '#062319',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        boxShadow: `0 4px 12px ${step.accentColor}50`
                      }}>
                        ACTIVE STAGE
                      </span>
                    )}
                  </div>

                  <h3 style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '20px',
                    fontWeight: 800,
                    margin: '0 0 8px',
                    color: isActive ? '#ffffff' : '#CBD5E1',
                    transition: 'color 0.3s ease'
                  }}>
                    {step.title}
                  </h3>

                  {isActive && (
                    <p style={{
                      color: '#E6F7F2',
                      fontSize: '14px',
                      lineHeight: 1.6,
                      margin: 0,
                      animation: 'fadeIn 0.35s ease'
                    }}>
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
