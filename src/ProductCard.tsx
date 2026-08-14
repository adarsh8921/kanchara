import React, { useState, useEffect } from 'react';
import type { Product } from './types';
import productImage from './assets/bottle.png';
import { toggleWishlistAPI } from './api';
import { Icons } from './Icons';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart,
  isWishlisted: externalIsWishlisted,
  onToggleWishlist
}) => {
  const [isWishlisted, setIsWishlisted] = useState(externalIsWishlisted || false);

  useEffect(() => {
    if (externalIsWishlisted !== undefined) {
      setIsWishlisted(externalIsWishlisted);
    }
  }, [externalIsWishlisted]);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);

    if (onToggleWishlist) {
      onToggleWishlist(product);
    } else {
      const token = localStorage.getItem('kanchara_auth_token') || undefined;
      if (token) {
        toggleWishlistAPI(product.product_id || product.id, token).catch(err => {
          console.warn('POST /api/wishlist error:', err);
        });
      }
    }
  };

  return (
    <div className="product-card">
      <span className="product-badge-tag">{product.badge}</span>
      <button 
        className="wishlist-btn-toggle" 
        onClick={handleToggleWishlist}
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 5,
          background: isWishlisted ? '#DC2626' : 'rgba(255, 255, 255, 0.95)',
          border: isWishlisted ? '1.5px solid #B91C1C' : '1px solid #CBD5E1',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: isWishlisted ? '0 4px 14px rgba(220, 38, 38, 0.45)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
          color: isWishlisted ? '#ffffff' : '#64748B',
          transition: 'all 0.25s ease'
        }}
      >
        <Icons.Heart filled={isWishlisted} />
      </button>
      <div className="product-image-container">
        {product.iconComponent || <img src={productImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
      </div>
      <div className="product-body">
        <div className="product-rating">
          ★ {product.rating} <span style={{ color: 'var(--slate-400)', fontWeight: 500 }}>({product.reviewsCount} reviews)</span>
        </div>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.desc}</p>
        <div className="product-footer">
          <div className="price-box">
            <span className="current-price">₹{product.price}</span>
            <span className="original-price">₹{product.originalPrice}</span>
          </div>
          <button className="btn-add-cart" onClick={onAddToCart}>
            <span>+ Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
