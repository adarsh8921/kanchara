import React, { useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (view: 'home' | 'shop' | 'checkout' | 'assessment' | 'profile' | 'wishlist' | 'success', hashAnchor?: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    if (hashAnchor && view === 'home') {
      setTimeout(() => {
        const el = document.querySelector(hashAnchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`navbar ${scrolled ? 'sticky glass-panel' : ''}`}>
        <div className="nav-container">
          {/* Mobile Hamburger Button */}
          <button 
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          <a href="#banner" className="brand-logo" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
            <img src={brandLogoImg} alt="KANCHARA Logo" className="brand-logo-img" style={{ height: scrolled ? '36px' : '46px', width: 'auto', transition: 'all 0.25s ease' }} />
          </a>

          {/* Desktop Navigation */}
          <nav className="nav-menu desktop-only">
            <a href="#banner" className={`nav-link ${currentView === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a>
            <a href="#three-sciences" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('home', '#three-sciences'); }}>3-Science Formula</a>
            <a href="#" className={`nav-link ${currentView === 'shop' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('shop'); }}>All Products Page</a>
            <a href="#stages" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('home', '#stages'); }}>Hair Stages</a>
            <a href="#faq" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('home', '#faq'); }}>Doctor FAQs</a>
          </nav>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="btn-nav-accent desktop-only" onClick={() => navigateTo('assessment')}>
              Take Free Hair Test
            </button>

            <button 
              className={`btn-wishlist-nav ${wishlistCount > 0 ? 'has-items' : ''}`} 
              title="Saved Wishlist"
              onClick={() => navigateTo('wishlist')}
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
              onClick={() => navigateTo('profile')}
            >
              <Icons.User />
            </button>

            <button 
              className={`btn-cart-nav icon-only ${cartCount > 0 ? 'has-items' : ''}`} 
              title="Shopping Cart"
              onClick={() => { setShowCart(true); setMobileMenuOpen(false); }}
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

      {/* Mobile Slide-Over Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <img src={brandLogoImg} alt="KANCHARA Logo" style={{ height: '36px', width: 'auto' }} />
              <button className="btn-close-drawer" onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>

            <div className="mobile-drawer-body">
              <button className="mobile-nav-btn accent" onClick={() => navigateTo('assessment')}>
                ⚡ Take Free 3-Min Hair Test
              </button>

              <div className="mobile-nav-links">
                <button className={`mobile-nav-link ${currentView === 'home' ? 'active' : ''}`} onClick={() => navigateTo('home')}>
                  🏡 Home
                </button>
                <button className={`mobile-nav-link ${currentView === 'shop' ? 'active' : ''}`} onClick={() => navigateTo('shop')}>
                  🛍️ All Formulations & Shop
                </button>
                <button className="mobile-nav-link" onClick={() => navigateTo('home', '#three-sciences')}>
                  🌿 3-Science Formula
                </button>
                <button className="mobile-nav-link" onClick={() => navigateTo('home', '#stages')}>
                  📊 Select Hair Loss Stage
                </button>
                <button className="mobile-nav-link" onClick={() => navigateTo('home', '#faq')}>
                  ❓ Doctor FAQs
                </button>
                <button className={`mobile-nav-link ${currentView === 'profile' ? 'active' : ''}`} onClick={() => navigateTo('profile')}>
                  👤 Account Profile & Orders
                </button>
                <button className={`mobile-nav-link ${currentView === 'wishlist' ? 'active' : ''}`} onClick={() => navigateTo('wishlist')}>
                  ❤️ Saved Wishlist ({wishlistCount})
                </button>
              </div>
            </div>

            <div className="mobile-drawer-footer">
              <span>🛡️ ISO & Ayush Certified Formulations</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
