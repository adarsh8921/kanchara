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
            const p1 = Number(item.special_price ?? item.unit_price ?? item.selling_price ?? item.offer_price ?? item.price ?? 999);
            const p2 = Number(item.mrp ?? item.original_price ?? item.price ?? (p1 + 300));
            const sellingPrice = Math.min(p1, p2);
            let originalMRP = Math.max(p1, p2);
            if (originalMRP <= sellingPrice) {
              originalMRP = Math.round(sellingPrice * 1.35);
            }

            return {
              id: String(item.product_id || item.id || `wish-${idx}`),
              product_id: item.product_id || item.id,
              name: item.name || item.product_name || item.title || `Prescribed Kit #${idx + 1}`,
              category: item.category || 'kits',
              price: sellingPrice,
              originalPrice: originalMRP,
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
    <div style={{ background: '#F4FAF7', minHeight: 'calc(100vh - 70px)', paddingBottom: '40px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Compact Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #041D15 0%, #0B3C2D 50%, #135541 100%)',
        color: '#ffffff',
        padding: '24px 20px 48px',
        textAlign: 'center',
        boxShadow: '0 6px 20px rgba(6, 35, 25, 0.12)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', padding: '4px 14px', borderRadius: '9999px', marginBottom: '10px' }}>
            <span style={{ color: '#EF4444', fontSize: '12px' }}>♥</span>
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#FEF3C7' }}>SAVED FORMULATIONS</span>
          </div>

          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '22px', fontWeight: 900, margin: '0 0 6px', color: '#ffffff' }}>
            Your Saved Regrowth Wishlist ({wishlistItems.length})
          </h1>
          <p style={{ color: '#E6F7F2', fontSize: '13px', margin: 0, lineHeight: 1.4 }}>
            Clinical formulations & doctor recommendations saved to your account
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '960px', margin: '-26px auto 0', padding: '0 16px', position: 'relative', zIndex: 10 }}>
        {isLoading ? (
          <div style={{ background: '#ffffff', borderRadius: '18px', padding: '40px 20px', textAlign: 'center', boxShadow: '0 8px 24px rgba(6,35,25,0.05)', border: '1px solid rgba(19, 85, 65, 0.08)' }}>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', color: '#0B3C2D', fontWeight: 800, margin: '0 0 4px' }}>Loading Wishlist...</h3>
            <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>Fetching saved formulations...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div style={{ background: '#ffffff', borderRadius: '18px', padding: '40px 24px', textAlign: 'center', boxShadow: '0 8px 24px rgba(6,35,25,0.05)', border: '1px solid rgba(19, 85, 65, 0.08)' }}>
            <div style={{ fontSize: '36px', color: '#EF4444', marginBottom: '10px' }}>♡</div>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', color: '#0F172A', fontWeight: 800, margin: '0 0 6px' }}>Your Wishlist is Empty</h3>
            <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '20px' }}>Click the heart icon on any product in the catalog to save it here for quick access.</p>
            <button 
              onClick={() => setCurrentView('shop')}
              style={{ background: '#0B3C2D', color: '#ffffff', border: 'none', padding: '12px 28px', borderRadius: '9999px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(11,60,45,0.2)' }}
            >
              Explore All Formulations ➔
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '16px' }}>
            {wishlistItems.map((product) => (
              <div key={product.id} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '14px', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                
                {/* Remove Button */}
                <button 
                  onClick={(e) => handleRemoveFromWishlist(product, e)}
                  title="Remove from Wishlist"
                  style={{ position: 'absolute', top: '12px', right: '12px', background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 800, fontSize: '12px', zIndex: 5 }}
                >
                  ✕
                </button>

                {/* Compact Product Image */}
                <div style={{ height: '130px', background: 'linear-gradient(135deg, #F0FDF4, #E6F7F2)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  {product.iconComponent || <img src={productImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                </div>

                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#0B3C2D', textTransform: 'uppercase', marginBottom: '3px', letterSpacing: '0.4px' }}>{product.badge}</span>
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px', lineHeight: 1.25 }}>{product.name}</h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 12px', flexGrow: 1, lineHeight: 1.35 }}>{product.desc}</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '10px', marginTop: 'auto' }}>
                    <div>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', fontWeight: 800, color: '#0B3C2D' }}>₹{product.price}</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8', textDecoration: 'line-through', marginLeft: '5px' }}>₹{product.originalPrice}</span>
                    </div>

                    <button 
                      onClick={() => onAddToCart(product)}
                      style={{ background: '#0B3C2D', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}
                    >
                      + Add
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
