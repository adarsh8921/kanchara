import React from 'react';
import { Icons } from './Icons';
import brandLogoImg from './assets/b902c129-5d72-43c0-9663-bb7ba6ba92fa-removebg-preview.png';

interface HeaderProps {
  scrolled: boolean;
  currentView: 'home' | 'shop' | 'checkout' | 'assessment' | 'profile' | 'wishlist' | 'success';
  setCurrentView: (view: 'home' | 'shop' | 'checkout' | 'assessment' | 'profile' | 'wishlist' | 'success') => void;
  setShowCart: (show: boolean) => void;
  cartCount: number;
  wishlistCount?: number;
  isLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  scrolled,
  currentView,
  setCurrentView,
  setShowCart,
  cartCount,
  wishlistCount = 0,
  isLoggedIn
}) => {
  return (
    <>
      <header className={`navbar ${scrolled ? 'sticky glass-panel' : ''}`}>
        <div className="nav-container">
          <a href="#banner" className="brand-logo" onClick={(e) => { e.preventDefault(); setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <img src={brandLogoImg} alt="KANCHARA Logo" className="brand-logo-img" style={{ height: scrolled ? '40px' : '50px', width: 'auto', transition: 'all 0.25s ease' }} />
          </a>

          <nav className="nav-menu">
            <a href="#banner" className={`nav-link ${currentView === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>
            <a href="#three-sciences" className="nav-link" onClick={() => setCurrentView('home')}>3-Science Formula</a>
            <a href="#" className={`nav-link ${currentView === 'shop' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentView('shop'); }}>All Products Page</a>
            <a href="#stages" className="nav-link" onClick={() => setCurrentView('home')}>Hair Stages</a>
            <a href="#faq" className="nav-link" onClick={() => setCurrentView('home')}>Doctor FAQs</a>
          </nav>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className="btn-nav-accent" onClick={() => setCurrentView('assessment')}>
              Take Free Hair Test
            </button>

            <button 
              className={`btn-wishlist-nav ${wishlistCount > 0 ? 'has-items' : ''}`} 
              title="Saved Wishlist"
              onClick={() => setCurrentView('wishlist')}
            >
              <Icons.Heart filled={wishlistCount > 0} />
              {wishlistCount > 0 && (
                <span className="cart-badge-count">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button 
              className="btn-cart-nav icon-only" 
              title={isLoggedIn ? "User Profile" : "Login / Profile"}
              onClick={() => setCurrentView('profile')}
            >
              <Icons.User />
            </button>

            <button 
              className={`btn-cart-nav icon-only ${cartCount > 0 ? 'has-items' : ''}`} 
              title="Shopping Cart"
              onClick={() => setShowCart(true)}
            >
              <Icons.Cart />
              {cartCount > 0 && (
                <span className="cart-badge-count">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
