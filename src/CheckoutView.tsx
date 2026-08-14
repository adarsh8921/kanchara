import React, { useState, useEffect } from 'react';
import type { Product } from './types';
import productImage from './assets/bottle.png';
import { submitCheckoutAPI, validateCouponAPI, fetchDeliveryAddressesAPI, addDeliveryAddressAPI, updateDeliveryAddressAPI, deleteDeliveryAddressAPI, fetchShowCustomer } from './api';
import { Icons } from './Icons';

interface CheckoutViewProps {
  cartItems: Product[];
  cartTotal: number;
  paymentMethod: 'upi' | 'card' | 'cod';
  setPaymentMethod?: (m: 'upi' | 'card' | 'cod') => void;
  setCartItems: (items: Product[]) => void;
  setCurrentView: (view: 'home' | 'shop' | 'checkout' | 'assessment' | 'success') => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  cartTotal,
  paymentMethod,
  setCartItems,
  setCurrentView
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Patient Address Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cityState, setCityState] = useState('');
  const [pincode, setPincode] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | number | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('kanchara_user_data');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.first_name) setFirstName(u.first_name);
        if (u.last_name) setLastName(u.last_name);
        if (u.phone) setPhone(u.phone);
        if (u.address) setAddress(u.address);
        if (u.city || u.state) setCityState([u.city, u.state].filter(Boolean).join(', '));
        if (u.zip || u.postal_code) setPincode(u.zip || u.postal_code);
      } catch (e) {}
    } else {
      const savedPhone = localStorage.getItem('kanchara_user_phone');
      if (savedPhone) setPhone(savedPhone);
    }

    const token = localStorage.getItem('kanchara_auth_token');
    if (token) {
      fetchShowCustomer(token).then(cust => {
        if (cust) {
          if (cust.first_name) setFirstName(cust.first_name);
          if (cust.last_name) setLastName(cust.last_name);
          if (cust.phone) setPhone(cust.phone);
          if (cust.address) setAddress(cust.address);
          if (cust.city || cust.state) setCityState([cust.city, cust.state].filter(Boolean).join(', '));
          if (cust.zip || cust.postal_code) setPincode(cust.zip || cust.postal_code);
        }
      }).catch(() => {});

      fetchDeliveryAddressesAPI(token).then(data => {
        const list = Array.isArray(data) ? data : (data?.addresses || data?.data || []);
        if (Array.isArray(list) && list.length > 0) {
          setSavedAddresses(list);
          const first = list[0];
          setSelectedAddressId(first.id || first.address_id || first.delivery_address_id || null);
          if (first.address_line1) setAddress(first.address_line1);
          if (first.city || first.state) setCityState([first.city, first.state].filter(Boolean).join(', '));
          if (first.postal_code) setPincode(first.postal_code);
          if (first.phone) setPhone(first.phone);
        }
      }).catch(err => {
        console.warn('GET /api/delivery-address error:', err);
      });
    }
  }, []);

  const handleDeleteAddress = (addrId: string | number, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem('kanchara_auth_token');
    if (token && addrId) {
      deleteDeliveryAddressAPI(addrId, token).catch(err => {
        console.warn('DELETE /api/delivery-address/{id} error:', err);
      });
    }
    setSavedAddresses(prev => prev.filter((_, i) => i !== idx));
    if (selectedAddressId === addrId) {
      setSelectedAddressId(null);
    }
  };

  const discountAmount = paymentMethod === 'upi' ? Math.round(cartTotal * 0.05) : 0;
  const activeCouponDiscount = couponApplied ? (couponDiscount || 150) : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount - activeCouponDiscount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponMsg('Validating coupon...');
    const res = await validateCouponAPI(couponCode.trim(), cartTotal);
    if (res && (res.status === 'success' || res.valid || res.discount)) {
      setCouponApplied(true);
      setCouponDiscount(Number(res.discount || 150));
      setCouponMsg('✓ Coupon Code Applied Successfully!');
    } else {
      setCouponApplied(true);
      setCouponDiscount(150);
      setCouponMsg('✓ KANCHARA Special ₹150 Discount Applied!');
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem('kanchara_auth_token') || undefined;

    const parts = cityState.split(',').map(s => s.trim()).filter(Boolean);
    const stateName = parts.length > 1 ? parts[1] : (parts[0] || 'Karnataka');
    const cityName = parts[0] || 'Bengaluru';

    if (token) {
      const addressPayload = {
        phone: phone,
        address_line1: address,
        city: cityName,
        state: stateName,
        postal_code: pincode,
        country: 'India',
        is_default: true
      };

      if (selectedAddressId) {
        updateDeliveryAddressAPI(selectedAddressId, addressPayload, token).catch(err => {
          console.warn('PUT /api/delivery-address/{id} error:', err);
        });
      } else {
        addDeliveryAddressAPI(addressPayload, token).catch(err => {
          console.warn('POST /api/delivery-address error:', err);
        });
      }
    }

    const sessionId = localStorage.getItem('kanchara_session_id') || `sess_${Date.now()}`;
    const payload = {
      delivery_state: stateName,
      coupon_code: couponApplied ? (couponCode || 'SPECIAL150') : undefined,
      total_amount: finalTotal,
      actual_total_amount: cartTotal,
      session_id: sessionId,
      payment_method: paymentMethod || 'cod'
    };

    await submitCheckoutAPI(payload, token);
    setIsSubmitting(false);
    setCartItems([]);
    setCurrentView('success');
  };

  return (
    <div style={{ background: '#F4FAF7', minHeight: '100vh', paddingBottom: '100px', fontFamily: 'Inter, sans-serif' }}>
      {/* Premium Luxury Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #041D15 0%, #0B3C2D 50%, #135541 100%)',
        color: '#ffffff',
        padding: '50px 24px 70px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Ambient Radial Glow */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(50, 182, 144, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '850px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '6px 18px', borderRadius: '9999px', marginBottom: '18px' }}>
            <span style={{ color: '#FBBF24', display: 'flex', alignItems: 'center' }}><Icons.Shield /></span>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#FEF3C7' }}>256-BIT BANK GRADE ENCRYPTED CHECKOUT</span>
          </div>

          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '38px', fontWeight: 800, margin: '0 0 12px', color: '#ffffff', letterSpacing: '-0.5px' }}>
            Complete Your Clinical Regrowth Order
          </h1>
          <p style={{ color: '#E6F7F2', fontSize: '15px', margin: 0, lineHeight: 1.6, opacity: 0.9 }}>
            Doctor Formulated • Free Express Shipping • Dispatched in 24 Hours with Live Courier Tracking
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1240px', margin: '-40px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        {/* Glassmorphic Step Indicator Bar */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '20px 36px',
          boxShadow: '0 12px 35px rgba(6, 35, 25, 0.06)',
          border: '1px solid rgba(19, 85, 65, 0.1)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginBottom: '36px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#0B3C2D', fontWeight: 800, fontSize: '14px' }}>
            <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0B3C2D', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', boxShadow: '0 4px 12px rgba(11, 60, 45, 0.25)' }}>✓</span>
            <span>Cart Items Verified</span>
          </div>
          <div style={{ width: '40px', height: '2px', background: '#32B690' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#0B3C2D', fontWeight: 800, fontSize: '14px' }}>
            <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #0B3C2D 0%, #135541 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', boxShadow: '0 4px 12px rgba(11, 60, 45, 0.3)' }}>2</span>
            <span>Shipping & Doctor Consultation</span>
          </div>
          <div style={{ width: '40px', height: '2px', background: '#E2E8F0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748B', fontWeight: 700, fontSize: '14px' }}>
            <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>3</span>
            <span>Order Confirmation</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', alignItems: 'start' }}>
          
          {/* Left Column: Patient & Delivery Address Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Shipping Address Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '36px',
              boxShadow: '0 10px 30px rgba(6, 35, 25, 0.05)',
              border: '1px solid rgba(19, 85, 65, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px' }}>
                <span style={{ color: '#0B3C2D', display: 'flex', alignItems: 'center' }}><Icons.Truck /></span>
                <div>
                  <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Patient Shipping & Doctor Contact Details
                  </h2>
                  <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>Used for prescription tracking and doorstep express delivery.</p>
                </div>
              </div>

              {/* Saved Delivery Addresses Quick Select */}
              {savedAddresses.length > 0 && (
                <div style={{ marginBottom: '20px', background: '#F0FDF4', padding: '12px 16px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#166534', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Saved Delivery Addresses ({savedAddresses.length})
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {savedAddresses.map((addr, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedAddressId(addr.id || addr.address_id || addr.delivery_address_id || null);
                          if (addr.address_line1) setAddress(addr.address_line1);
                          if (addr.city || addr.state) setCityState(`${addr.city || ''}, ${addr.state || ''}`);
                          if (addr.postal_code) setPincode(addr.postal_code);
                          if (addr.phone) setPhone(addr.phone);
                        }}
                        style={{ background: '#ffffff', border: '1px solid #86EFAC', borderRadius: '9999px', padding: '4px 12px', fontSize: '12px', fontWeight: 700, color: '#065F46', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <span>📍 {addr.address_line1 || `Address #${idx + 1}`}</span>
                        <span 
                          onClick={(e) => handleDeleteAddress(addr.id || addr.address_id || addr.delivery_address_id, idx, e)}
                          style={{ color: '#EF4444', fontWeight: 800, paddingLeft: '4px', cursor: 'pointer' }}
                          title="Delete address"
                        >✕</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>First Name *</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={e => setFirstName(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#F8FAFC', fontWeight: 600, transition: 'all 0.2s ease' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Name *</label>
                  <input 
                    type="text" 
                    value={lastName} 
                    onChange={e => setLastName(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#F8FAFC', fontWeight: 600, transition: 'all 0.2s ease' }} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Mobile Number (For WhatsApp Doctor Consultation & Delivery Alerts) *
                </label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#F8FAFC', fontWeight: 600 }} 
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Complete House Address / Apartment / Street *</label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={e => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#F8FAFC', fontWeight: 600 }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pincode *</label>
                  <input 
                    type="text" 
                    value={pincode} 
                    onChange={e => setPincode(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#F8FAFC', fontWeight: 600 }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>City & State *</label>
                  <input 
                    type="text" 
                    value={cityState} 
                    onChange={e => setCityState(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#F8FAFC', fontWeight: 600 }} 
                  />
                </div>
              </div>
            </div>

            {/* Doctor Consultation Included Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #F0FDF4 0%, #E6F7F2 100%)',
              border: '1px solid #32B690',
              borderRadius: '24px',
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#0B3C2D', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 18px rgba(11, 60, 45, 0.25)' }}>
                <Icons.Doctor />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '16px', color: '#0B3C2D', fontFamily: 'Outfit, sans-serif' }}>
                  100% FREE Doctor Consultation Included
                </div>
                <div style={{ fontSize: '13px', color: '#334155', marginTop: '4px', lineHeight: 1.5 }}>
                  A certified trichologist will connect via WhatsApp within 24 hours to guide your custom kit dosage and track your monthly progress.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Action Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 14px 40px rgba(6, 35, 25, 0.08)',
              border: '1px solid rgba(19, 85, 65, 0.1)',
              position: 'sticky',
              top: '100px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Order Summary
                </h2>
                <span style={{ background: '#E6F7F2', color: '#0B3C2D', fontSize: '12px', fontWeight: 800, padding: '4px 12px', borderRadius: '9999px' }}>
                  {cartItems.length} Formulations
                </span>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
                {cartItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', background: '#F8FAFC', padding: '10px 14px', borderRadius: '14px', border: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: '#F4FAF7', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0', flexShrink: 0 }}>
                        {item.iconComponent || <img src={productImage} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '13px' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>✓ Doctor Prescribed Kit</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: '#0B3C2D', fontSize: '15px' }}>₹{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Field */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter Promo / Coupon Code"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    style={{ flexGrow: 1, padding: '11px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', fontWeight: 600 }}
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    style={{ background: '#0B3C2D', color: '#ffffff', border: 'none', padding: '11px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '12px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(11, 60, 45, 0.2)' }}
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && (
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#269474', marginTop: '8px' }}>
                    {couponMsg}
                  </div>
                )}
              </div>

              {/* Price Calculation Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '18px', marginBottom: '24px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Items Subtotal</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>₹{cartTotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#269474', fontWeight: 700 }}>
                  <span>Doctor Consultation</span>
                  <span>FREE (₹500 Value)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#269474', fontWeight: 700 }}>
                  <span>Express Courier Delivery</span>
                  <span>FREE</span>
                </div>

                {couponApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0B3C2D', fontWeight: 800 }}>
                    <span>Special Coupon Discount</span>
                    <span>-₹{activeCouponDiscount}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #0F172A', paddingTop: '16px', marginTop: '6px', fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                  <span>Total Payable:</span>
                  <span style={{ color: '#0B3C2D' }}>₹{finalTotal}</span>
                </div>
              </div>

              {/* Order Submit Button */}
              <button 
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #0B3C2D 0%, #135541 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '18px',
                  borderRadius: '9999px',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '16px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 10px 28px rgba(11, 60, 45, 0.35)',
                  transition: 'all 0.25s ease',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Processing Order...' : 'CONFIRM & PLACE ORDER ➔'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Icons.Shield /> 256-Bit SSL Encrypted</span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Icons.Truck /> Dispatched in 24 Hours</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
