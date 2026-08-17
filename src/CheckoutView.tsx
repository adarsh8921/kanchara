import React, { useState, useEffect } from 'react';
import type { Product } from './types';
import productImage from './assets/bottle.png';
import { submitCheckoutAPI, validateCouponAPI, fetchDeliveryAddressesAPI, addDeliveryAddressAPI, updateDeliveryAddressAPI, deleteDeliveryAddressAPI, fetchShowCustomer } from './api';
import { Icons } from './Icons';

const STATE_OPTIONS = [
  'karnataka (KA)',
  'andhra_pradesh (AP)',
  'arunachal_pradesh (AR)',
  'assam (AS)',
  'bihar (BR)',
  'chhattisgarh (CG)',
  'goa (GA)',
  'gujarat (GJ)',
  'haryana (HR)',
  'himachal_pradesh (HP)',
  'jharkhand (JH)',
  'kerala (KL)',
  'madhya_pradesh (MP)',
  'maharashtra (MH)',
  'manipur (MN)',
  'meghalaya (ML)',
  'mizoram (MZ)',
  'nagaland (NL)',
  'odisha (OD)',
  'punjab (PB)',
  'rajasthan (RJ)',
  'sikkim (SK)',
  'tamil_nadu (TN)',
  'telangana (TS)',
  'tripura (TR)',
  'uttar_pradesh (UP)',
  'uttarakhand (UK)',
  'west_bengal (WB)',
  'andaman_and_nicobar_islands (AN)',
  'chandigarh (CH)',
  'dadra_and_nagar_haveli_and_daman_and_diu (DN)',
  'delhi (DL)',
  'jammu_and_kashmir (JK)',
  'ladakh (LA)',
  'lakshadweep (LD)',
  'puducherry (PY)'
];

