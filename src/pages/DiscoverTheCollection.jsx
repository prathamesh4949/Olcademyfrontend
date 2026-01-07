import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProductService from "../services/productService";
import ScentService from "../services/scentService";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DiscoverCollectionPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          unisexRes
        ] = await Promise.all([
          ProductService.getHomeCollections(),
          ScentService.getFeaturedScents(),
          ProductService.getMensCollections(),
          ProductService.getWomensCollections(),
          ProductService.getUnisexCollections()
        ]);

        if (homeRes?.success) {
          setCollections(prev => ({
            ...prev,
            fragrant_favourites: homeRes.data.fragrant_favourites || [],
            summer_scents: homeRes.data.summer_scents || [],
            signature_collection: homeRes.data.signature_collection || []
          }));
        }

        if (scentRes?.success) {
          setCollections(prev => ({
            ...prev,
            trending_scents: scentRes.data.trending || [],
            best_seller_scents: scentRes.data.bestSellers || []
          }));
        }

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
        setError("Failed to load collections");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= ALL PRODUCTS ================= */
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

  /* ================= FILTER ================= */
  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      if (!p?._id) return false;

      if (activeCollection !== "all") {
        const list = collections[activeCollection] || [];
        if (!list.some(i => i._id === p._id)) return false;
      }

      const cat = (p.category || "").toLowerCase();
      if (filters.category !== "all" && !cat.includes(filters.category)) return false;

      if (filters.minRating && (p.rating || 0) < filters.minRating) return false;

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
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => setActiveCollection(collectionKey)}
      className={`p-8 text-center cursor-pointer border transition-all duration-300
        ${
          activeCollection === collectionKey
            ? "border-[#431A06] bg-[#FBF8F6]"
            : "border-[#E6DDD7] bg-white hover:border-[#431A06]"
        }`}
    >
      <h3 className="text-2xl font-serif text-[#431A06] mb-3">{title}</h3>
      <p className="text-sm text-[#7E513A] mb-4 leading-relaxed">
        {description}
      </p>
      <span className="text-xs uppercase tracking-widest text-[#79300f]">
        {count} Products
      </span>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#F9F7F6]">
      <Header />

      {/* ================= HERO ================= */}
      <section className="py-28 px-6 text-center bg-[#F5F2EF]">
        <h1 className="text-5xl md:text-6xl font-serif tracking-wide text-[#271004] mb-6">
          Discover the Collection
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-[#7E513A] leading-relaxed">
          Explore fragrances curated by mood, season, and timeless elegance.
        </p>
      </section>

      {/* ================= COLLECTIONS ================= */}
      <section className="max-w-7xl mx-auto px-6 mb-20 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <CollectionCard title="Signature Collection" description="Timeless Vesarii classics" count={collections.signature_collection.length} collectionKey="signature_collection" />
        <CollectionCard title="Summer Scents" description="Fresh & radiant fragrances" count={collections.summer_scents.length} collectionKey="summer_scents" />
        <CollectionCard title="Customer Favourites" description="Loved by our customers" count={collections.fragrant_favourites.length} collectionKey="fragrant_favourites" />
        <CollectionCard title="Just Arrived" description="Newest creations" count={collections.just_arrived.length} collectionKey="just_arrived" />
        <CollectionCard title="Best Sellers" description="Most popular scents" count={collections.best_sellers.length} collectionKey="best_sellers" />
        <CollectionCard title="Huntsman Savile Row" description="British luxury craftsmanship" count={collections.huntsman_savile_row.length} collectionKey="huntsman_savile_row" />
      </section>

      {/* ================= FILTER BAR ================= */}
      <section className="max-w-6xl mx-auto px-6 mb-14 flex flex-wrap justify-between gap-6">
        <div className="flex gap-4 flex-wrap">
          {["category", "minRating", "priceRange"].map((key, i) => (
            <select
              key={i}
              value={filters[key]}
              onChange={e => setFilters({ ...filters, [key]: key === "minRating" ? Number(e.target.value) : e.target.value })}
              className="border border-[#E6DDD7] px-4 py-2 text-sm bg-white text-[#431A06] focus:outline-none focus:border-[#431A06]"
            >
              {key === "category" && (
                <>
                  <option value="all">All Categories</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                </>
              )}
              {key === "minRating" && (
                <>
                  <option value={0}>All Ratings</option>
                  <option value={4}>4★ & above</option>
                  <option value={3}>3★ & above</option>
                </>
              )}
              {key === "priceRange" && (
                <>
                  <option value="all">All Prices</option>
                  <option value="low">Below $50</option>
                  <option value="mid">$50 – $120</option>
                  <option value="high">Above $120</option>
                </>
              )}
            </select>
          ))}
        </div>

        <button
          onClick={() => {
            setFilters({ category: "all", minRating: 0, priceRange: "all" });
            setActiveCollection("all");
          }}
          className="text-sm tracking-wide text-[#431A06] underline underline-offset-4 hover:opacity-70"
        >
          Clear Filters
        </button>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <h2 className="text-3xl font-serif text-center text-[#271004] mb-14">
          Curated Fragrances
        </h2>

        {loading ? (
          <div className="text-center py-20">Loading…</div>
        ) : error ? (
          <div className="text-center text-red-600 py-20">{error}</div>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <AnimatePresence>
              {filteredProducts.map(product => (
                <motion.div
                  key={product._id}
                  whileHover={{ y: -6 }}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="bg-white border border-[#E6DDD7] p-5 cursor-pointer hover:shadow-xl transition-all"
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="h-56 w-full object-contain mb-6"
                  />
                  <h4 className="font-serif text-lg text-[#431A06] text-center mb-1">
                    {product.name}
                  </h4>
                  <div className="flex justify-center my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(product.rating || 0) ? "text-[#431A06]" : "text-[#E0D6CF]"}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm text-[#7E513A] tracking-wide">
                    ${product.price}
                  </p>
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
