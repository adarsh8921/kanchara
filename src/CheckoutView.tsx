import React from 'react';
import type { Product } from './types';

interface CheckoutViewProps {
  cartItems: Product[];
  cartTotal: number;
  paymentMethod: 'upi' | 'card' | 'cod';
  setPaymentMethod: (m: 'upi' | 'card' | 'cod') => void;
  setCartItems: (items: Product[]) => void;
  setCurrentView: (view: 'home' | 'shop' | 'checkout' | 'success') => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  cartTotal,
  paymentMethod,
  setPaymentMethod,
  setCartItems,
  setCurrentView
}) => {
  return (
    <section className="section-checkout">
      <div className="section-header-center" style={{ marginBottom: '32px' }}>
        <span className="section-tag">SECURE ENCRYPTED CHECKOUT</span>
        <h2 className="section-heading">Complete Your Order</h2>
        <p className="section-subtitle">Doctor-formulated hair care shipped directly to your doorstep.</p>
      </div>

      <div className="checkout-grid">
        <div>
          {/* Shipping Address Form */}
          <div className="checkout-card-box">
            <h3>📍 Shipping Address</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" className="form-control" placeholder="John" defaultValue="Rahul" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" className="form-control" placeholder="Doe" defaultValue="Sharma" />
              </div>
            </div>

            <div className="form-group">
              <label>Mobile Number (For Doctor Consultation & Order Updates)</label>
              <input type="tel" className="form-control" placeholder="+91 98765 43210" defaultValue="+91 98765 43210" />
            </div>

            <div className="form-group">
              <label>Flat / House No. / Street Address</label>
              <input type="text" className="form-control" placeholder="Apartment, Street Name" defaultValue="42, Green Avenue, Sector 15" />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Pincode</label>
                <input type="text" className="form-control" placeholder="110001" defaultValue="560001" />
              </div>
              <div className="form-group">
                <label>City & State</label>
                <input type="text" className="form-control" placeholder="City" defaultValue="Bengaluru, Karnataka" />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="checkout-card-box">
            <h3>💳 Select Payment Method</h3>
            <div className="payment-options-group">
              <div 
                className={`payment-option-card ${paymentMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <span>⚡ UPI / QR (Google Pay, PhonePe, Paytm)</span>
                <span style={{ marginLeft: 'auto', color: 'var(--emerald-600)', fontSize: '12px' }}>INSTANT 5% OFF</span>
              </div>

              <div 
                className={`payment-option-card ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <span>💳 Credit / Debit Card / Netbanking</span>
              </div>

              <div 
                className={`payment-option-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <span>💵 Cash on Delivery (COD)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="order-summary-box">
          <h3>Order Summary ({cartItems.length} items)</h3>
          
          <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '20px' }}>
            {cartItems.map((item, idx) => (
              <div key={idx} className="summary-row">
                <span>{item.name}</span>
                <strong>₹{item.price}</strong>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Items Total:</span>
            <span>₹{cartTotal}</span>
          </div>
          <div className="summary-row">
            <span>Doctor Consultation Fee:</span>
            <span style={{ color: 'var(--emerald-600)', fontWeight: 700 }}>FREE</span>
          </div>
          <div className="summary-row">
            <span>Shipping & Express Delivery:</span>
            <span style={{ color: 'var(--emerald-600)', fontWeight: 700 }}>FREE</span>
          </div>

          {paymentMethod === 'upi' && (
            <div className="summary-row" style={{ color: 'var(--emerald-600)' }}>
              <span>UPI Instant Discount (5%):</span>
              <span>-₹{Math.round(cartTotal * 0.05)}</span>
            </div>
          )}

          <div className="summary-row total">
            <span>Total Amount:</span>
            <span>₹{paymentMethod === 'upi' ? Math.round(cartTotal * 0.95) : cartTotal}</span>
          </div>

          <button 
            className="btn-cta-main" 
            style={{ width: '100%', marginTop: '24px' }}
            onClick={() => {
              setCartItems([]);
              setCurrentView('success');
            }}
          >
            <span>PLACE CONFIRMED ORDER ➔</span>
          </button>

          <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--slate-500)', marginTop: '12px' }}>
            🔒 256-Bit Bank Grade SSL Encrypted Payment
          </p>
        </div>
      </div>
    </section>
  );
};
