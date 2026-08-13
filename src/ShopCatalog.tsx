import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from './types';

interface ShopCatalogProps {
  products: Product[];
  productCategory: string;
  setProductCategory: (cat: string) => void;
  addToCart: (p: Product) => void;
  setCurrentView: (view: 'home' | 'shop' | 'checkout' | 'success') => void;
}

export const ShopCatalog: React.FC<ShopCatalogProps> = ({
  products,
  productCategory,
  setProductCategory,
  addToCart,
  setCurrentView
}) => {
  const filteredProducts = productCategory === 'all' 
    ? products 
    : products.filter(p => p.category === productCategory);

  return (
    <section className="section-products" style={{ padding: '60px 40px 120px', minHeight: '80vh' }}>
      <div className="section-header-center">
        <span className="section-tag">KANCHARA OFFICIAL STORE</span>
        <h2 className="section-heading">All Formulations & Kits</h2>
        <p className="section-subtitle">Browse through our clinical dermatologist & Ayurvedic doctor formulated products.</p>
      </div>

      <div className="product-filter-bar">
        {[
          { id: 'all', label: 'All Formulations' },
          { id: 'kits', label: 'Complete Kits' },
          { id: 'serums', label: 'Derm Serums' },
          { id: 'ayurveda', label: 'Ayurvedic Oils' },
          { id: 'nutrition', label: 'Nutritional Supplements' }
        ].map(f => (
          <button 
            key={f.id} 
            className={`filter-btn ${productCategory === f.id ? 'active' : ''}`}
            onClick={() => setProductCategory(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.map(p => (
          <ProductCard key={p.id} product={p} onAddToCart={() => addToCart(p)} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <button className="filter-btn" onClick={() => setCurrentView('home')}>
          ← Back to Main Home Overview
        </button>
      </div>
    </section>
  );
};
