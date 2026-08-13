import React, { useState } from 'react';

interface ProfileViewProps {
  userPhone: string;
  isLoggedIn: boolean;
  setShowAuthModal: (show: boolean) => void;
  handleLogout: () => void;
  setCurrentView: (view: 'home' | 'shop' | 'checkout' | 'assessment' | 'profile' | 'success') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userPhone,
  isLoggedIn,
  setShowAuthModal,
  handleLogout,
  setCurrentView
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'consultations' | 'prescriptions'>('profile');
  const [userName, setUserName] = useState('Rahul Sharma');
  const [userEmail, setUserEmail] = useState('rahul.sharma@example.com');
  const [savedAddress, setSavedAddress] = useState('42, Green Avenue, Sector 15, Bengaluru, Karnataka - 560001');
  const [isSaved, setIsSaved] = useState(false);

  const mockOrders = [
    {
      id: 'KC-892410',
      date: 'Aug 10, 2026',
      items: 'KANCHARA Complete 3-In-1 Regrowth Kit',
      total: 1804,
      status: 'Shipped (In Transit)',
      tracking: 'BlueDart #BD90123984'
    },
    {
      id: 'KC-712390',
      date: 'Jul 04, 2026',
      items: 'Procapil & Redensyl Scalp Serum',
      total: 899,
      status: 'Delivered',
      tracking: 'Delhivery #DL77239100'
    }
  ];

  const mockConsultations = [
    {
      doctor: 'Dr. Ananya Roy (BAMS, Senior Trichologist)',
      date: 'Aug 11, 2026 - 11:30 AM',
      type: 'WhatsApp Audio Consultation',
      status: 'Completed',
      notes: 'Prescribed Pitta Balance Oil + Minoxidil 5% formulation. Advised 8 glasses of water daily.'
    }
  ];

  if (!isLoggedIn) {
    return (
      <div style={{ background: '#F8FAF8', minHeight: '80vh', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: '#ffffff', padding: '48px 36px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(6, 35, 25, 0.08)' }}>
          <div style={{ fontSize: '54px', marginBottom: '16px' }}>👤</div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px' }}>User Account Login</h2>
          <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '28px' }}>Please login with your mobile number to view your prescribed treatments, order history & doctor consultations.</p>
          <button 
            onClick={() => setShowAuthModal(true)}
            style={{ width: '100%', background: '#0B3C2D', color: '#ffffff', border: 'none', padding: '14px 28px', borderRadius: '9999px', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}
          >
            Login / Signup via OTP ➔
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F8FAF8', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Luxury Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #062319 0%, #0B3C2D 60%, #135541 100%)',
        color: '#ffffff',
        padding: '50px 40px 70px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#FBBF24', color: '#062319', fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid rgba(255,255,255,0.2)' }}>
              {userName.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#FEF3C7', letterSpacing: '1px', textTransform: 'uppercase' }}>VERIFIED PATIENT ACCOUNT</div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px', fontWeight: 800, margin: '4px 0 0', color: '#ffffff' }}>{userName}</h1>
              <p style={{ margin: 0, color: '#E6F7F2', fontSize: '14px' }}>📱 {userPhone || '+91 98765 43210'} • ✉️ {userEmail}</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 22px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
          >
            Sign Out Account
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1200px', margin: '-40px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        {/* Navigation Tabs */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '12px 16px',
          boxShadow: '0 10px 30px rgba(6, 35, 25, 0.06)',
          border: '1px solid rgba(19, 85, 65, 0.1)',
          display: 'flex',
          gap: '10px',
          marginBottom: '32px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'profile', label: '👤 Account Info' },
            { id: 'orders', label: '📦 Orders & Tracking' },
            { id: 'consultations', label: '🩺 Doctor Consultations' },
            { id: 'prescriptions', label: '📋 Prescribed Treatment' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? '#0B3C2D' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#475569',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '36px', boxShadow: '0 10px 30px rgba(6, 35, 25, 0.05)', border: '1px solid rgba(19, 85, 65, 0.08)' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
              Personal Information & Address
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Full Name</label>
                <input type="text" value={userName} onChange={e => setUserName(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Email Address</label>
                <input type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }} />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Primary Delivery Address</label>
              <textarea rows={3} value={savedAddress} onChange={e => setSavedAddress(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
            </div>

            <button 
              onClick={() => { setIsSaved(true); setTimeout(() => setIsSaved(false), 2500); }}
              style={{ background: '#0B3C2D', color: '#ffffff', border: 'none', padding: '12px 28px', borderRadius: '9999px', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}
            >
              {isSaved ? '✓ Profile Saved Successfully!' : 'Save Account Details'}
            </button>
          </div>
        )}

        {activeTab === 'orders' && (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '36px', boxShadow: '0 10px 30px rgba(6, 35, 25, 0.05)', border: '1px solid rgba(19, 85, 65, 0.08)' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
              Order History & Live Courier Tracking
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mockOrders.map(order => (
                <div key={order.id} style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#0B3C2D' }}>ORDER #{order.id} • {order.date}</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '4px 0' }}>{order.items}</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>🚚 {order.tracking}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>₹{order.total}</div>
                    <span style={{ background: '#E6F7F2', color: '#0B3C2D', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '9999px', display: 'inline-block', marginTop: '4px' }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'consultations' && (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '36px', boxShadow: '0 10px 30px rgba(6, 35, 25, 0.05)', border: '1px solid rgba(19, 85, 65, 0.08)' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
              Your Doctor Consultations
            </h2>

            {mockConsultations.map((c, i) => (
              <div key={i} style={{ background: '#F4FAF7', border: '1px solid #32B690', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A' }}>🩺 {c.doctor}</div>
                  <span style={{ background: '#0B3C2D', color: '#FBBF24', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '9999px' }}>{c.status}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '10px' }}>📅 {c.date} • {c.type}</div>
                <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A', lineHeight: 1.5 }}>
                  <strong>Doctor Notes:</strong> {c.notes}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '36px', boxShadow: '0 10px 30px rgba(6, 35, 25, 0.05)', border: '1px solid rgba(19, 85, 65, 0.08)' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
              Custom Prescribed Formulation Plan
            </h2>

            <div style={{ background: 'linear-gradient(135deg, #062319 0%, #0B3C2D 100%)', borderRadius: '20px', padding: '28px', color: '#ffffff' }}>
              <span style={{ background: '#FBBF24', color: '#062319', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '9999px' }}>CUSTOM DIAGNOSIS</span>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 800, margin: '12px 0 8px', color: '#ffffff' }}>Stage 2 M-Shaped Receding Hairline & Crown Thinning</h3>
              <p style={{ color: '#E6F7F2', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                Your custom treatment synergizes 10,000 mcg Plant Biotin for root nutrition, 5% Minoxidil + Procapil serum for blood circulation, and Ayurvedic Herbal Pitta Oil for gut heat detox.
              </p>

              <button 
                onClick={() => setCurrentView('shop')}
                style={{ background: '#FBBF24', color: '#062319', border: 'none', padding: '12px 24px', borderRadius: '9999px', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}
              >
                Reorder Prescribed Kit ➔
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
