import React, { useState } from 'react';
import type { Product } from './types';

interface CheckoutViewProps {
  cartItems: Product[];
  cartTotal: number;
  paymentMethod: 'upi' | 'card' | 'cod';
  setPaymentMethod: (m: 'upi' | 'card' | 'cod') => void;
  setCartItems: (items: Product[]) => void;
  setCurrentView: (view: 'home' | 'shop' | 'checkout' | 'assessment' | 'success') => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  cartTotal,
  paymentMethod,
  setPaymentMethod,
  setCartItems,
  setCurrentView
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const discountAmount = paymentMethod === 'upi' ? Math.round(cartTotal * 0.05) : 0;
  const couponDiscount = couponApplied ? 150 : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount - couponDiscount);

  return (
    <div style={{ background: '#F8FAF8', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Luxury Checkout Header */}
      <div style={{
        background: 'linear-gradient(135deg, #062319 0%, #0B3C2D 60%, #135541 100%)',
        color: '#ffffff',
        padding: '40px 40px 60px',
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
            🔒 256-BIT BANK GRADE ENCRYPTED CHECKOUT
          </span>

          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '36px', fontWeight: 800, margin: '14px 0 10px', color: '#ffffff' }}>
            Complete Your Clinical Formulation Order
          </h1>
          <p style={{ color: '#E6F7F2', fontSize: '15px', margin: 0, lineHeight: 1.5 }}>
            Formulated by trichologists & Ayurvedic doctors • Express Dispatched within 24 Hours
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1240px', margin: '-30px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        {/* Step Indicator Bar */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '16px 32px',
          boxShadow: '0 10px 30px rgba(6, 35, 25, 0.06)',
          border: '1px solid rgba(19, 85, 65, 0.1)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0B3C2D', fontWeight: 800, fontSize: '14px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0B3C2D', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>1</span>
            <span>Cart Items Verified</span>
          </div>
          <div style={{ width: '40px', height: '2px', background: '#E2E8F0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0B3C2D', fontWeight: 800, fontSize: '14px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0B3C2D', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>2</span>
            <span>Shipping & Doctor Consultation</span>
          </div>
          <div style={{ width: '40px', height: '2px', background: '#E2E8F0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748B', fontWeight: 700, fontSize: '14px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>3</span>
            <span>Payment & Dispatch</span>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', alignItems: 'start' }}>
          
          {/* Left Column: Delivery Form & Payment Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Shipping Address Box */}
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 10px 30px rgba(6, 35, 25, 0.05)',
              border: '1px solid rgba(19, 85, 65, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px' }}>
                <span style={{ fontSize: '20px' }}>📍</span>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Shipping & Doctor Contact Details
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>First Name</label>
                  <input type="text" defaultValue="Rahul" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#F8FAFC' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Last Name</label>
                  <input type="text" defaultValue="Sharma" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#F8FAFC' }} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Mobile Number (For WhatsApp Doctor Follow-Up)
                </label>
                <input type="tel" defaultValue="+91 98765 43210" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#F8FAFC' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Complete Street Address / Apartment</label>
                <input type="text" defaultValue="42, Green Avenue, Sector 15" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#F8FAFC' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Pincode</label>
                  <input type="text" defaultValue="560001" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#F8FAFC' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>City & State</label>
                  <input type="text" defaultValue="Bengaluru, Karnataka" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#F8FAFC' }} />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 10px 30px rgba(6, 35, 25, 0.05)',
              border: '1px solid rgba(19, 85, 65, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px' }}>
                <span style={{ fontSize: '20px' }}>💳</span>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Select Payment Option
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* UPI */}
                <div 
                  onClick={() => setPaymentMethod('upi')}
                  style={{
                    border: `2px solid ${paymentMethod === 'upi' ? '#0B3C2D' : '#E2E8F0'}`,
                    background: paymentMethod === 'upi' ? '#F0FDF4' : '#ffffff',
                    borderRadius: '16px',
                    padding: '18px 22px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '22px' }}>⚡</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '15px' }}>UPI / QR Instant Pay (GPay, PhonePe, Paytm)</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Fastest dispatch & zero COD verification delay</div>
                    </div>
                  </div>
                  <span style={{ background: '#0B3C2D', color: '#FBBF24', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '9999px' }}>
                    EXTRA 5% OFF
                  </span>
                </div>

                {/* Card / Netbanking */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    border: `2px solid ${paymentMethod === 'card' ? '#0B3C2D' : '#E2E8F0'}`,
                    background: paymentMethod === 'card' ? '#F0FDF4' : '#ffffff',
                    borderRadius: '16px',
                    padding: '18px 22px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '22px' }}>💳</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '15px' }}>Credit / Debit Card & Netbanking</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Visa, MasterCard, RuPay, HDFC, ICICI, SBI</div>
                    </div>
                  </div>
                </div>

                {/* COD */}
                <div 
                  onClick={() => setPaymentMethod('cod')}
                  style={{
                    border: `2px solid ${paymentMethod === 'cod' ? '#0B3C2D' : '#E2E8F0'}`,
                    background: paymentMethod === 'cod' ? '#F0FDF4' : '#ffffff',
                    borderRadius: '16px',
                    padding: '18px 22px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '22px' }}>💵</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '15px' }}>Cash on Delivery (COD)</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Pay cash upon doorstep delivery</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Guarantee Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 10px 30px rgba(6, 35, 25, 0.06)',
              border: '1px solid rgba(19, 85, 65, 0.1)',
              position: 'sticky',
              top: '100px'
            }}>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 20px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
                Order Summary ({cartItems.length} Formulations)
              </h2>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', maxHeight: '220px', overflowY: 'auto' }}>
                {cartItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F4FAF7', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.iconComponent}
                      </div>
                      <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '13px' }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: 800, color: '#0B3C2D' }}>₹{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Field */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <input 
                  type="text" 
                  placeholder="Promo / Doctor Code"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  style={{ flexGrow: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                />
                <button 
                  onClick={() => {
                    if (couponCode.trim()) setCouponApplied(true);
                  }}
                  style={{ background: '#0B3C2D', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                >
                  Apply
                </button>
              </div>

              {/* Price Calculation Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #F1F5F9', paddingTop: '16px', marginBottom: '24px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Items Subtotal</span>
                  <span style={{ fontWeight: 700 }}>₹{cartTotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#269474', fontWeight: 700 }}>
                  <span>Doctor Consultation</span>
                  <span>FREE (₹500 Value)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#269474', fontWeight: 700 }}>
                  <span>Express Courier Delivery</span>
                  <span>FREE</span>
                </div>

                {paymentMethod === 'upi' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0B3C2D', fontWeight: 700 }}>
                    <span>UPI Discount (5%)</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                {couponApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0B3C2D', fontWeight: 700 }}>
                    <span>Special Coupon Code</span>
                    <span>-₹150</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #0F172A', paddingTop: '14px', marginTop: '6px', fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  <span>Total Payable:</span>
                  <span style={{ color: '#0B3C2D' }}>₹{finalTotal}</span>
                </div>
              </div>

              {/* Order Submit Button */}
              <button 
                onClick={() => {
                  setCartItems([]);
                  setCurrentView('success');
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #0B3C2D 0%, #135541 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '9999px',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(11, 60, 45, 0.3)',
                  transition: 'transform 0.2s ease'
                }}
              >
                PLACE CONFIRMED ORDER ➔
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span>🔒 Safe & Encrypted</span>
                <span>•</span>
                <span>📦 Dispatched in 24 hrs</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

