import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from './types';
import { fetchProductsFromAPI, fetchCategories, fetchTopSellingProducts, fetchFeaturedProducts } from './api';

interface ShopCatalogProps {
  products: Product[];
  productCategory: string;
  setProductCategory: (cat: string) => void;
  addToCart: (p: Product) => void;
  setCurrentView: (view: 'home' | 'shop' | 'checkout' | 'assessment' | 'profile' | 'wishlist' | 'success') => void;
  wishlistIds?: Set<string>;
  onToggleWishlist?: (p: Product) => void;
}

export const ShopCatalog: React.FC<ShopCatalogProps> = ({
  products: initialProducts,
  productCategory,
  setProductCategory,
  addToCart,
  wishlistIds,
  onToggleWishlist
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [apiProductsList, setApiProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Array<{ id: string; name: string; slug?: string }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      fetchProductsFromAPI(productCategory !== 'all' ? productCategory : undefined, searchQuery || undefined),
      fetchCategories(),
      fetchTopSellingProducts(),
      fetchFeaturedProducts()
    ]).then(([prodRes, catRes, topRes, featRes]) => {
      if (!isMounted) return;

      const rawProducts = Array.isArray(prodRes) ? prodRes : (prodRes?.products || prodRes?.data || []);
      const topProducts = Array.isArray(topRes) ? topRes : (topRes?.products || topRes?.data || []);
      const featProducts = Array.isArray(featRes) ? featRes : (featRes?.products || featRes?.data || []);

      const combined = [...rawProducts, ...topProducts, ...featProducts];
      const sourceList = combined.length > 0 ? combined : initialProducts;

      const mapped: Product[] = sourceList.map((item: any, idx: number) => ({
        id: String(item.product_id || item.id || `api-prod-${idx}`),
        product_id: item.product_id || item.id,
        category_id: item.category_id || item.cat_id,
        name: item.name || item.title || item.product_name || `Formulation #${idx + 1}`,
        desc: item.desc || item.description || item.subtitle || 'Doctor formulated 3-Science Regrowth Solution',
        price: Number(item.price || item.unit_price || item.selling_price || 999),
        originalPrice: Number(item.original_price || item.mrp || (Number(item.price || 999) + 400)),
        rating: Number(item.rating || 4.9),
        reviewsCount: Number(item.reviews_count || item.total_reviews || 128 + idx * 12),
        badge: item.badge || item.tag || (idx % 2 === 0 ? 'CLINICALLY PROVEN' : 'DOCTOR FORMULATED'),
        category: item.category || item.category_name || (idx % 4 === 0 ? 'kits' : idx % 4 === 1 ? 'serums' : idx % 4 === 2 ? 'ayurveda' : 'nutrition'),
        benefits: item.benefits || ['Root Revitalization', 'Scalp Circulation', 'Zero Toxins'],
        formula: item.formula || 'Ayurveda + Procapil + Nutrients',
        iconBg: '#F0FDF4'
      }));

      const unique = Array.from(new Map(mapped.map(p => [p.name, p])).values());
      setApiProductsList(unique);

      // Parse Categories from API
      const rawCatList = Array.isArray(catRes)
        ? catRes
        : (catRes?.categories || catRes?.data || catRes?.category_list || []);

      if (Array.isArray(rawCatList) && rawCatList.length > 0) {
        const parsedCatList = rawCatList.map((c: any, idx: number) => ({
          id: String(c.category_id || c.id || c.slug || `cat-${idx}`),
          name: String(c.category_name || c.name || c.title || c.slug || `Category ${idx + 1}`),
          slug: c.slug || c.category_slug || c.name || c.category_name
        }));
        setCategoriesList(parsedCatList);
      } else {
        // Fallback default categories if API returns null/empty
        const fallbackExtracted = Array.from(new Set(unique.map(p => p.category).filter(Boolean))).map((cName, idx) => ({
          id: `cat-ext-${idx}`,
          name: String(cName)
        }));
        setCategoriesList(fallbackExtracted.length > 0 ? fallbackExtracted : [
          { id: 'kits', name: 'Complete Kits' },
          { id: 'serums', name: 'Derm Serums' },
          { id: 'ayurveda', name: 'Ayurvedic Oils' },
          { id: 'nutrition', name: 'Supplements' }
        ]);
      }

      setIsLoading(false);
    }).catch(err => {
      console.warn('API fetch error in ShopCatalog:', err);
      if (isMounted) {
        setApiProductsList(initialProducts);
        setIsLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [productCategory, searchQuery]);

  let filteredProducts = productCategory === 'all'
    ? apiProductsList
    : apiProductsList.filter(p => {
      const target = productCategory.toLowerCase();
      const pCat = (p.category || '').toLowerCase();
      const pCatId = String((p as any).category_id || '').toLowerCase();

      const matchedCatObj = categoriesList.find(c =>
        c.id.toLowerCase() === target ||
        c.name.toLowerCase() === target ||
        (c.slug && c.slug.toLowerCase() === target)
      );

      if (matchedCatObj) {
        return pCat === matchedCatObj.name.toLowerCase() ||
          pCat === matchedCatObj.id.toLowerCase() ||
          (matchedCatObj.slug && pCat === matchedCatObj.slug.toLowerCase()) ||
          pCatId === matchedCatObj.id.toLowerCase();
      }

      return pCat === target || pCat.includes(target);
    });

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
    <div className="shop-catalog-wrapper" style={{ background: '#F8FAF8', minHeight: 'calc(100vh - 70px)', paddingBottom: '40px' }}>
      {/* Compact Catalog Hero Banner */}
      <div className="shop-hero-banner" style={{
        background: 'linear-gradient(135deg, #062319 0%, #0B3C2D 60%, #135541 100%)',
        color: '#ffffff',
        padding: '24px 20px 48px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 6px 20px rgba(6, 35, 25, 0.12)'
      }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.12)', padding: '4px 14px', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.2)', marginBottom: '10px' }}>
            <span style={{ color: '#FBBF24', fontSize: '11px' }}></span>
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#FEF3C7' }}>KANCHARA LIVE API CATALOG</span>
          </div>

          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.3px', color: '#ffffff' }}>
            Botanical & Clinical Formulations
          </h1>

          <p style={{ maxWidth: '600px', margin: '0 auto 16px', color: '#E6F7F2', fontSize: '13px', lineHeight: 1.4 }}>
            Precision-formulated by trichologists and Ayurvedic doctors to target metabolic root causes and reactivate hair follicles.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '12px', fontWeight: 700, color: '#FEF3C7' }}>
            <span>✓ 100% Free Doctor Consultation</span>
            <span>✓ Zero Sulphates & Toxin Free</span>
            <span>✓ ISO & Ayush Certified</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1140px', margin: '-26px auto 0', padding: '0 16px', position: 'relative', zIndex: 10 }}>
        {/* Controls Bar: Categories + Search + Sort */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '12px 18px',
          boxShadow: '0 8px 24px rgba(6, 35, 25, 0.06)',
          border: '1px solid rgba(19, 85, 65, 0.1)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          {/* Dynamic Category Tabs from API */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => setProductCategory('all')}
              style={{
                background: productCategory === 'all' ? '#0B3C2D' : '#F1F5F9',
                color: productCategory === 'all' ? '#ffffff' : '#475569',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>All Products</span>
              <span style={{
                background: productCategory === 'all' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.06)',
                padding: '1px 6px',
                borderRadius: '8px',
                fontSize: '10px'
              }}>{apiProductsList.length}</span>
            </button>

            {categoriesList.map(cat => {
              const isSelected = productCategory === cat.id ||
                productCategory.toLowerCase() === cat.name.toLowerCase() ||
                (cat.slug && productCategory.toLowerCase() === cat.slug.toLowerCase());

              const count = apiProductsList.filter(p => {
                const pCat = (p.category || '').toLowerCase();
                const pCatId = String((p as any).category_id || '').toLowerCase();
                return pCat === cat.name.toLowerCase() ||
                  pCat === cat.id.toLowerCase() ||
                  (cat.slug && pCat === cat.slug.toLowerCase()) ||
                  pCatId === cat.id.toLowerCase();
              }).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setProductCategory(cat.name)}
                  style={{
                    background: isSelected ? '#0B3C2D' : '#F1F5F9',
                    color: isSelected ? '#ffffff' : '#475569',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{cat.name}</span>
                  {count > 0 && (
                    <span style={{
                      background: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.06)',
                      padding: '1px 6px',
                      borderRadius: '8px',
                      fontSize: '10px'
                    }}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search & Sort */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search formulation..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                padding: '7px 14px',
                borderRadius: '9999px',
                border: '1px solid #E2E8F0',
                fontSize: '12px',
                outline: 'none',
                width: '180px',
                background: '#F8FAFC'
              }}
            />

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              style={{
                padding: '7px 14px',
                borderRadius: '9999px',
                border: '1px solid #E2E8F0',
                fontSize: '12px',
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

        {/* Loading Indicator or Products Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'spin 1.5s linear infinite', display: 'inline-block' }}>⚙️</div>
            <h3 style={{ fontSize: '18px', color: '#0B3C2D', margin: '0 0 8px', fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>Fetching Live API Catalog...</h3>
            <p style={{ color: '#64748B', fontSize: '13px' }}>Connecting to KANCHARA backend API endpoints</p>
          </div>
        ) : filteredProducts.length === 0 ? (
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
            {filteredProducts.map(p => {
              const isWish = wishlistIds
                ? (wishlistIds.has(String(p.id)) || wishlistIds.has(String(p.product_id)) || wishlistIds.has(p.name))
                : false;
              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={() => addToCart(p)}
                  isWishlisted={isWish}
                  onToggleWishlist={onToggleWishlist}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