interface CheckoutViewProps {
  cartItems: Product[];
  cartTotal: number;
  paymentMethod: 'upi' | 'card' | 'cod';
  setPaymentMethod?: (m: 'upi' | 'card' | 'cod') => void;
  setCartItems: (items: Product[]) => void;
  setCurrentView: (view: 'home' | 'shop' | 'checkout' | 'assessment' | 'success') => void;
  isLoggedIn?: boolean;
  setShowAuthModal?: (show: boolean) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  cartTotal,
  paymentMethod = 'cod',
  setPaymentMethod,
  setCartItems,
  setCurrentView,
  isLoggedIn = false,
  setShowAuthModal
}) => {
  const [selectedPayment, setSelectedPayment] = useState<'cod' | 'online'>(paymentMethod === 'upi' || paymentMethod === 'card' ? 'online' : 'cod');
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
  const [cityName, setCityName] = useState('Bengaluru');
  const [selectedState, setSelectedState] = useState('karnataka (KA)');
  const [pincode, setPincode] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | number | null>(null);

  const matchStateOption = (rawState?: string) => {
    if (!rawState) return 'karnataka (KA)';
    const clean = rawState.toLowerCase().trim();
    const found = STATE_OPTIONS.find(opt => opt.toLowerCase().includes(clean) || clean.includes(opt.split(' ')[0]));
    return found || 'karnataka (KA)';
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('kanchara_user_data');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.first_name) setFirstName(u.first_name);
        if (u.last_name) setLastName(u.last_name);
        if (u.phone) setPhone(u.phone);
        if (u.address) setAddress(u.address);
        if (u.city) setCityName(u.city);
        if (u.state) setSelectedState(matchStateOption(u.state));
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
          if (cust.city) setCityName(cust.city);
          if (cust.state) setSelectedState(matchStateOption(cust.state));
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
          if (first.city) setCityName(first.city);
          if (first.state) setSelectedState(matchStateOption(first.state));
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

  const discountAmount = selectedPayment === 'online' ? Math.round(cartTotal * 0.05) : 0;
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

  const [formError, setFormError] = useState('');

  const handlePlaceOrder = async () => {
    setFormError('');
    if (!address.trim()) {
      setFormError('Please enter your complete delivery address.');
      return;
    }
    if (!pincode.trim()) {
      setFormError('Please enter your 6-digit delivery pincode.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Please enter your contact mobile number.');
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('kanchara_auth_token') || undefined;

    if (token && address.trim() && pincode.trim()) {
      const addressPayload = {
        phone: phone.trim() || '9999999999',
        address_line1: address.trim(),
        city: cityName.trim() || 'Bengaluru',
        state: selectedState,
        postal_code: pincode.trim(),
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
      delivery_state: selectedState,
      coupon_code: couponApplied ? (couponCode || 'SPECIAL150') : undefined,
      total_amount: Number(finalTotal),
      actual_total_amount: Number(cartTotal),
      session_id: sessionId,
      payment_method: selectedPayment === 'online' ? 'online_pay' : 'cash_on_delivery'
    };

    try {
      const res = await submitCheckoutAPI(payload, token);
      
      // Check if API returned an error
      if (!res || res.status === 'error' || res.status === 400 || res.status === 500 || (res.message && res.message.toLowerCase().includes('failed') && !res.order && !res.order_id)) {
        const errorDetail = res?.message || res?.error || 'Checkout could not be processed by server. Please try again.';
        setFormError(errorDetail);
        setIsSubmitting(false);
        return;
      }

      // Success
      setIsSubmitting(false);
      setCartItems([]);
      setCurrentView('success');
    } catch (e: any) {
      console.warn('Checkout submission exception:', e);
      setFormError(e?.message || 'Network error occurred while processing checkout.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#F8FAF9', minHeight: '100vh', paddingBottom: '80px', fontFamily: 'Inter, sans-serif' }}>
      {/* Checkout Navigation Bar / Breadcrumb */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #E2E8F0', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setCurrentView('shop')}
              style={{ background: '#F1F5F9', border: 'none', padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              ← Back to Shop
            </button>
            <span style={{ color: '#94A3B8' }}>|</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#0B3C2D', letterSpacing: '0.3px', fontFamily: 'Outfit, sans-serif' }}>
              🔒 SECURE CHECKOUT
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#166534' }}>
              <Icons.Shield /> 256-Bit SSL Encrypted
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Icons.Truck /> Free Express Delivery
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#0B3C2D' }}>
              <Icons.Doctor /> Free Doctor Consultation
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1200px', margin: '32px auto 0', padding: '0 24px' }}>
        
        {/* Account Login Status Card / Banner */}
        {!isLoggedIn ? (
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #FCD34D',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.08)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                👤
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#92400E', fontFamily: 'Outfit, sans-serif' }}>
                  Have an existing KANCHARA account?
                </div>
                <div style={{ fontSize: '12px', color: '#B45309', marginTop: '2px' }}>
                  Log in with OTP to autofill saved delivery addresses and sync your assessment.
                </div>
              </div>
            </div>
            {setShowAuthModal && (
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                style={{
                  background: '#0B3C2D',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(11, 60, 45, 0.2)'
                }}
              >
                Log In via OTP ➔
              </button>
            )}
          </div>
        ) : (
          <div style={{
            background: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            fontSize: '13px',
            color: '#166534',
            fontWeight: 700
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#22C55E', color: '#ffffff', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>✓</span>
              <span>Logged in as: <strong>{firstName ? `${firstName} ${lastName}`.trim() : (phone || 'Verified Patient')}</strong></span>
            </div>
            <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#15803D', padding: '3px 10px', borderRadius: '9999px', fontWeight: 800 }}>
              VERIFIED PATIENT SESSION
            </span>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '28px', alignItems: 'start' }}>
          
          {/* Left Column: Patient Address & Payment Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Step 1: Shipping Address Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '28px 32px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0B3C2D', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800 }}>1</span>
                  <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Shipping & Delivery Details
                  </h2>
                </div>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>All fields marked (*) required</span>
              </div>

              {/* Saved Delivery Addresses Quick Select */}
              {savedAddresses.length > 0 && (
                <div style={{ marginBottom: '20px', background: '#F4FAF7', padding: '14px 18px', borderRadius: '14px', border: '1px solid #A7F3D0' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#065F46', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Saved Addresses ({savedAddresses.length})
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
                        style={{
                          background: selectedAddressId === (addr.id || addr.address_id || addr.delivery_address_id) ? '#0B3C2D' : '#ffffff',
                          color: selectedAddressId === (addr.id || addr.address_id || addr.delivery_address_id) ? '#ffffff' : '#0F172A',
                          border: '1px solid #CBD5E1',
                          borderRadius: '10px',
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>📍 {addr.address_line1 || `Address #${idx + 1}`}</span>
                        <span 
                          onClick={(e) => handleDeleteAddress(addr.id || addr.address_id || addr.delivery_address_id, idx, e)}
                          style={{ color: selectedAddressId === (addr.id || addr.address_id || addr.delivery_address_id) ? '#FCA5A5' : '#EF4444', fontWeight: 800, paddingLeft: '4px', cursor: 'pointer' }}
                          title="Delete address"
                        >✕</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>First Name *</label>
                  <input 
                    type="text" 
                    placeholder="Enter first name"
                    value={firstName} 
                    onChange={e => setFirstName(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', background: '#F8FAFC', fontWeight: 600, boxSizing: 'border-box' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Last Name *</label>
                  <input 
                    type="text" 
                    placeholder="Enter last name"
                    value={lastName} 
                    onChange={e => setLastName(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', background: '#F8FAFC', fontWeight: 600, boxSizing: 'border-box' }} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Mobile Number (For WhatsApp Doctor Consultation & Delivery Alerts) *
                </label>
                <input 
                  type="tel" 
                  placeholder="Enter 10-digit mobile number"
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', background: '#F8FAFC', fontWeight: 600, boxSizing: 'border-box' }} 
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Complete House Address / Apartment / Street *</label>
                <input 
                  type="text" 
                  placeholder="House/Flat No, Building, Street Name, Area"
                  value={address} 
                  onChange={e => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', background: '#F8FAFC', fontWeight: 600, boxSizing: 'border-box' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Pincode *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 560001"
                    value={pincode} 
                    onChange={e => setPincode(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', background: '#F8FAFC', fontWeight: 600, boxSizing: 'border-box' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>City *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Bengaluru"
                    value={cityName} 
                    onChange={e => setCityName(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', background: '#F8FAFC', fontWeight: 600, boxSizing: 'border-box' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>State *</label>
                  <select
                    value={selectedState}
                    onChange={e => setSelectedState(e.target.value)}
                    style={{ width: '100%', padding: '11px 10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', background: '#F8FAFC', fontWeight: 600, boxSizing: 'border-box', cursor: 'pointer' }}
                  >
                    {STATE_OPTIONS.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Doctor Consultation Included Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #F0FDF4 0%, #E6F7F2 100%)',
              border: '1px solid #A7F3D0',
              borderRadius: '16px',
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#0B3C2D', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icons.Doctor />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#0B3C2D', fontFamily: 'Outfit, sans-serif' }}>
                  100% Free Doctor Consultation Included
                </div>
                <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px', lineHeight: 1.4 }}>
                  A certified trichologist will connect on WhatsApp within 24h to finalize your dosage plan.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Action Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              border: '1px solid #E2E8F0',
              position: 'sticky',
              top: '90px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Order Summary
                </h2>
                <span style={{ background: '#E6F7F2', color: '#0B3C2D', fontSize: '12px', fontWeight: 800, padding: '3px 10px', borderRadius: '9999px' }}>
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                {cartItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', background: '#F8FAFC', padding: '10px 12px', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#ffffff', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0', flexShrink: 0 }}>
                        {item.iconComponent || <img src={productImage} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '13px' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>✓ Clinical Formulation</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: '#0B3C2D', fontSize: '14px' }}>₹{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Field */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter Coupon / Promo Code"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    style={{ flexGrow: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', fontWeight: 600, background: '#F8FAFC' }}
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    style={{ background: '#0B3C2D', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && (
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#269474', marginTop: '6px' }}>
                    {couponMsg}
                  </div>
                )}
              </div>

              {/* Price Calculation Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #F1F5F9', paddingTop: '16px', marginBottom: '20px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Items Subtotal</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>₹{cartTotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#269474', fontWeight: 700 }}>
                  <span>Doctor Consultation</span>
                  <span>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#269474', fontWeight: 700 }}>
                  <span>Express Courier Delivery</span>
                  <span>FREE</span>
                </div>

                {selectedPayment === 'online' && discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534', fontWeight: 800 }}>
                    <span>Online Payment 5% Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                {couponApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0B3C2D', fontWeight: 800 }}>
                    <span>Special Coupon Discount</span>
                    <span>-₹{activeCouponDiscount}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #0F172A', paddingTop: '14px', marginTop: '4px', fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  <span>Total Payable:</span>
                  <span style={{ color: '#0B3C2D' }}>₹{finalTotal}</span>
                </div>
              </div>

              {/* Step 2: Payment Method Selection */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
                    Payment Mode:
                  </span>
                  <span style={{ fontSize: '11px', color: '#166534', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <Icons.Shield /> 100% Encrypted
                  </span>
                </div>

                {/* Sleek Segmented Switcher / Modern Radio List */}
                <div style={{
                  display: 'flex',
                  background: '#F1F5F9',
                  padding: '4px',
                  borderRadius: '12px',
                  gap: '4px'
                }}>
                  {/* Option 1: Cash On Delivery */}
                  <div
                    onClick={() => {
                      setSelectedPayment('cod');
                      if (setPaymentMethod) setPaymentMethod('cod');
                    }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      borderRadius: '9px',
                      background: selectedPayment === 'cod' ? '#0B3C2D' : 'transparent',
                      color: selectedPayment === 'cod' ? '#ffffff' : '#475569',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedPayment === 'cod' ? '0 2px 8px rgba(11, 60, 45, 0.2)' : 'none'
                    }}
                  >
                    <span>💵</span>
                    <span>Cash on Delivery</span>
                  </div>

                  {/* Option 2: Online Pay */}
                  <div
                    onClick={() => {
                      setSelectedPayment('online');
                      if (setPaymentMethod) setPaymentMethod('upi');
                    }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 12px',
                      borderRadius: '9px',
                      background: selectedPayment === 'online' ? '#0B3C2D' : 'transparent',
                      color: selectedPayment === 'online' ? '#ffffff' : '#475569',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedPayment === 'online' ? '0 2px 8px rgba(11, 60, 45, 0.2)' : 'none'
                    }}
                  >
                    <span>⚡</span>
                    <span>Online Pay</span>
                    <span style={{
                      background: selectedPayment === 'online' ? '#FBBF24' : '#DCFCE7',
                      color: selectedPayment === 'online' ? '#0B3C2D' : '#166534',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '9999px'
                    }}>
                      5% OFF
                    </span>
                  </div>
                </div>
              </div>

              {formError && (
                <div style={{
                  background: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  marginBottom: '14px',
                  textAlign: 'center'
                }}>
                  ⚠️ {formError}
                </div>
              )}

              {/* Order Submit Button */}
              <button 
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
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
                  boxShadow: '0 8px 24px rgba(11, 60, 45, 0.28)',
                  transition: 'all 0.2s ease',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Processing Order...' : 'CONFIRM & PLACE ORDER ➔'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span>🛡️ 256-Bit SSL Encrypted</span>
                <span>•</span>
                <span>📦 Dispatched in 24 Hours</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
