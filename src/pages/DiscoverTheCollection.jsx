
import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProductService from "../services/productService";
import ScentService from "../services/scentService";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * DISCOVER COLLECTION PAGE
 * - Signature / Summer / Customer Favourites
 * - Just Arrived / Best Sellers / Huntsman Savile Row
 *   (Men + Women + Unisex MERGED)
 * - Backend driven
 */

const DiscoverCollectionPage = () => {

  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SAME keys – unchanged
  const [collections, setCollections] = useState({
    fragrant_favourites: [],
    summer_scents: [],
    signature_collection: [],
    trending_scents: [],
    best_seller_scents: [],

    just_arrived: [],
    best_sellers: [],
    huntsman_savile_row: []
  });

  const [filters, setFilters] = useState({
    category: "all",
    minRating: 0,
    priceRange: "all"
  });

  const [activeCollection, setActiveCollection] = useState("all");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          homeRes,
          scentRes,
          menRes,
          womenRes,
          unisexRes // ✅ ONLY ADDITION
        ] = await Promise.all([
          ProductService.getHomeCollections(),
          ScentService.getFeaturedScents(),
          ProductService.getMensCollections(),
          ProductService.getWomensCollections(),
          ProductService.getUnisexCollections()
        ]);

        // HOME COLLECTIONS
        if (homeRes?.success) {
          setCollections(prev => ({
            ...prev,
            fragrant_favourites: homeRes.data.fragrant_favourites || [],
            summer_scents: homeRes.data.summer_scents || [],
            signature_collection: homeRes.data.signature_collection || []
          }));
        }

        // SCENT COLLECTIONS
        if (scentRes?.success) {
          setCollections(prev => ({
            ...prev,
            trending_scents: scentRes.data.trending || [],
            best_seller_scents: scentRes.data.bestSellers || []
          }));
        }

        // 🔥 MERGE MEN + WOMEN + UNISEX (ONLY CHANGE)
        setCollections(prev => ({
          ...prev,
          just_arrived: [
            ...(menRes?.data?.just_arrived || []),
            ...(womenRes?.data?.just_arrived || []),
            ...(unisexRes?.data?.just_arrived || [])
          ],
          best_sellers: [
            ...(menRes?.data?.best_sellers || []),
            ...(womenRes?.data?.best_sellers || []),
            ...(unisexRes?.data?.best_sellers || [])
          ],
          huntsman_savile_row: [
            ...(menRes?.data?.huntsman_savile_row || []),
            ...(womenRes?.data?.huntsman_savile_row || []),
            ...(unisexRes?.data?.huntsman_savile_row || [])
          ]
        }));

      } catch (err) {
        console.error("Discover fetch error:", err);
        setError("Failed to load collections");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= MERGE ALL PRODUCTS ================= */
  const allProducts = useMemo(() => {
    return [
      ...collections.signature_collection,
      ...collections.summer_scents,
      ...collections.fragrant_favourites,
      ...collections.trending_scents,
      ...collections.best_seller_scents,
      ...collections.just_arrived,
      ...collections.best_sellers,
      ...collections.huntsman_savile_row
    ].filter(Boolean);
  }, [collections]);

  /* ================= FILTER LOGIC (UNCHANGED) ================= */
  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      if (!p || !p._id) return false;

      // COLLECTION FILTER
      if (activeCollection !== "all") {
        const list = collections[activeCollection] || [];
        if (!list.some(i => i._id === p._id)) return false;
      }

      // CATEGORY FILTER
      const cat = (p.category || "").toLowerCase();
      if (filters.category !== "all" && !cat.includes(filters.category)) return false;

      // RATING FILTER
      if (filters.minRating && (p.rating || 0) < filters.minRating) return false;

      // PRICE FILTER
      const price = Number(p.price || 0);
      if (filters.priceRange === "low" && price > 50) return false;
      if (filters.priceRange === "mid" && (price < 50 || price > 120)) return false;
      if (filters.priceRange === "high" && price < 120) return false;

      return true;
    });
  }, [allProducts, filters, activeCollection, collections]);

  /* ================= COLLECTION CARD ================= */
  const CollectionCard = ({ title, description, count, collectionKey }) => (
    <motion.div
      whileHover={{ y: -6 }}
      onClick={() => setActiveCollection(collectionKey)}
      className={`bg-white shadow-md p-6 text-center cursor-pointer border-2 transition ${
        activeCollection === collectionKey ? "border-[#431A06]" : "border-transparent"
      }`}
    >
      <h3 className="text-2xl font-serif text-[#431A06] mb-2">{title}</h3>
      <p className="text-sm text-[#7E513A] mb-3">{description}</p>
      <span className="text-xs uppercase text-[#79300f]">{count} products</span>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#F9F7F6]">
      <Header />

      {/* HERO */}
      <section className="py-20 text-center px-6">
        <h1 className="text-5xl font-serif text-[#271004] mb-4">
          Discover the Collection
        </h1>
        <p className="max-w-2xl mx-auto text-[#7E513A]">
          Explore fragrances by mood, season and style.
        </p>
      </section>

      {/* COLLECTION FILTER CARDS */}
      <section className="max-w-7xl mx-auto px-6 mb-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <CollectionCard title="Signature Collection" description="Timeless Vesarii classics" count={collections.signature_collection.length} collectionKey="signature_collection" />
        <CollectionCard title="Summer Scents" description="Fresh & radiant" count={collections.summer_scents.length} collectionKey="summer_scents" />
        <CollectionCard title="Customer Favourites" description="Loved by customers" count={collections.fragrant_favourites.length} collectionKey="fragrant_favourites" />
        <CollectionCard title="Just Arrived" description="Newest fragrances" count={collections.just_arrived.length} collectionKey="just_arrived" />
        <CollectionCard title="Best Sellers" description="Top-selling scents" count={collections.best_sellers.length} collectionKey="best_sellers" />
        <CollectionCard title="Huntsman Savile Row" description="Luxury British craftsmanship" count={collections.huntsman_savile_row.length} collectionKey="huntsman_savile_row" />
      </section>

      {/* ✅ FILTER BAR (RESTORED & UNCHANGED) */}
      <section className="max-w-6xl mx-auto px-6 mb-10 flex flex-wrap gap-4 justify-between">
        <div className="flex gap-4 flex-wrap">
          <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
            <option value="all">All Categories</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>

          <select value={filters.minRating} onChange={e => setFilters({ ...filters, minRating: Number(e.target.value) })}>
            <option value={0}>All Ratings</option>
            <option value={4}>4★ & above</option>
            <option value={3}>3★ & above</option>
          </select>

          <select value={filters.priceRange} onChange={e => setFilters({ ...filters, priceRange: e.target.value })}>
            <option value="all">All Prices</option>
            <option value="low">Below $50</option>
            <option value="mid">$50 – $120</option>
            <option value="high">Above $120</option>
          </select>
        </div>

        <button
          onClick={() => {
            setFilters({ category: "all", minRating: 0, priceRange: "all" });
            setActiveCollection("all");
          }}
          className="text-sm underline text-[#431A06]"
        >
          Clear Filters
        </button>
      </section>

      {/* PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="text-center py-20">Loading…</div>
        ) : error ? (
          <div className="text-center text-red-600 py-20">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No products found.</div>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 cursor-pointer">
            <AnimatePresence>
              {filteredProducts.map(product => (
                <motion.div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)} // ✅ CLICK TO DETAIL
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white shadow-md p-4"
                >
                  <img
                    src={product.images?.[0] || "/images/default-gift.png"}
                    alt={product.name}
                    className="h-48 w-full object-contain mb-4"
                  />
                  <h4 className="font-serif text-lg text-[#431A06] text-center">
                    {product.name}
                  </h4>
                  <div className="flex justify-center my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(product.rating || 0) ? "text-[#431A06]" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm text-[#7E513A]">${product.price}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default DiscoverCollectionPage;
