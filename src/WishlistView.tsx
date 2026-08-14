import React, { useState, useEffect } from 'react';
import type { Product } from './types';
import productImage from './assets/bottle.png';
import { fetchWishlistAPI, toggleWishlistAPI } from './api';

interface WishlistViewProps {
  onAddToCart: (product: Product) => void;
  setCurrentView: (view: 'home' | 'shop' | 'checkout' | 'assessment' | 'profile' | 'wishlist' | 'success') => void;
  onRemoveFromWishlist?: (product: Product) => void;
  onSyncWishlist?: (products: Product[]) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ onAddToCart, setCurrentView, onRemoveFromWishlist, onSyncWishlist }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('kanchara_auth_token');
    if (token) {
      fetchWishlistAPI(token).then(data => {
        const raw = Array.isArray(data) ? data : (data?.wishlist || data?.data || []);
        if (Array.isArray(raw)) {
          const mapped: Product[] = raw.map((item: any, idx: number) => {
            const imgUrl = item.primary_image ? `${item.image_path || 'https://kanchara.datacubeglobal.com/storage'}/${item.primary_image}` : productImage;
            return {
              id: String(item.product_id || item.id || `wish-${idx}`),
              product_id: item.product_id || item.id,
              name: item.name || item.product_name || item.title || `Prescribed Kit #${idx + 1}`,
              category: item.category || 'kits',
              price: Number(item.price || item.unit_price || 999),
              originalPrice: Number(item.original_price || item.mrp || (Number(item.price || 999) + 400)),
              rating: Number(item.rating || 4.9),
              reviewsCount: Number(item.reviews_count || 140),
              badge: item.badge || 'PRESCRIPTION SAVED',
              desc: item.desc || item.description || 'Doctor Formulated Hair Regrowth Solution',
              iconComponent: (
                <img 
                  src={imgUrl} 
                  alt={item.name || 'KANCHARA Formulation'} 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = productImage;
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                />
              )
            };
          });
          setWishlistItems(mapped);
          if (onSyncWishlist) onSyncWishlist(mapped);
        } else {
          setWishlistItems([]);
          if (onSyncWishlist) onSyncWishlist([]);
        }
        setIsLoading(false);
      }).catch(err => {
        console.warn('GET /api/wishlist error:', err);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleRemoveFromWishlist = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlistItems(prev => prev.filter(item => (item.product_id || item.id) !== (product.product_id || product.id)));
    if (onRemoveFromWishlist) {
      onRemoveFromWishlist(product);
    } else {
      const token = localStorage.getItem('kanchara_auth_token');
      if (token) {
        toggleWishlistAPI(product.product_id || product.id, token).catch(err => {
          console.warn('POST /api/wishlist remove error:', err);
        });
      }
    }
  };

  return (
    <div style={{ background: '#F4FAF7', minHeight: '100vh', paddingBottom: '100px', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #041D15 0%, #0B3C2D 50%, #135541 100%)',
        color: '#ffffff',
        padding: '50px 24px 70px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(10px)', padding: '6px 18px', borderRadius: '9999px', marginBottom: '16px' }}>
            <span style={{ color: '#EF4444', fontSize: '14px' }}>♥</span>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#FEF3C7' }}>SAVED FORMULATIONS</span>
          </div>

          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '36px', fontWeight: 800, margin: '0 0 10px', color: '#ffffff' }}>
            Your Saved Regrowth Wishlist
          </h1>
          <p style={{ color: '#E6F7F2', fontSize: '15px', margin: 0, lineHeight: 1.6 }}>
            Saved clinical formulations & doctor recommendations synced with your account
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1240px', margin: '-30px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        {isLoading ? (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 10px 30px rgba(6,35,25,0.06)' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', color: '#0B3C2D', fontWeight: 800 }}>Loading Wishlist...</h3>
            <p style={{ color: '#64748B', fontSize: '14px' }}>Fetching saved formulations from GET /api/wishlist</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 10px 30px rgba(6,35,25,0.06)' }}>
            <div style={{ fontSize: '48px', color: '#EF4444', marginBottom: '16px' }}>♡</div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', color: '#0F172A', fontWeight: 800, margin: '0 0 8px' }}>Your Wishlist is Empty</h3>
            <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>Click the heart icon on any product in the catalog to save it here for later.</p>
            <button 
              onClick={() => setCurrentView('shop')}
              style={{ background: '#0B3C2D', color: '#ffffff', border: 'none', padding: '14px 32px', borderRadius: '9999px', fontWeight: 800, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(11,60,45,0.2)' }}
            >
              Explore All Formulations ➔
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {wishlistItems.map((product) => (
              <div key={product.id} style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '20px', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                <button 
                  onClick={(e) => handleRemoveFromWishlist(product, e)}
                  title="Remove from Wishlist"
                  style={{ position: 'absolute', top: '16px', right: '16px', background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 800, fontSize: '14px' }}
                >
                  ✕
                </button>

                <div style={{ height: '180px', background: 'linear-gradient(135deg, #F0FDF4, #E6F7F2)', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  {product.iconComponent || <img src={productImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                </div>

                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0B3C2D', textTransform: 'uppercase', marginBottom: '4px' }}>{product.badge}</span>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>{product.name}</h3>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px', flexGrow: 1, lineHeight: 1.4 }}>{product.desc}</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '14px', marginTop: 'auto' }}>
                    <div>
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#0B3C2D' }}>₹{product.price}</span>
                      <span style={{ fontSize: '12px', color: '#94A3B8', textDecoration: 'line-through', marginLeft: '6px' }}>₹{product.originalPrice}</span>
                    </div>

                    <button 
                      onClick={() => onAddToCart(product)}
                      style={{ background: '#0B3C2D', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
