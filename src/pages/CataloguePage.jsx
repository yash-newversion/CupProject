import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { Star, Flame, Shield, ArrowRight, Eye, Check, ShoppingBag, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';

export default function CataloguePage({
  onAddToCart,
  onOpenQuickView,
  searchTerm,
  setSearchTerm,
  cartCount,
  cartTotal,
  lastAddedItem,
  onOpenCart
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('best-seller');
  // Track selected pack for each product: { [productId]: packObject }
  const [selectedPacks, setSelectedPacks] = useState(() => {
    const map = {};
    PRODUCTS.forEach((p) => {
      map[p.id] = p.packs.find((pk) => pk.isDefault) || p.packs[0];
    });
    return map;
  });

  const handlePackSelect = (productId, pack) => {
    setSelectedPacks((prev) => ({
      ...prev,
      [productId]: pack
    }));
  };

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((product) => {
      // Category match
      const categoryMatch =
        selectedCategory === 'all' ||
        product.category === selectedCategory ||
        product.categories?.includes(selectedCategory);

      // Search match
      const searchMatch =
        !searchTerm.trim() ||
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tastingNotes?.some((n) => n.toLowerCase().includes(searchTerm.toLowerCase()));

      return categoryMatch && searchMatch;
    });

    // Sorting
    result.sort((a, b) => {
      const packA = selectedPacks[a.id] || a.packs[0];
      const packB = selectedPacks[b.id] || b.packs[0];

      if (sortBy === 'price-asc') return packA.price - packB.price;
      if (sortBy === 'price-desc') return packB.price - packA.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'best-seller') return b.reviewCount - a.reviewCount;
      return 0;
    });

    return result;
  }, [selectedCategory, searchTerm, sortBy, selectedPacks]);

  return (
    <main className="flex-1 pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF6EC] to-[#F2EEDB] border-b border-[#E8E1CE] pt-10 sm:pt-14 pb-12 px-4 sm:px-8">
        {/* Subtle background circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E8E4CF] rounded-full filter blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#D5EBA8] rounded-full filter blur-3xl opacity-20 pointer-events-none" />

        <div className="max-w-[1360px] mx-auto relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-[#556633] mb-4 font-medium">
            <span className="hover:underline cursor-pointer">Home</span>
            <span>/</span>
            <span className="text-on-surface font-semibold">Tasting Catalogue</span>
            {selectedCategory !== 'all' && (
              <>
                <span>/</span>
                <span className="text-primary capitalize">{selectedCategory.replace('-', ' ')}</span>
              </>
            )}
          </div>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8ECD9] text-[#42531F] text-xs font-semibold border border-[#D5DFC0]">
              <Sparkles className="w-3.5 h-3.5 text-[#845E18]" />
              <span>Small-Batch Artisanal Releases • Baked Daily</span>
            </div>
            <h1 className="font-headline-lg text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface leading-[1.15]">
              Artisanal Cookie Cups &amp; Tasting Vessels
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Engineered for pure coffee indulgence. Oven-baked with ancient grains and glazed with single-origin Belgian dark chocolate to hold hot espresso at 85°C for 45 minutes without softening or leaking.
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 pt-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm active:scale-95 ${
                    isSelected
                      ? 'bg-primary text-white shadow-md ring-2 ring-primary/20'
                      : 'bg-white/80 hover:bg-white text-on-surface-variant hover:text-primary border border-[#DFD8BF]'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Catalog Controls & Products Section */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8 pt-8">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE3D2]">
          <div className="text-xs sm:text-sm text-on-surface-variant">
            Showing <strong className="text-on-surface font-bold">{filteredProducts.length} Handcrafted Batches</strong>
            {searchTerm && <span> matching &quot;{searchTerm}&quot;</span>}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#DFD8BF] shadow-sm text-xs w-full sm:w-auto">
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              <label htmlFor="sort-select" className="text-on-surface-variant font-medium">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-semibold text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="best-seller">Best Sellers</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-[#DFD8BF] my-8">
            <p className="font-headline-md text-lg text-on-surface font-semibold">
              No tasting vessels match your criteria
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Try adjusting your search query or selecting a different vessel category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
              }}
              className="mt-4 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-full"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 pt-8">
            {filteredProducts.map((product) => {
              const currentPack = selectedPacks[product.id] || product.packs[0];

              return (
                <article
                  key={product.id}
                  className="bg-white rounded-3xl border border-[#39452B]/10 overflow-hidden shadow-[0_4px_20px_-2px_rgba(41,45,36,0.05)] hover:shadow-[0_12px_32px_-4px_rgba(41,45,36,0.1)] transition-all duration-300 flex flex-col group"
                >
                  {/* Image Stage */}
                  <div className="relative bg-[#EDF0E5] h-60 sm:h-72 overflow-hidden flex items-center justify-center p-3 sm:p-4">
                    <img
                      src={product.image}
                      alt={product.imageAlt}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 shadow-sm"
                    />

                    {/* Badge */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#42531F] text-white shadow-md">
                        {product.badge}
                      </span>
                    </div>

                    {/* Quick View Button - Touch friendly on mobile/tablet */}
                    <button
                      onClick={() => onOpenQuickView(product)}
                      className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/95 hover:bg-white text-on-surface px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Rating & Reviews */}
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-1 text-amber-700 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{product.rating}</span>
                          <span className="text-on-surface-variant font-normal">
                            ({product.reviewCount})
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#556633] bg-[#F2EEDB] px-2 py-0.5 rounded-full">
                          {product.capacity}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => onOpenQuickView(product)}
                        className="font-headline-md text-xl font-bold text-on-surface hover:text-primary transition-colors cursor-pointer leading-snug"
                      >
                        {product.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed line-clamp-2">
                        {product.shortDesc}
                      </p>

                      {/* Spec Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#F2EEDB]">
                        <span className="text-[10px] font-medium bg-[#FAF6EC] text-[#42531F] border border-[#EAE3D2] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Flame className="w-3 h-3 text-[#D5A65A]" />
                          {product.heatResistance}
                        </span>
                        <span className="text-[10px] font-medium bg-[#FAF6EC] text-[#42531F] border border-[#EAE3D2] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Shield className="w-3 h-3 text-[#596B35]" />
                          {product.sustainability}
                        </span>
                      </div>

                      {/* Pack Selector Toggle */}
                      {product.packs && product.packs.length > 1 && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[11px] font-bold text-on-surface-variant mb-1.5">
                            <span>Select Pack</span>
                            <span className="text-primary font-semibold">
                              {currentPack.size}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-[#FAF6EC] p-1 rounded-xl border border-[#EAE3D2]">
                            {product.packs.map((pack) => {
                              const isSelected = currentPack.size === pack.size;
                              return (
                                <button
                                  key={pack.size}
                                  onClick={() => handlePackSelect(product.id, pack)}
                                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                                    isSelected
                                      ? 'bg-white text-primary font-bold shadow-sm'
                                      : 'text-on-surface-variant hover:text-on-surface'
                                  }`}
                                >
                                  {pack.size}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price and CTA */}
                    <div className="pt-3 border-t border-[#F2EEDB] flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-headline-md text-xl font-bold text-primary">
                            ₹{currentPack.price.toLocaleString('en-IN')}
                          </span>
                          {currentPack.originalPrice && (
                            <span className="text-xs text-on-surface-variant line-through">
                              ₹{currentPack.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-green-700 font-semibold block">
                          In Stock • Ships in 24 Hrs
                        </span>
                      </div>

                      <button
                        onClick={() => onAddToCart(product, currentPack, 1)}
                        className="bg-primary hover:bg-[#344218] text-white px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Basket</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* The Cup2Eat Guarantee Section */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8 mt-20">
        <div className="bg-[#FAF6EC] border border-[#EAE3D2] rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl text-center mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#556633] block mb-1">
              Pure Gastronomy • Zero Waste
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">
              The Cup2Eat Guarantee
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
              Every tasting vessel is a triumph of culinary engineering and environmental responsibility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#DFD8BF]/60 space-y-2.5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#EDF0E5] flex items-center justify-center text-primary font-bold">
                01
              </div>
              <h4 className="font-bold text-sm text-on-surface">Zero Waste • 100% Edible</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Enjoy your brew, then eat your cup. Eliminates single-use plastic, wax linings, and landfill clutter completely.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#DFD8BF]/60 space-y-2.5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#EDF0E5] flex items-center justify-center text-primary font-bold">
                02
              </div>
              <h4 className="font-bold text-sm text-on-surface">85°C Heat Proof for 45 Mins</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Oven-baked whole-grain density and double cocoa sealing prevent leaking and soggy bottoms for over 45 minutes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#DFD8BF]/60 space-y-2.5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#EDF0E5] flex items-center justify-center text-primary font-bold">
                03
              </div>
              <h4 className="font-bold text-sm text-on-surface">Plant-Powered &amp; Artisanal</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Crafted with stone-milled oat grains, organic raw cane sugar, and fair-trade Belgian cocoa. 100% eggless.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#DFD8BF]/60 space-y-2.5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#EDF0E5] flex items-center justify-center text-primary font-bold">
                04
              </div>
              <h4 className="font-bold text-sm text-on-surface">Small-Batch Fresh Baking</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                We bake every morning to match incoming orders, sealing each cup in nitrogen-flushed foils for 6 months of crispness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Cart Bar (Responsive on Mobile & Tablet) */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-[94%] sm:w-auto max-w-xl">
          <div className="bg-[#2E3618] text-white p-3 sm:px-6 sm:py-3.5 rounded-full shadow-2xl border border-[#4B5927] flex items-center justify-between gap-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#D5EBA8] text-[#141F00] font-bold text-xs flex items-center justify-center">
                {cartCount}
              </span>
              <div>
                <div className="text-xs font-bold leading-tight">
                  <span className="text-[#D5EBA8]">₹{cartTotal.toLocaleString('en-IN')}</span> in Basket
                </div>
                {lastAddedItem && (
                  <p className="text-[10px] text-white/70 truncate max-w-[140px] sm:max-w-xs">
                    Added: {lastAddedItem}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onOpenCart}
              className="bg-primary hover:bg-[#435420] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
            >
              <span>View Basket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
