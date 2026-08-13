import React from 'react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    badge: string;
    rating: number;
    reviewsCount: number;
    desc: string;
    price: number;
    originalPrice: number;
    iconComponent: React.ReactNode;
  };
  onAddToCart: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <span className="product-badge-tag">{product.badge}</span>
      <div className="product-image-container">
        {product.iconComponent}
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
