import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from './types';

interface ShopCatalogProps {
  products: Product[];
  productCategory: string;
  setProductCategory: (cat: string) => void;
  addToCart: (p: Product) => void;
  setCurrentView: (view: 'home' | 'shop' | 'checkout' | 'assessment' | 'success') => void;
}

export const ShopCatalog: React.FC<ShopCatalogProps> = ({
  products,
  productCategory,
  setProductCategory,
  addToCart,
  setCurrentView
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  let filteredProducts = productCategory === 'all' 
    ? products 
    : products.filter(p => p.category === productCategory);

  if (searchQuery.trim()) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="shop-catalog-wrapper" style={{ background: '#F8FAF8', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Luxury Catalog Hero Banner */}
      <div className="shop-hero-banner" style={{
        background: 'linear-gradient(135deg, #062319 0%, #0B3C2D 60%, #135541 100%)',
        color: '#ffffff',
        padding: '50px 40px 60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(50, 182, 144, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', padding: '6px 16px', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.2)', marginBottom: '16px' }}>
            <span style={{ color: '#FBBF24', fontSize: '12px' }}>✦</span>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#FEF3C7' }}>KANCHARA CLINICAL APOTHECARY</span>
          </div>

          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '42px', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.5px', color: '#ffffff' }}>
            Botanical & Clinical Formulations
          </h1>

          <p style={{ maxWidth: '640px', margin: '0 auto 28px', color: '#E6F7F2', fontSize: '16px', lineHeight: 1.6 }}>
            Every kit & serum is precision-formulated by trichologists and Ayurvedic doctors to target metabolic root causes and reactivate hair follicles.
          </p>

          {/* Guarantee Badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', fontSize: '13px', fontWeight: 700, color: '#FEF3C7' }}>
            <span>✓ 100% Free Doctor Consultation</span>
            <span>✓ Zero Harmful Chemicals / Sulphates</span>
            <span>✓ ISO & Ayush Certified Formulations</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1300px', margin: '-30px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        {/* Controls Bar: Categories + Search + Sort */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '20px 28px',
          boxShadow: '0 10px 30px rgba(6, 35, 25, 0.08)',
          border: '1px solid rgba(19, 85, 65, 0.1)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '36px'
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Products', count: products.length },
              { id: 'kits', label: 'Complete Kits', count: products.filter(p => p.category === 'kits').length },
              { id: 'serums', label: 'Derm Serums', count: products.filter(p => p.category === 'serums').length },
              { id: 'ayurveda', label: 'Ayurvedic Oils', count: products.filter(p => p.category === 'ayurveda').length },
              { id: 'nutrition', label: 'Supplements', count: products.filter(p => p.category === 'nutrition').length }
            ].map(f => (
              <button 
                key={f.id} 
                onClick={() => setProductCategory(f.id)}
                style={{
                  background: productCategory === f.id ? '#0B3C2D' : '#F1F5F9',
                  color: productCategory === f.id ? '#ffffff' : '#475569',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{f.label}</span>
                <span style={{
                  background: productCategory === f.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.06)',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  fontSize: '11px'
                }}>{f.count}</span>
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="🔍 Search formulation..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                padding: '9px 16px',
                borderRadius: '9999px',
                border: '1px solid #E2E8F0',
                fontSize: '13px',
                outline: 'none',
                width: '200px',
                background: '#F8FAFC'
              }}
            />

            <select 
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              style={{
                padding: '9px 16px',
                borderRadius: '9999px',
                border: '1px solid #E2E8F0',
                fontSize: '13px',
                fontWeight: 600,
                outline: 'none',
                background: '#F8FAFC',
                cursor: 'pointer'
              }}
            >
              <option value="featured">Sort: Featured</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <h3 style={{ fontSize: '20px', color: '#0F172A', margin: '0 0 8px' }}>No Formulations Found</h3>
            <p style={{ color: '#64748B', fontSize: '14px' }}>Try resetting your search query or switching product categories.</p>
            <button 
              onClick={() => { setProductCategory('all'); setSearchQuery(''); }}
              style={{ marginTop: '16px', padding: '10px 20px', background: '#0B3C2D', color: '#fff', border: 'none', borderRadius: '9999px', fontWeight: 700, cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={() => addToCart(p)} />
            ))}
          </div>
        )}

        {/* Bottom Doctor Consultation Banner */}
        <div style={{
          marginTop: '60px',
          background: 'linear-gradient(135deg, #135541 0%, #0B3C2D 100%)',
          borderRadius: '24px',
          padding: '36px 40px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          boxShadow: '0 16px 40px rgba(11, 60, 45, 0.15)'
        }}>
          <div>
            <span style={{ background: '#FBBF24', color: '#062319', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>UNSURE WHICH PRODUCT TO CHOOSE?</span>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 800, margin: '10px 0 6px', color: '#ffffff' }}>Get a Custom Plan Prescribed by a Hair Specialist</h3>
            <p style={{ margin: 0, color: '#E6F7F2', fontSize: '14px' }}>Take our 2-minute diagnostic hair quiz to analyze your scalp stage and root causes.</p>
          </div>

          <div style={{ display: 'flex', gap: '14px' }}>
            <button 
              onClick={() => setCurrentView('assessment')}
              style={{ background: '#FBBF24', color: '#062319', border: 'none', padding: '14px 28px', borderRadius: '9999px', fontWeight: 800, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(251, 191, 36, 0.4)' }}
            >
              Take Free Hair Assessment ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

