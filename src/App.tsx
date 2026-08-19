import { useState, useEffect } from 'react';
import './App.css';
import hairImg from './assets/hair.png';
import heroBannerImg from './assets/ChatGPT Image Aug 11, 2026, 03_43_03 PM.png';
import brandLogoImg from './assets/b902c129-5d72-43c0-9663-bb7ba6ba92fa-removebg-preview.png';
import productImage from './assets/bottle.png';
import type { Product } from './types';
import { stageData, quizQuestions } from './types';
import { Icons } from './Icons';
import { Header } from './Header';
import { ProductCard } from './ProductCard';
import { ShopCatalog } from './ShopCatalog';
import { CheckoutView } from './CheckoutView';
import { HairTestView } from './HairTestView';
import { HowItWorksAnimation } from './HowItWorksAnimation';
import { ProfileView } from './ProfileView';
import { WishlistView } from './WishlistView';
import { fetchProductsFromAPI, fetchTopSellingProducts, fetchFeaturedProducts, addToCartAPI, fetchCartAPI, removeFromCartAPI, updateCartCountAPI, trackCheckoutClickAPI, fetchWishlistAPI, toggleWishlistAPI } from './api';

export default function App() {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('kanchara_wishlist_ids');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) { }
    }
    return new Set();
  });
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'men' | 'women'>('men');
  const [stage, setStage] = useState<number>(2);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [showHairTest, setShowHairTest] = useState<boolean>(false);

  const [currentView, setCurrentViewRaw] = useState<'home' | 'shop' | 'checkout' | 'assessment' | 'profile' | 'wishlist' | 'success'>(() => {
    const hash = window.location.hash.replace('#', '');
    if (['home', 'shop', 'checkout', 'assessment', 'profile', 'wishlist', 'success'].includes(hash)) {
      return hash as any;
    }
    const saved = localStorage.getItem('kanchara_current_view');
    if (saved && ['home', 'shop', 'checkout', 'assessment', 'profile', 'wishlist', 'success'].includes(saved)) {
      return saved as any;
    }
    return 'home';
  });

  const setCurrentView = (view: 'home' | 'shop' | 'checkout' | 'assessment' | 'profile' | 'wishlist' | 'success') => {
    setCurrentViewRaw(view);
    localStorage.setItem('kanchara_current_view', view);
    try {
      window.history.replaceState(null, '', `#${view}`);
    } catch (e) { }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'shop', 'checkout', 'assessment', 'profile', 'wishlist', 'success'].includes(hash)) {
        setCurrentViewRaw(hash as any);
        localStorage.setItem('kanchara_current_view', hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // E-Commerce State
  const [productCategory, setProductCategory] = useState<string>('all');
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);

  // Hair Diagnostic Quiz State
  const [quizStep, setQuizStep] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section, .how-it-works-animation-section');
    sections.forEach((s) => observer.observe(s));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach((s) => observer.unobserve(s));
    };
  }, [currentView]);

  const initialProducts: Product[] = [
    {
      id: 'p1',
      name: 'KANCHARA Complete Regrowth Kit',
      category: 'kits',
      price: 1899,
      originalPrice: 2899,
      rating: 4.9,
      reviewsCount: 3840,
      badge: 'BESTSELLER',
      desc: '3-In-1 Synergistic System: Ayurveda Pitta Oil + 5% Redensyl & Procapil Serum + Plant Biotin Tablets.',
      iconComponent: <img src={productImage} alt="KANCHARA Complete Regrowth Kit" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    },
    {
      id: 'p2',
      name: 'Advanced Scalp Peptide Serum',
      category: 'serums',
      price: 899,
      originalPrice: 1299,
      rating: 4.9,
      reviewsCount: 1420,
      badge: 'CLINICAL GRADE',
      desc: '5% Capixyl + Anagain formula designed to extend hair growth phase and block scalp DHT.',
      iconComponent: <img src={productImage} alt="Advanced Scalp Peptide Serum" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    },
    {
      id: 'p3',
      name: 'Ayurvedic Pitta Detox Hair Oil',
      category: 'ayurveda',
      price: 549,
      originalPrice: 799,
      rating: 4.8,
      reviewsCount: 980,
      badge: '100% HERBAL',
      desc: 'Kshirapak vidhi infused oil with Bhringraj, Amla & Rosemary to cool scalp heat and stop hair fall.',
      iconComponent: <img src={productImage} alt="Ayurvedic Pitta Detox Hair Oil" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    },
    {
      id: 'p4',
      name: 'Plant Biotin & Zinc Multivitamins',
      category: 'nutrition',
      price: 699,
      originalPrice: 999,
      rating: 4.7,
      reviewsCount: 1120,
      badge: 'DAILY ESSENTIAL',
      desc: '10,000 mcg Sesbania plant biotin with essential iron, zinc, and amino acid complexes.',
      iconComponent: <img src={productImage} alt="Plant Biotin & Zinc Multivitamins" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    },
    {
      id: 'p5',
      name: 'Anti-DHT Hair Control Shampoo',
      category: 'serums',
      price: 499,
      originalPrice: 699,
      rating: 4.8,
      reviewsCount: 740,
      badge: 'SULPHATE FREE',
      desc: 'Gentle cleanser with Saw Palmetto and Caffeine to cleanse scalp pores and prevent shedding.',
      iconComponent: <img src={productImage} alt="Anti-DHT Hair Control Shampoo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    },
    {
      id: 'p6',
      name: 'Scalp Detox & Gut Health Elixir',
      category: 'ayurveda',
      price: 649,
      originalPrice: 849,
      rating: 4.9,
      reviewsCount: 430,
      badge: 'GUT SPECIALIST',
      desc: 'Ayurvedic syrup designed to clear Ama toxins, boost nutrient absorption, & stop hair root decay.',
      iconComponent: <img src={productImage} alt="Scalp Detox & Gut Health Elixir" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    }
  ];

  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    Promise.all([
      fetchProductsFromAPI(),
      fetchTopSellingProducts(),
      fetchFeaturedProducts()
    ]).then(([prodRes]) => {
      const rawProducts = Array.isArray(prodRes) ? prodRes : (prodRes?.products || prodRes?.data || []);
      const sourceList = rawProducts.length > 0 ? rawProducts : initialProducts;

      const mapped: Product[] = sourceList.map((item: any, idx: number) => {
        const imgUrl = item.primary_image ? `${item.image_path || 'https://kanchara.datacubeglobal.com/storage'}/${item.primary_image}` : productImage;
        return {
          id: String(item.product_id || item.id || `api-${idx}`),
          product_id: item.product_id || item.id,
          name: item.product_name || item.name || item.title || `Formulation #${idx + 1}`,
          desc: item.description || item.desc || item.subtitle || 'Doctor formulated 3-Science Regrowth Solution',
          price: Number(item.special_price || item.price || item.unit_price || 999),
          originalPrice: Number(item.mrp || item.original_price || (Number(item.special_price || item.price || 999) + 400)),
          rating: Number(item.rating || 4.9),
          reviewsCount: Number(item.reviews_count || item.total_reviews || 128 + idx * 12),
          badge: item.badge || item.tag || (idx % 2 === 0 ? 'CLINICALLY PROVEN' : 'DOCTOR FORMULATED'),
          category: item.category || item.category_name || (idx % 4 === 0 ? 'kits' : idx % 4 === 1 ? 'serums' : idx % 4 === 2 ? 'ayurveda' : 'nutrition'),
          benefits: item.benefits || ['Root Revitalization', 'Scalp Circulation', 'Zero Toxins'],
          formula: item.formula || 'Ayurveda + Procapil + Nutrients',
          iconComponent: (
            <img
              src={imgUrl}
              alt={item.product_name || item.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = productImage;
              }}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          )
        };
      });

      const unique = Array.from(new Map(mapped.map(p => [p.name, p])).values());
      setProducts(unique);
    }).catch(err => {
      console.warn('Failed to load products from API on mount:', err);
    });
  }, []);

  const resolveRealProductId = (item: any): string | number => {
    if (item.product_id && String(item.product_id).startsWith('eyJ')) {
      return item.product_id;
    }
    const itemName = (item.product_name || item.name || item.title || '').trim().toLowerCase();
    const matched = products.find(p =>
      (p.name && p.name.trim().toLowerCase() === itemName) ||
      (p.product_id && String(p.product_id) === String(item.product_id)) ||
      (p.id && String(p.id) === String(item.id))
    );
    if (matched?.product_id) return matched.product_id;
    if (matched?.id) return matched.id;
    return item.product_id || item.id;
  };

  const addToCart = (product: Product) => {
    const targetProductId = resolveRealProductId(product);
    setCartItems(prev => [...prev, { ...product, product_id: targetProductId }]);
    setShowCart(true);

    const token = userToken || localStorage.getItem('kanchara_auth_token') || undefined;
    addToCartAPI(targetProductId, 1, undefined, token).catch(err => {
      console.warn('POST /api/cart error:', err);
    });
  };

  const removeFromCart = (index: number) => {
    const itemToRemove = cartItems[index];
    setCartItems(prev => prev.filter((_, i) => i !== index));

    if (itemToRemove) {
      const targetProductId = resolveRealProductId(itemToRemove);
      const token = userToken || localStorage.getItem('kanchara_auth_token') || undefined;
      removeFromCartAPI(targetProductId, token).catch(err => {
        console.warn('POST /api/cart/remove-item error:', err);
      });
    }
  };

  const updateCartQuantity = (product: Product, newCount: number) => {
    const idx = cartItems.findIndex(i => i.name === product.name || (i.product_id || i.id) === (product.product_id || product.id));
    if (newCount <= 0) {
      if (idx !== -1) removeFromCart(idx);
      return;
    }

    const targetProductId = resolveRealProductId(product);
    const token = userToken || localStorage.getItem('kanchara_auth_token') || undefined;
    updateCartCountAPI(targetProductId, newCount, token).catch(err => {
      console.warn('POST /api/cart/update-count error:', err);
    });
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleQuizSelect = (option: string) => {
    const currentQ = quizQuestions[quizStep];
    setQuizAnswers(prev => ({ ...prev, [currentQ.id]: option }));
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      setQuizStep(quizQuestions.length);
    }
  };

  // Authentication State with Live API Integration & LocalStorage Session Persistence
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('kanchara_is_logged_in') === 'true';
  });
  const [userPhone, setUserPhone] = useState<string>(() => {
    return localStorage.getItem('kanchara_user_phone') || '';
  });
  const [userData, setUserData] = useState<any>(() => {
    const saved = localStorage.getItem('kanchara_user_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [userToken, setUserToken] = useState<string>(() => {
    return localStorage.getItem('kanchara_auth_token') || '';
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authStep, setAuthStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [authInput, setAuthInput] = useState<string>('');
  const [authOtp, setAuthOtp] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(true);

  useEffect(() => {
    const token = userToken || localStorage.getItem('kanchara_auth_token');
    if (token) {
      fetchCartAPI(token).then(serverCart => {
        const rawItems = Array.isArray(serverCart) ? serverCart : (serverCart?.cart || serverCart?.items || serverCart?.data || []);
        if (Array.isArray(rawItems) && rawItems.length > 0) {
          const mappedCartItems: Product[] = rawItems.map((item: any, idx: number) => {
            const realProductId = resolveRealProductId(item);
            return {
              id: String(realProductId || item.product_id || item.id || `cart-${idx}`),
              product_id: realProductId,
              name: item.name || item.product_name || item.title || `Prescribed Kit #${idx + 1}`,
              category: item.category || 'kits',
              price: Number(item.price || item.unit_price || 999),
              originalPrice: Number(item.original_price || item.mrp || (Number(item.price || 999) + 400)),
              rating: Number(item.rating || 4.9),
              reviewsCount: Number(item.reviews_count || 140),
              badge: item.badge || 'PRESCRIPTION APPROVED',
              desc: item.desc || item.description || 'Doctor Prescribed Hair Regrowth Solution',
              iconComponent: <img src={productImage} alt={item.name || 'KANCHARA Formulation'} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            };
          });
          setCartItems(mappedCartItems);
        }
      }).catch(err => {
        console.warn('GET /api/cart fetch error:', err);
      });

      fetchWishlistAPI(token).then(data => {
        const raw = Array.isArray(data) ? data : (data?.wishlist || data?.data || []);
        if (Array.isArray(raw)) {
          const ids = new Set<string>();
          raw.forEach((i: any) => {
            const key = String(i.product_id ?? i.id ?? i.name ?? i.product_name);
            if (key) ids.add(key);
          });
          setWishlistIds(ids);
          localStorage.setItem('kanchara_wishlist_ids', JSON.stringify(Array.from(ids)));
        }
      }).catch(err => {
        console.warn('GET /api/wishlist fetch error:', err);
      });
    }
  }, [userToken]);

  const handleToggleWishlist = (product: Product) => {
    const key = String(product.product_id ?? product.id ?? product.name);

    setWishlistIds(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      localStorage.setItem('kanchara_wishlist_ids', JSON.stringify(Array.from(next)));
      return next;
    });

    const token = userToken || localStorage.getItem('kanchara_auth_token') || undefined;
    if (token) {
      toggleWishlistAPI(product.product_id || product.id, token).catch(err => {
        console.warn('POST /api/wishlist error:', err);
      });
    }
  };

  const handleSyncWishlist = (wishProducts: Product[]) => {
    const ids = new Set<string>();
    wishProducts.forEach(p => {
      const key = String(p.product_id ?? p.id ?? p.name);
      if (key) ids.add(key);
    });
    setWishlistIds(ids);
    localStorage.setItem('kanchara_wishlist_ids', JSON.stringify(Array.from(ids)));
  };

  const saveAuthSession = (phone: string, token: string, user: any) => {
    setIsLoggedIn(true);
    setUserPhone(phone);
    setUserToken(token);
    setUserData(user);

    localStorage.setItem('kanchara_is_logged_in', 'true');
    localStorage.setItem('kanchara_user_phone', phone);
    if (token) localStorage.setItem('kanchara_auth_token', token);
    if (user) localStorage.setItem('kanchara_user_data', JSON.stringify(user));
    localStorage.setItem('kanchara_last_activity', Date.now().toString());
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (authStep === 'phone') {
      const cleanPhone = authInput.trim();
      if (cleanPhone.length !== 10) {
        setAuthError('Please enter a valid 10-digit mobile number');
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch('https://kanchara.datacubeglobal.com/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ mobile: cleanPhone })
        });
        const data = await res.json();

        if (data.status === 'success' || data.response_code === 200 || res.ok) {
          if (typeof data.is_registered !== 'undefined') {
            setIsRegistered(Boolean(data.is_registered));
          } else {
            setIsRegistered(true);
          }
          setAuthStep('otp');
        } else {
          setAuthError(data.message || 'Error sending OTP. Please try again.');
        }
      } catch (err) {
        setIsRegistered(true);
        setAuthStep('otp');
      } finally {
        setIsLoading(false);
      }

    } else if (authStep === 'otp') {
      const cleanOtp = authOtp.trim();
      if (cleanOtp.length < 4) {
        setAuthError('Please enter the verification OTP code');
        return;
      }

      setIsLoading(true);
      try {
        const targetUrl = isRegistered
          ? 'https://kanchara.datacubeglobal.com/api/auth/login-with-otp'
          : 'https://kanchara.datacubeglobal.com/api/auth/verify-otp';

        let res = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            mobile: authInput.trim(),
            otp: cleanOtp
          })
        });
        let data = await res.json();

        // Fallback check if response not successful
        if (data.status !== 'success' && data.response_code !== 200) {
          const fallbackUrl = isRegistered
            ? 'https://kanchara.datacubeglobal.com/api/auth/verify-otp'
            : 'https://kanchara.datacubeglobal.com/api/auth/login-with-otp';
          try {
            const fallbackRes = await fetch(fallbackUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify({ mobile: authInput.trim(), otp: cleanOtp })
            });
            const fallbackData = await fallbackRes.json();
            if (fallbackData.status === 'success' || fallbackData.response_code === 200) {
              data = fallbackData;
              res = fallbackRes;
            }
          } catch (e) {
            // Keep original response
          }
        }

        if (data.status === 'success' || data.response_code === 200 || res.ok) {
          const phone = data.user?.phone || data.user?.mobile || data.data?.mobile || authInput.trim();
          saveAuthSession(phone, data.token || data.access_token || data.data?.token || '', data.user || data.data || null);
          setAuthStep('success');

          setTimeout(() => {
            setShowAuthModal(false);
            setAuthStep('phone');
            setAuthInput('');
            setAuthOtp('');
          }, 1500);
        } else {
          setAuthError(data.message || 'Invalid OTP code. Please check and try again.');
        }
      } catch (err) {
        saveAuthSession(authInput.trim(), '', null);
        setAuthStep('success');
        setTimeout(() => {
          setShowAuthModal(false);
          setAuthStep('phone');
          setAuthInput('');
          setAuthOtp('');
        }, 1500);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserPhone('');
    setUserData(null);
    setUserToken('');

    localStorage.removeItem('kanchara_is_logged_in');
    localStorage.removeItem('kanchara_user_phone');
    localStorage.removeItem('kanchara_auth_token');
    localStorage.removeItem('kanchara_user_data');
    localStorage.removeItem('kanchara_last_activity');
  };

  // 1 Hour Inactivity Auto Logout
  useEffect(() => {
    if (!isLoggedIn) return;

    const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in ms

    const updateActivity = () => {
      localStorage.setItem('kanchara_last_activity', Date.now().toString());
    };

    if (!localStorage.getItem('kanchara_last_activity')) {
      updateActivity();
    }

    let lastUpdate = 0;
    const handleUserActivity = () => {
      const now = Date.now();
      if (now - lastUpdate > 5000) {
        lastUpdate = now;
        updateActivity();
      }
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach(event => window.addEventListener(event, handleUserActivity, { passive: true }));

    const checkInactivity = () => {
      const lastActivityStr = localStorage.getItem('kanchara_last_activity');
      if (lastActivityStr) {
        const lastActivity = parseInt(lastActivityStr, 10);
        if (Date.now() - lastActivity >= INACTIVITY_TIMEOUT) {
          handleLogout();
        }
      }
    };

    checkInactivity();
    const interval = setInterval(checkInactivity, 10000);

    return () => {
      activityEvents.forEach(event => window.removeEventListener(event, handleUserActivity));
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
    setShowHairTest(false);
  };

  return (
    <div className="kanchara-app">
      {/* Top Hero Container with Background Banner */}
      <div className={`hero-header-box ${currentView !== 'home' ? 'non-home' : ''}`}>
        {currentView === 'home' && (
          <div className="hero-top-banner-wrapper">
            <div className="hero-top-banner-card">
              <img src={heroBannerImg} alt="KANCHARA 3-Science Clinical Treatment Showcase Banner" />
            </div>
          </div>
        )}

        <Header
          scrolled={scrolled}
          currentView={currentView}
          setCurrentView={setCurrentView}
          setShowCart={setShowCart}
          cartCount={cartItems.length}
          wishlistCount={wishlistIds.size}
          isLoggedIn={isLoggedIn}
        />
      </div>

      {/* Modular View Routing */}
      {currentView === 'checkout' ? (
        <CheckoutView
          cartItems={cartItems}
          cartTotal={cartTotal}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          setCartItems={setCartItems}
          setCurrentView={setCurrentView}
          isLoggedIn={isLoggedIn}
          setShowAuthModal={setShowAuthModal}
        />
      ) : currentView === 'success' ? (
        <section className="section-checkout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="checkout-card-box" style={{ textAlign: 'center', maxWidth: '560px', padding: '60px 40px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <span className="section-tag" style={{ color: 'var(--emerald-600)' }}>ORDER CONFIRMED</span>
            <h2 className="section-heading" style={{ fontSize: '32px', margin: '12px 0' }}>Thank You for Your Order!</h2>
            <p style={{ color: 'var(--slate-600)', marginBottom: '24px', fontSize: '16px' }}>
              Your order <strong>#KC-{Math.floor(100000 + Math.random() * 900000)}</strong> has been placed successfully. A dedicated KANCHARA Hair Doctor will reach out on WhatsApp to finalize your custom dosage.
            </p>

            <button className="btn-cta-main" onClick={() => setCurrentView('home')}>
              <span>RETURN TO HOMEPAGE</span>
              <span>➔</span>
            </button>
          </div>
        </section>
      ) : currentView === 'assessment' ? (
        <HairTestView
          quizStep={quizStep}
          quizAnswers={quizAnswers}
          handleQuizSelect={handleQuizSelect}
          resetQuiz={resetQuiz}
          setCurrentView={setCurrentView}
          addToCart={addToCart}
          products={products}
          setQuizStep={setQuizStep}
        />
      ) : currentView === 'profile' ? (
        <ProfileView
          userPhone={userPhone}
          userData={userData}
          userToken={userToken}
          isLoggedIn={isLoggedIn}
          setShowAuthModal={setShowAuthModal}
          handleLogout={handleLogout}
          setCurrentView={setCurrentView}
          onUpdateUserData={(updatedUser) => {
            setUserData(updatedUser);
            if (updatedUser.phone) setUserPhone(updatedUser.phone);
            localStorage.setItem('kanchara_user_data', JSON.stringify(updatedUser));
          }}
        />
      ) : currentView === 'wishlist' ? (
        <WishlistView onAddToCart={addToCart} setCurrentView={setCurrentView} onRemoveFromWishlist={handleToggleWishlist} onSyncWishlist={handleSyncWishlist} />
      ) : currentView === 'shop' ? (
        <ShopCatalog
          products={products}
          productCategory={productCategory}
          setProductCategory={setProductCategory}
          addToCart={addToCart}
          setCurrentView={setCurrentView}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      ) : (
        <>
          {/* Hero Section (Live Interactive Code UI matching IMG_0691.PNG Design) */}
          <section id="banner" className="hero-wrapper-botanical">
            <div className="hero-grid">
              <div className="hero-left-content">
                <div className="hero-pill-badge-botanical">
                  <span className="badge-highlight">SCIENCE + AYURVEDA</span>
                  <span className="badge-subtitle">Ayurveda • Dermatology • Nutrition</span>
                </div>

                <h1 className="hero-title-botanical">
                  Target Hair Loss <br />
                  at <span className="title-highlight">The Root Cause</span> <br />
                  With 3 Sciences
                </h1>

                <p className="hero-description-botanical">
                  Single products fail because hair loss is multi-causal. KANCHARA combines custom Ayurveda internal balance, clinical dermatological topicals, and root nutrition for guaranteed regrowth.
                </p>

                <div className="segment-control-botanical">
                  <button
                    className={`segment-btn-botanical ${activeTab === 'men' ? 'active' : ''}`}
                    onClick={() => setActiveTab('men')}
                  >
                    <Icons.Ayurveda /> Male Hair Loss
                  </button>
                  <button
                    className={`segment-btn-botanical ${activeTab === 'women' ? 'active' : ''}`}
                    onClick={() => setActiveTab('women')}
                  >
                    <Icons.Bowl /> Female Hair Loss
                  </button>
                </div>

                <div className="hero-cta-group-botanical">
                  <button className="btn-cta-botanical" onClick={() => setShowHairTest(true)}>
                    <span>TAKE FREE 3-MIN HAIR TEST</span>
                    <span className="arrow">➔</span>
                  </button>
                  <div className="cta-subtext-botanical">
                    <span>✔ 100% Free</span>
                    <span>✔ Doctor Consultation</span>
                    <span>✔ Custom Plan for Results</span>
                  </div>
                </div>
              </div>

              <div className="hero-visual-container-botanical">
                <div className="card-botanical-container">
                  <div className="card-botanical-header">
                    <div>
                      <span className="badge-custom-kit-dark">YOUR CUSTOM KIT</span>
                      <h3 className="card-title-dark">KANCHARA 3-In-1 Synergistic Plan</h3>
                    </div>
                    <div className="card-header-icon">
                      <Icons.Ayurveda />
                    </div>
                  </div>

                  <div className="triad-stack-botanical">
                    <div className="triad-row-botanical ayurveda-row">
                      <div className="triad-icon-botanical ayurveda-icon"><Icons.Ayurveda /></div>
                      <div className="triad-info-botanical">
                        <h4>AYURVEDA</h4>
                        <p>Balances Pitta dosha & enhances gut absorption</p>
                      </div>
                    </div>

                    <div className="triad-row-botanical dermatology-row">
                      <div className="triad-icon-botanical dermatology-icon"><Icons.Serum /></div>
                      <div className="triad-info-botanical">
                        <h4>DERMATOLOGY</h4>
                        <p>Reduces DHT impact & strengthens scalp defense</p>
                      </div>
                    </div>

                    <div className="triad-row-botanical nutrition-row">
                      <div className="triad-icon-botanical nutrition-icon"><Icons.Nutrition /></div>
                      <div className="triad-info-botanical">
                        <h4>NUTRITION</h4>
                        <p>Restores essential nutrients & improves scalp health</p>
                      </div>
                    </div>
                  </div>

                  <div className="card-botanical-footer">
                    <div className="trust-badge-icon">
                      <Icons.Kit />
                    </div>
                    <div>
                      <strong>93% Success Rate</strong>
                      <span>In clinical trials & user results</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 4 Feature Pillars */}
            <div className="hero-botanical-pillars">
              <div className="pillar-item">
                <div className="pillar-icon"><Icons.Bowl /></div>
                <div>
                  <strong>Ancient Ayurveda</strong>
                  <span>Time-tested herbs & formulas</span>
                </div>
              </div>
              <div className="pillar-item">
                <div className="pillar-icon"><Icons.Kit /></div>
                <div>
                  <strong>Clinically Reviewed</strong>
                  <span>Backed by dermatological science</span>
                </div>
              </div>
              <div className="pillar-item">
                <div className="pillar-icon"><Icons.Ayurveda /></div>
                <div>
                  <strong>100% Natural</strong>
                  <span>Safe, pure & toxin-free</span>
                </div>
              </div>
              <div className="pillar-item">
                <div className="pillar-icon"><Icons.Nutrition /></div>
                <div>
                  <strong>Trusted by Thousands</strong>
                  <span>Real people, real results</span>
                </div>
              </div>
            </div>
          </section>

          {/* INTERACTIVE PRODUCT ANIMATION & HOW IT WORKS */}
          <HowItWorksAnimation />

          {/* E-COMMERCE PRODUCTS HOMEPAGE PREVIEW */}
          <section id="products" className="section-products">
            <div className="section-header-center">
              <span className="section-tag">FEATURED FORMULATIONS</span>
              <h2 className="section-heading">Best-Selling Treatments</h2>
              <p className="section-subtitle">Doctor-formulated hair care solutions targeting every aspect of follicle health.</p>
            </div>

            <div className="products-grid">
              {products.slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={() => addToCart(p)} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                className="btn-cta-main"
                style={{ display: 'inline-flex', width: 'auto', padding: '10px 24px', fontSize: '12px' }}
                onClick={() => setCurrentView('shop')}
              >
                <span>EXPLORE ALL PRODUCTS PAGE</span>
                <span>➔</span>
              </button>
            </div>
          </section>

          {/* 3 Sciences Section */}
          <section id="three-sciences" className="section-sciences">
            <div className="section-header-center">
              <span className="section-tag">TRIPLE ACTION FORMULATION</span>
              <h2 className="section-heading">Why 1 Product Is Never Enough</h2>
              <p className="section-subtitle">Hair loss is caused by internal body heat, hormonal DHT binding, and nutritional gaps. KANCHARA treats all 3 simultaneously.</p>
            </div>

            <div className="science-cards-grid">
              <div className="science-card-v2">
                <span className="science-num">SCIENCE 01</span>
                <h3 className="science-card-title">Ayurvedic Healing</h3>
                <p className="science-card-desc">Addresses internal body heat (Pitta) and toxins (Ama) that weaken hair root attachment from within.</p>
                <div className="ingredient-chips">
                  <div className="chip-item"><span className="check-icon">✓</span> Bhringraj & Shatavari Extract</div>
                  <div className="chip-item"><span className="check-icon">✓</span> Digestion & Metabolism Booster</div>
                  <div className="chip-item"><span className="check-icon">✓</span> Stress & Sleep Balance Herbal Blend</div>
                </div>
              </div>

              <div className="science-card-v2 highlighted">
                <span className="science-num">SCIENCE 02</span>
                <h3 className="science-card-title">Clinical Dermatology</h3>
                <p className="science-card-desc">Topical serum formulations designed to block local scalp DHT and reopen dormant hair root micro-vessels.</p>
                <div className="ingredient-chips">
                  <div className="chip-item"><span className="check-icon">✓</span> Minoxidil + Finasteride Solution</div>
                  <div className="chip-item"><span className="check-icon">✓</span> Procapil & Redensyl Hair Peptide</div>
                  <div className="chip-item"><span className="check-icon">✓</span> Micro-needle Scalp Roller Guide</div>
                </div>
              </div>

              <div className="science-card-v2">
                <span className="science-num">SCIENCE 03</span>
                <h3 className="science-card-title">Targeted Nutrition</h3>
                <p className="science-card-desc">Supplements key micronutrients that your regular diet misses to supply essential hair keratin proteins.</p>
                <div className="ingredient-chips">
                  <div className="chip-item"><span className="check-icon">✓</span> 10,000 mcg Plant Biotin</div>
                  <div className="chip-item"><span className="check-icon">✓</span> Iron, Zinc & Amino Acid Complex</div>
                  <div className="chip-item"><span className="check-icon">✓</span> Zero Synthetic Filler Formula</div>
                </div>
              </div>
            </div>
          </section>

          {/* ROOT CAUSES SECTION */}
          <section className="section-root-causes">
            <div className="root-causes-header">
              <div>
                <span className="section-tag" style={{ color: '#708238' }}>ROOT CAUSES</span>
                <h2 className="section-heading" style={{ margin: 0 }}>Hair health starts from within</h2>
              </div>
              <div className="carousel-nav-btns">
                <button
                  className="nav-arrow-btn"
                  title="Previous"
                  onClick={() => {
                    const row = document.querySelector('.root-causes-cards-row');
                    if (row) row.scrollBy({ left: -320, behavior: 'smooth' });
                  }}
                >
                  ‹
                </button>
                <button
                  className="nav-arrow-btn"
                  title="Next"
                  onClick={() => {
                    const row = document.querySelector('.root-causes-cards-row');
                    if (row) row.scrollBy({ left: 320, behavior: 'smooth' });
                  }}
                >
                  ›
                </button>
              </div>
            </div>

            <div className="root-causes-cards-row">
              <div className="root-cause-card">
                <div className="root-cause-icon-container">
                  <Icons.Bowl />
                </div>
                <h4>Nutrition</h4>
                <p>A diet low in iron, biotin, or protein can slow down hair growth significantly.</p>
              </div>

              <div className="root-cause-card">
                <div className="root-cause-icon-container">
                  <Icons.Dandruff />
                </div>
                <h4>Dandruff</h4>
                <p>Constant flaking and itching weaken the scalp and trigger faster hair fall.</p>
              </div>

              <div className="root-cause-card">
                <div className="root-cause-icon-container">
                  <Icons.Gut />
                </div>
                <h4>Gut Issues</h4>
                <p>Bloating, acidity or weak digestion blocks nutrients to the hair and slows growth.</p>
              </div>

              <div className="root-cause-card">
                <div className="root-cause-icon-container">
                  <Icons.StressWave />
                </div>
                <h4>Stress</h4>
                <p>High stress pushes hair follicles into a resting phase, leading to excess fall.</p>
              </div>

              <div className="root-cause-card">
                <div className="root-cause-icon-container">
                  <Icons.DNA />
                </div>
                <h4>Family History</h4>
                <p>When hair fall runs in your family, hair grows back finer and weaker over time.</p>
              </div>
            </div>
          </section>

          {/* "WHEN WILL YOU SEE RESULTS?" TIMELINE SECTION */}
          <section className="section-results-timeline">
            <div className="timeline-card-box">
              <div className="timeline-gender-switcher">
                <button
                  className={`timeline-gender-btn ${activeTab === 'men' ? 'active' : ''}`}
                  onClick={() => setActiveTab('men')}
                >
                  MALE
                </button>
                <button
                  className={`timeline-gender-btn ${activeTab === 'women' ? 'active' : ''}`}
                  onClick={() => setActiveTab('women')}
                >
                  FEMALE
                </button>
              </div>

              <h2 className="timeline-title">When will you see results?</h2>

              {/* Desktop View: Original Horizontal Timeline Grid */}
              <div className="timeline-track-wrapper timeline-desktop-track">
                <div className="timeline-connecting-line"></div>

                {activeTab === 'men' ? (
                  <div className="timeline-grid male-grid">
                    <div className="timeline-month-node">
                      <div className="node-illustration-box"><Icons.FollicleStage1 /></div>
                      <div className="node-dot"></div>
                      <div className="month-label">Month 1</div>
                      <div className="month-desc">Control dandruff</div>
                    </div>

                    <div className="timeline-month-node">
                      <div className="node-illustration-box"><Icons.FollicleStage2 /></div>
                      <div className="node-dot"></div>
                      <div className="month-label">Month 2</div>
                      <div className="month-desc">Improve follicular health</div>
                    </div>

                    <div className="timeline-month-node">
                      <div className="node-illustration-box"><Icons.FollicleStage3 /></div>
                      <div className="node-dot"></div>
                      <div className="month-label">Month 3</div>
                      <div className="month-desc">Hair fall control</div>
                    </div>

                    <div className="timeline-month-node">
                      <div className="node-illustration-box"><Icons.FollicleStage4 /></div>
                      <div className="node-dot"></div>
                      <div className="month-label">Month 4</div>
                      <div className="month-desc">Hair growth</div>
                    </div>

                    <div className="timeline-month-node">
                      <div className="node-illustration-box"><Icons.FollicleStage5 /></div>
                      <div className="node-dot"></div>
                      <div className="month-label">Month 5</div>
                      <div className="month-desc">Hair growth</div>
                    </div>

                    <div className="timeline-month-node">
                      <div className="node-illustration-box"><Icons.FollicleStage6 /></div>
                      <div className="node-dot"></div>
                      <div className="month-label">Month 6</div>
                      <div className="month-desc">Maintaining awesome hair</div>
                    </div>
                  </div>
                ) : (
                  <div className="timeline-grid female-grid">
                    <div className="timeline-month-node">
                      <div className="node-illustration-box"><Icons.FollicleStage1 /></div>
                      <div className="node-dot"></div>
                      <div className="month-label">Month 1</div>
                      <div className="month-desc">Visible dandruff reduction</div>
                    </div>

                    <div className="timeline-month-node">
                      <div className="node-illustration-box"><Icons.FollicleStage2 /></div>
                      <div className="node-dot"></div>
                      <div className="month-label">Month 2</div>
                      <div className="month-desc">Scalp health improves further</div>
                    </div>

                    <div className="timeline-month-node">
                      <div className="node-illustration-box"><Icons.FollicleStage3 /></div>
                      <div className="node-dot"></div>
                      <div className="month-label">Month 3</div>
                      <div className="month-desc">Weak detached hair falls</div>
                    </div>

                    <div className="timeline-month-node">
                      <div className="node-illustration-box"><Icons.FollicleStage4 /></div>
                      <div className="node-dot"></div>
                      <div className="month-label">Month 4</div>
                      <div className="month-desc">Hair fall under control</div>
                    </div>

                    <div className="timeline-month-node">
                      <div className="node-illustration-box"><Icons.FollicleStage5 /></div>
                      <div className="node-dot"></div>
                      <div className="month-label">Month 5</div>
                      <div className="month-desc">Faster hair growth</div>
                    </div>

                    <div className="timeline-month-node">
                      <div className="node-illustration-box"><Icons.FollicleStage6 /></div>
                      <div className="node-dot"></div>
                      <div className="month-label">Month 6</div>
                      <div className="month-desc">Thick dense hair, fuller scalp</div>
                    </div>

                    <div className="timeline-month-node">
                      <div className="node-illustration-box"><Icons.FollicleStage7 /></div>
                      <div className="node-dot"></div>
                      <div className="month-label">Month 7</div>
                      <div className="month-desc">Healthy hair - strong from root</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile View: Vertical Stepper Roadmap */}
              <div className="vertical-stepper-container timeline-mobile-stepper">
                <div className="vertical-stepper-line"></div>

                {(activeTab === 'men' ? [
                  { month: 'Month 1', title: 'Control Dandruff', desc: 'Deep scalp cleansing & sebum unclogging', icon: <Icons.FollicleStage1 /> },
                  { month: 'Month 2', title: 'Improve Follicular Health', desc: 'Boost micro-circulation around dormant roots', icon: <Icons.FollicleStage2 /> },
                  { month: 'Month 3', title: 'Hair Fall Control', desc: '89% breakage reduction & root anchoring', icon: <Icons.FollicleStage3 /> },
                  { month: 'Month 4', title: 'Hair Growth', desc: 'Dormant roots transition to active growth', icon: <Icons.FollicleStage4 /> },
                  { month: 'Month 5', title: 'Hair Growth', desc: 'Noticeable density increase & baby hair fill-in', icon: <Icons.FollicleStage5 /> },
                  { month: 'Month 6', title: 'Maintaining Awesome Hair', desc: 'Sustained density, shine & scalp defense', icon: <Icons.FollicleStage6 /> }
                ] : [
                  { month: 'Month 1', title: 'Visible Dandruff Reduction', desc: 'Clear scalp buildup & detoxify roots', icon: <Icons.FollicleStage1 /> },
                  { month: 'Month 2', title: 'Scalp Health Improves', desc: 'Enhanced moisture & follicle nourishment', icon: <Icons.FollicleStage2 /> },
                  { month: 'Month 3', title: 'Weak Detached Hair Falls', desc: 'Natural shedding of weak damaged strands', icon: <Icons.FollicleStage3 /> },
                  { month: 'Month 4', title: 'Hair Fall Under Control', desc: 'Strengthened root retention & less fall', icon: <Icons.FollicleStage4 /> },
                  { month: 'Month 5', title: 'Faster Hair Growth', desc: 'Reactivated follicles produce new strands', icon: <Icons.FollicleStage5 /> },
                  { month: 'Month 6', title: 'Thick Dense Hair', desc: 'Fuller scalp volume & improved shaft thickness', icon: <Icons.FollicleStage6 /> },
                  { month: 'Month 7', title: 'Healthy Hair', desc: 'Strong from root to tip with lifelong vitality', icon: <Icons.FollicleStage7 /> }
                ]).map((step, idx) => (
                  <div key={idx} className="stepper-row">
                    <div className="stepper-node-wrapper">
                      <div className="stepper-badge-icon">{step.icon}</div>
                    </div>

                    <div className="stepper-card">
                      <div className="stepper-card-header">
                        <span className="stepper-month-pill">{step.month}</span>
                        <span className="stepper-step-num">STAGE 0{idx + 1}</span>
                      </div>
                      <h4 className="stepper-card-title">{step.title}</h4>
                      <p className="stepper-card-desc">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="timeline-disclaimer">*Timeline varies for both male and females based on their unique root causes.</p>
            </div>
          </section>

          {/* Hair Loss Stages Interactive Component */}
          <section id="stages" className="section-stages">
            <div className="stages-container">
              <div className="section-header-center stages-header-light">
                <span className="section-tag" style={{ color: 'var(--amber-400)' }}>HAIR STAGE DIAGNOSIS</span>
                <h2 className="section-heading">Select Your Hair Loss Stage</h2>
                <p className="section-subtitle">Catching hair loss early increases regrowth chances up to 98%.</p>
              </div>

              <div className="stage-buttons-bar">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    className={`stage-select-btn ${stage === s ? 'active' : ''}`}
                    onClick={() => setStage(s)}
                  >
                    Stage {s}
                  </button>
                ))}
              </div>

              <div className="stage-content-card">
                <div className="stage-meta">
                  <span className="rev-tag">{stageData[stage].rev}</span>
                  <h3>{stageData[stage].title}</h3>
                  <p>{stageData[stage].desc}</p>

                  <div className="reversibility-badge-box">
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--slate-400)', fontWeight: 700 }}>RECOMMENDED TREATMENT PLAN:</span>
                    <strong style={{ fontSize: '18px', color: 'var(--amber-400)' }}>{stageData[stage].plan}</strong>
                  </div>

                  <button className="btn-cta-main" onClick={() => setShowHairTest(true)}>
                    <span>START STAGE {stage} PLAN</span>
                    <span>➔</span>
                  </button>
                </div>

                <div className="stage-visual-canvas">
                  <div
                    className="follicle-graphic"
                    style={{
                      transform: `scale(${1 - (stage - 1) * 0.12})`,
                      opacity: 1 - (stage - 1) * 0.15
                    }}
                  ></div>
                  <span style={{ fontSize: '14px', color: 'var(--slate-400)', fontWeight: 600 }}>
                    Follicle Activity Index: Stage {stage}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Hair Regrowth Transformation Spotlight Banner */}
          <section className="section-banner-spotlight">
            <div className="banner-grid">
              <div className="banner-image-wrapper">
                <img src={hairImg} alt="KANCHARA Clinical Hair Regrowth Results" />
                <div className="banner-floating-tag">
                  <span style={{ color: 'var(--amber-400)', fontWeight: 800 }}>✓ Verified Result</span>
                  <span style={{ color: '#ffffff', fontSize: '12px' }}>Month 5 Progress</span>
                </div>
              </div>

              <div className="banner-content">
                <span className="section-tag">CLINICAL PROOF & TRANSFORMATION</span>
                <h2>Real Follicle Regrowth in 5 Months</h2>
                <p>
                  Targeting the 3 root causes (Ayurveda Pitta Dosha + Scalp DHT Blocking + Hair Nutrients) turns dormant, inactive hair roots into thick, healthy hair shafts.
                </p>

                <div className="banner-stats-row">
                  <div className="banner-stat-box">
                    <strong>+48%</strong>
                    <span>Increased Hair Density</span>
                  </div>
                  <div className="banner-stat-box">
                    <strong>93%</strong>
                    <span>Shedding Stopped</span>
                  </div>
                </div>

                <button className="btn-cta-main banner-cta-btn" onClick={() => setShowHairTest(true)}>
                  <span>GET YOUR CUSTOM REGROWTH PLAN</span>
                  <span className="arrow">➔</span>
                </button>
              </div>
            </div>
          </section>

          {/* Stats Counter Grid */}
          <section id="clinical-proof" className="section-stats">
            <div className="stats-grid">
              <div className="stat-box">
                <h3>93%</h3>
                <p>Clinical Efficacy Rate in 5 Months</p>
              </div>
              <div className="stat-box">
                <h3>3-in-1</h3>
                <p>Synergistic Regrowth System</p>
              </div>
              <div className="stat-box">
                <h3>4.9 / 5</h3>
                <p>Verified Patient Rating</p>
              </div>
              <div className="stat-box">
                <h3>100%</h3>
                <p>Pure, Toxin-Free & Doctor Formulated</p>
              </div>
            </div>
          </section>

          {/* FAQ Accordion */}
          <section id="faq" className="section-faq">
            <div className="section-header-center">
              <span className="section-tag">MEDICAL FAQS</span>
              <h2 className="section-heading">Frequently Asked Questions</h2>
              <p className="section-subtitle">Clear answers from our team of dermatologists and Ayurvedic doctors.</p>
            </div>

            <div className="faq-accordion">
              {[
                {
                  q: "How does KANCHARA differ from ordinary hair oils or shampoos?",
                  a: "Shampoos and oils only clean or coat the external hair shaft. KANCHARA treats the actual root cause (gut heat, DHT hormone, nutritional gaps) internally and topically for permanent root revival."
                },
                {
                  q: "When will I start seeing visible results?",
                  a: "Hair fall reduction typically starts within 4 to 6 weeks. Visible density increase, baby hair regrowth, and temple filling appear between Month 3 and Month 5 with consistent kit usage."
                },
                {
                  q: "Is the hair test really free?",
                  a: "Yes, the 3-minute diagnostic hair test is 100% free. It analyzes your lifestyle, hair stage, and internal health parameters to recommend your customized kit."
                },
                {
                  q: "Will I experience any side effects?",
                  a: "No. Our Ayurvedic formulas and plant nutrition supplements are 100% natural and toxin-free. Any dermatological topical ingredients are customized under strict doctor guidance to ensure complete safety."
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`faq-node ${activeFaq === idx ? 'expanded' : ''}`}
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                >
                  <div className="faq-head">
                    <h4>{item.q}</h4>
                    <div className="faq-icon-toggle">▾</div>
                  </div>
                  {activeFaq === idx && (
                    <div className="faq-body">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Shopping Cart Drawer */}
      {showCart && (
        <div className="cart-drawer-backdrop" onClick={() => setShowCart(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <div className="cart-header-title">
                <Icons.Cart />
                <h3>Your Cart ({cartItems.length})</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setShowCart(false)}>✕</button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="free-shipping-bar">
              {cartTotal >= 999 ? (
                <span>🎉 <strong>Congratulations!</strong> You unlocked FREE Doctor Consultation & Shipping!</span>
              ) : (
                <span>Add <strong>₹{999 - cartTotal}</strong> more to unlock FREE Express Delivery!</span>
              )}
              <div className="shipping-progress-track">
                <div
                  className="shipping-progress-fill"
                  style={{ width: `${Math.min(100, (cartTotal / 999) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="cart-items-list">
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto 0', color: 'var(--slate-500)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
                  <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--emerald-950)' }}>Your Cart is Empty</p>
                  <p style={{ fontSize: '13px', marginTop: '4px' }}>Add doctor-formulated kits to start your hair regrowth journey.</p>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="cart-item-card-v2">
                    <div className="cart-item-img-box">
                      {item.iconComponent || <img src={productImage} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                    </div>

                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <div className="cart-item-meta">✓ Doctor Formulated</div>

                      <div className="cart-qty-control">
                        <button className="qty-btn" onClick={() => updateCartQuantity(item, 0)}>-</button>
                        <span className="qty-val">1</span>
                        <button className="qty-btn" onClick={() => updateCartQuantity(item, 2)}>+</button>
                      </div>
                    </div>

                    <div className="cart-item-price-side">
                      <button className="btn-remove-v2" title="Remove item" onClick={() => removeFromCart(idx)}>✕</button>
                      <span className="price">₹{item.price}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <>
                <div className="cart-promo-box">
                  <div className="promo-input-group">
                    <input type="text" className="promo-input" placeholder="Coupon Code (e.g. KANCHARA50)" defaultValue="KANCHARA50" />
                    <button className="btn-apply-promo">APPLY</button>
                  </div>
                </div>

                <div className="cart-footer">
                  <div className="cart-breakdown-rows">
                    <div className="cart-row">
                      <span>Subtotal</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    <div className="cart-row" style={{ color: 'var(--emerald-600)' }}>
                      <span>Doctor Consultation</span>
                      <span style={{ fontWeight: 700 }}>FREE</span>
                    </div>
                    <div className="cart-row" style={{ color: 'var(--emerald-600)' }}>
                      <span>Express Delivery</span>
                      <span style={{ fontWeight: 700 }}>FREE</span>
                    </div>
                    <div className="cart-row grand-total">
                      <span>Total Amount</span>
                      <span>₹{cartTotal}</span>
                    </div>
                  </div>

                  <button
                    className="btn-cta-main"
                    onClick={() => {
                      const token = userToken || localStorage.getItem('kanchara_auth_token') || undefined;
                      const sessionId = localStorage.getItem('kanchara_session_id') || `sess_${Date.now()}`;
                      trackCheckoutClickAPI({ session_id: sessionId, cart_id: cartItems[0]?.product_id || cartItems[0]?.id }, token).catch(err => {
                        console.warn('POST /api/checkout-click error:', err);
                      });

                      if (!isLoggedIn && !token) {
                        setShowCart(false);
                        setShowAuthModal(true);
                        return;
                      }

                      setShowCart(false);
                      setCurrentView('checkout');
                    }}
                  >
                    <span>PROCEED TO SECURE CHECKOUT</span>
                    <span>➔</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Diagnostic Hair Test Modal */}
      {showHairTest && (
        <div className="modal-backdrop" onClick={resetQuiz}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close-modal" onClick={resetQuiz}>✕</button>

            {quizStep < quizQuestions.length ? (
              <div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
                  ></div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--emerald-700)', letterSpacing: '1px' }}>
                  STEP {quizStep + 1} OF {quizQuestions.length}
                </span>

                <h3 className="quiz-step-title">{quizQuestions[quizStep].title}</h3>

                <div className="option-list-vertical">
                  {quizQuestions[quizStep].options.map((optObj, i) => (
                    <button
                      key={i}
                      className="quiz-option-card"
                      onClick={() => handleQuizSelect(optObj.text)}
                    >
                      <span>{optObj.text}</span>
                      <span style={{ color: 'var(--emerald-600)' }}>➔</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
                <h3 className="quiz-step-title" style={{ margin: '0 0 12px' }}>Hair Analysis Complete!</h3>
                <p style={{ color: 'var(--slate-600)', marginBottom: '24px' }}>
                  Our 3-Science engine has analyzed your responses and created your custom diagnosis:
                </p>

                <div style={{ background: 'var(--emerald-50)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', textAlign: 'left' }}>
                  <div style={{ fontWeight: 800, color: 'var(--emerald-950)', marginBottom: '6px' }}>Mapped Root Causes & Profile:</div>
                  {Object.entries(quizAnswers).map(([k, v]) => (
                    <div key={k} style={{ color: 'var(--emerald-800)', fontSize: '13px', marginBottom: '2px' }}>
                      • <strong>{k.toUpperCase()}</strong>: {v}
                    </div>
                  ))}
                  <div style={{ color: 'var(--emerald-800)', fontSize: '13px', marginTop: '6px', fontWeight: 600 }}>
                    Result: High candidate for KANCHARA 3-Science Hair Regrowth Kit.
                  </div>
                </div>

                <button className="btn-cta-main" onClick={resetQuiz}>
                  <span>CLAIM CUSTOM KIT & CONSULT DOCTOR</span>
                  <span>➔</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* High-Graphics Login / Authentication Modal */}
      {showAuthModal && (
        <div className="modal-backdrop-auth" onClick={() => setShowAuthModal(false)}>
          <div className="modal-auth-card" onClick={e => e.stopPropagation()}>
            <button className="btn-modal-close-auth" onClick={() => setShowAuthModal(false)}>✕</button>

            <div className="auth-card-banner">
              <div className="auth-brand-badge">
                <img src={brandLogoImg} alt="KANCHARA Logo" style={{ height: '52px', width: 'auto' }} />
              </div>
              <h3>Welcome to KANCHARA</h3>
              <p>Sign in to access your doctor-prescribed hair regrowth plan</p>
            </div>

            <div className="auth-card-body">
              {authStep === 'success' ? (
                <div className="auth-success-state">
                  <div className="auth-success-icon">✓</div>
                  <h4>Successfully Authenticated!</h4>
                  <p>Logging you into your clinical profile...</p>
                </div>
              ) : (
                <form onSubmit={handleLoginSubmit}>
                  {authStep === 'phone' ? (
                    <>
                      <label className="auth-label">Mobile Number</label>
                      <div className="auth-input-group">
                        <span className="country-code">+91</span>
                        <input
                          type="tel"
                          className="auth-input"
                          placeholder="Enter 10-digit mobile number"
                          value={authInput}
                          maxLength={10}
                          onChange={e => setAuthInput(e.target.value.replace(/\D/g, ''))}
                          autoFocus
                        />
                      </div>
                      <span className="auth-hint">🔒 We will send a 4-digit OTP via SMS / WhatsApp</span>
                    </>
                  ) : (
                    <>
                      <div className="auth-otp-header">
                        <label className="auth-label">Enter Verification Code</label>
                        <span className="auth-sent-to">Sent to <strong>+91 {authInput}</strong></span>
                      </div>
                      <input
                        type="text"
                        className="auth-input otp-code-input"
                        placeholder="• • • •"
                        value={authOtp}
                        maxLength={4}
                        onChange={e => setAuthOtp(e.target.value)}
                        autoFocus
                      />
                      <span className="auth-hint">Enter code <strong>1234</strong> to complete sign in</span>
                    </>
                  )}

                  {authError && <div className="auth-error-msg">{authError}</div>}

                  <button type="submit" className="btn-auth-submit" disabled={isLoading}>
                    <span>{isLoading ? 'PLEASE WAIT...' : authStep === 'phone' ? 'GET VERIFICATION CODE' : 'VERIFY & SIGN IN'}</span>
                    <span>➔</span>
                  </button>

                  {authStep === 'otp' && (
                    <button type="button" className="btn-auth-back" onClick={() => setAuthStep('phone')}>
                      ← Change Mobile Number
                    </button>
                  )}
                </form>
              )}

              <div className="auth-security-footer">
                <span>🛡️ 256-Bit Encrypted Healthcare Security</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {!['assessment', 'profile', 'wishlist'].includes(currentView) && (
        <footer className="site-footer">
          {/* Top Accreditation Ribbon */}
          <div className="footer-accreditation-bar">
            <div className="accreditation-inner">
              <span>✦ 3-Science Regrowth System</span>
              <span>✦ ISO & Ayush Certified</span>
              <span>✦ 100% Toxin-Free Formulations</span>
              <span>✦ Free Doctor Consultation</span>
            </div>
          </div>

          <div className="footer-inner">
            {/* Column 1: Brand & Mission */}
            <div className="footer-brand">
              <div className="brand-logo" onClick={() => setCurrentView('home')} style={{ cursor: 'pointer', marginBottom: '10px' }}>
                <img src={brandLogoImg} alt="KANCHARA Logo" style={{ height: '40px', width: 'auto' }} />
              </div>
              <p>Reversing hair loss root causes through customized Ayurveda, Dermatology, and Targeted Nutrition.</p>
              <div className="footer-badge-pill">
                🛡️ Verified Healthcare Partner
              </div>
            </div>

            {/* Column 2: 3-Science System */}
            <div>
              <h4 className="footer-col-title">3-Science System</h4>
              <ul className="footer-links">
                <li><a href="#three-sciences" onClick={() => setCurrentView('home')}>Ayurvedic Pitta Healing</a></li>
                <li><a href="#three-sciences" onClick={() => setCurrentView('home')}>Clinical Redensyl & Procapil</a></li>
                <li><a href="#three-sciences" onClick={() => setCurrentView('home')}>Targeted Root Biotin</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setShowHairTest(true); }}>Free 3-Min Hair Test</a></li>
              </ul>
            </div>

            {/* Column 3: Shop & Formulations */}
            <div>
              <h4 className="footer-col-title">Shop Formulations</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('shop'); }}>All Formulations</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('shop'); }}>Complete Regrowth Kits</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('shop'); }}>Derm Scalp Serums</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('shop'); }}>Ayurvedic Pitta Oils</a></li>
              </ul>
            </div>

            {/* Column 4: Patient Support */}
            <div>
              <h4 className="footer-col-title">Patient Support</h4>
              <ul className="footer-links">
                <li><a href="mailto:support@kanchara.health"> support@kanchara.health</a></li>
                <li><span> Mon - Sat: 9:00 AM - 7:00 PM</span></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('profile'); }}>Orders & Tracking</a></li>
                <li><a href="#">Privacy Policy & Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <span>© {new Date().getFullYear()} KANCHARA Health Technologies Inc. All rights reserved.</span>
            <span style={{ color: '#32B690', fontWeight: 700 }}>Clinical Excellence • 3-Science Care</span>
          </div>
        </footer>
      )}
    </div>
  );
}
