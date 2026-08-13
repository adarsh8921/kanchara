import React from 'react';
import { Icons } from './Icons';
import brandLogoImg from './assets/b902c129-5d72-43c0-9663-bb7ba6ba92fa-removebg-preview.png';

interface HeaderProps {
  scrolled: boolean;
  currentView: 'home' | 'shop' | 'checkout' | 'assessment' | 'profile' | 'success';
  setCurrentView: (view: 'home' | 'shop' | 'checkout' | 'assessment' | 'profile' | 'success') => void;
  setShowCart: (show: boolean) => void;
  cartCount: number;
  isLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  scrolled,
  currentView,
  setCurrentView,
  setShowCart,
  cartCount,
  isLoggedIn
}) => {
  return (
    <>
      <header className={`navbar ${scrolled ? 'sticky glass-panel' : ''}`}>
        <div className="nav-container">
          <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); setCurrentView('home'); }}>
            <img src={brandLogoImg} alt="KANCHARA Logo" className="brand-logo-img" style={{ height: '64px', width: 'auto' }} />
          </a>

          <nav className="nav-menu">
            <a href="#" className={`nav-link ${currentView === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentView('home'); }}>Home</a>
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
