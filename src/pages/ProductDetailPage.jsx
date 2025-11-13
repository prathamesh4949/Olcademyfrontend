

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { Star, Heart } from 'lucide-react';
import ProductService from '../services/productService';
import ScentService from '../services/scentService';
import ProductCartSection from '../pages/ProductCartSection'; // Import cart sidebar component

// Tab configuration for product info sections
const TAB = [
  { key: 'description', label: 'DESCRIPTION' },
  { key: 'fragrance', label: 'FRAGRANCE PROFILE' },
  { key: 'additional', label: 'ADDITIONAL INFORMATION' },
  { key: 'bestfor', label: 'BEST FOR' },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, cartItems = [] } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Product and UI state
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedTab, setSelectedTab] = useState(TAB[0].key);
  const [displayPrice, setDisplayPrice] = useState('');
  const [justAdded, setJustAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false); // State to control cart sidebar visibility

  // Fetch product details on id/path change
  useEffect(() => {
    async function load() {
      let res;
      if (location.pathname.startsWith('/scent')) {
        res = await ScentService.getScentById(id);
        if (res?.data) setProduct(res.data);
      } else {
        const prod = await ProductService.getProduct(id);
        if (prod?.data?.product) {
          setProduct(prod.data.product);
          setRelatedProducts(prod.data.relatedProducts || []);
        }
      }
    }
    load();
  }, [id, location.pathname]);

  // Default selected size and displayed price
  useEffect(() => {
    if (product?.sizes?.length) {
      setSelectedSize(product.sizes[0].size);
      setDisplayPrice(product.sizes[0].price);
    } else if (product?.price) {
      setDisplayPrice(product.price);
    }
  }, [product]);

  // Set default selected image when product loads
  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  // Update display price when selected size changes
  useEffect(() => {
    if (!product?.sizes) return;
    const selectedObj = product.sizes.find((obj) => obj.size === selectedSize);
    if (selectedObj) setDisplayPrice(selectedObj.price);
  }, [selectedSize, product]);

  // Memoize isInCart check
  const isInCart = useMemo(() => {
    if (!product?._id) return false;

    return (
      cartItems.some(
        (item) =>
          item.id === product._id &&
          (item.selectedSize
            ? item.selectedSize === selectedSize
            : selectedSize === '')
      ) || justAdded
    );
  }, [cartItems, product?._id, selectedSize, justAdded]);

  // Add product to cart
  const handleAdd = () => {
    const normalizedProduct = {
      id: product._id,
      name: product.name,
      price: displayPrice,
      image: product.images?.[0] || '/images/default-perfume.png',
      selectedSize: selectedSize || null,
      quantity: 1,
      brand: product.brand || '',
      sku: product.sku || '',
    };

    addToCart(normalizedProduct);
    setJustAdded(true);
  };

  // Handle click on Already in Cart - open cart sidebar
  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleNoop = () => {};

  if (!product) return null;

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: '#F8F7F5', color: '#3F2E1F' }}
    >
      <Header />
      <main className="max-w-[1200px] ml-5 pt-12 pb-24 px-4 w-full">
        {/* Product detail layout: left image, right details */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* ✅ UPDATED: Image section with clickable thumbnails */}
          <div className="md:w-1/2 w-full flex gap-4 items-start">
            {/* Thumbnail Gallery */}
            {product.images && Array.isArray(product.images) && product.images.length > 0 && (
              <div className="flex flex-col gap-3 items-center">
                {product.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className={`w-[90px] h-[90px] bg-white border-2 flex-shrink-0 overflow-hidden transition-all duration-300 ${
                        selectedImage === image
                          ? 'border-[#5A2408] shadow-md opacity-100'
                          : 'border-[#E0D5CC] opacity-70 hover:opacity-100 hover:border-[#5A2408]'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={
                  selectedImage ||
                  product.images?.[0] ||
                  '/images/default-perfume.png'
                }
                alt={product.name}
                className="w-full max-w-[800px] h-[600px] object-contain bg-white transition-all duration-500 ease-in-out"
                style={{
                  boxShadow: '0px 12px 36px rgba(63,46,31,0.10)',
                }}
              />
            </div>
          </div>

          {/* Product info and actions */}
          <div className="md:w-1/2 w-full flex flex-col pr-2">
            <h1 className="font-[Playfair] font-bold uppercase tracking-[0.05em] leading-[100%] text-[48px] text-[#5A2408] mb-2">
              {product.name}
            </h1>
            <p className="font-[manrope] font-medium text-[37px] leading-[100%] tracking-[0.02em] text-[#431A06] mt-3 mb-3">
              ${displayPrice}
            </p>

            {/* Ratings */}
            <div className="flex items-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-center"
                  style={{
                    borderColor: '#5A2408',
                    color: '#5A2408',
                    width: '32px',
                    height: '26px',
                  }}
                >
                  <Star
                    size={24}
                    strokeWidth={1.9}
                    style={{
                      color: '#5A2408',
                      fill: i <= (product.rating || 5) ? '#5A2408' : 'none',
                    }}
                  />
                </div>
              ))}
              <span className="text-[#7D7D7D] text-base font-medium ml-2 mt-[2px] font-[manrope] text-[26px]">
                ({product.reviews || 0})
              </span>
            </div>

            {/* Description */}
            <div className="font-[Manrope] font-medium text-[20px] leading-[26px] tracking-[0.04em] align-middle text-[#666464] mt-4 mb-4">
              {product.description}
            </div>

            {/* Size selection */}
            <div className="flex items-center gap-3 mb-5 mt-1">
              <span className="font-[manrope] font-semibold text-[25px] tracking-[0.02em] text-[#3A3A3A] text-lg">
                Size:
              </span>
              <div className="flex gap-[10px]">
                {product.sizes?.map((sizeObj, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedSize(sizeObj.size);
                      setJustAdded(false);
                    }}
                    className={`flex items-center justify-center uppercase text-[16px] font-[Manrope] tracking-[0.02em] transition-all duration-150 w-[65px] h-[40px] px-[20px] py-[8px] border border-[#3A3A3A] opacity-100 ${
                      sizeObj.size === selectedSize
                        ? 'bg-[#3A3A3A] text-white border-b-[1.5px]'
                        : 'bg-white text-[#3A3A3A] border-b-[1px]'
                    }`}
                  >
                    {sizeObj.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart or View in Cart */}
            {isInCart ? (
              <button
                className="font-medium text-lg uppercase tracking-widest w-full py-3 mt-0 border-0 rounded-none bg-[#431A06] text-white"
                onClick={handleOpenCart} // OPEN CART on click
              >
                View in Cart
              </button>
            ) : (
              <button
                className="font-medium text-lg uppercase tracking-widest w-full py-3 mt-0 border-0 rounded-none bg-[#431A06] text-white"
                onClick={handleAdd}
              >
                Add to Cart
              </button>
            )}

            {/* Tabs */}
            <div className="mt-8">
              <div className="flex gap-2">
                {TAB.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key)}
                    className={`w-[158px] h-[80px] px-6 py-3 text-[16px] font-manrope font-normal uppercase tracking-[0.02em] text-center transition-all duration-75`}
                    style={{
                      background:
                        selectedTab === tab.key ? '#431A06' : '#EFE9E6',
                      color: selectedTab === tab.key ? '#FFFFFF' : '#343434',
                      lineHeight: '28px',
                      textTransform: 'uppercase',
                      verticalAlign: 'middle',
                      border: 'none',
                      borderRadius: 0,
                      letterSpacing: '2%',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[95px] pt-7 pb-3 text-[17px] tracking-wide rounded-none border-t-0">
                {selectedTab === 'description' && (
                  <div className="space-y-2">
                    <h3 className="text-[20px] font-manrope font-semibold text-[#3A3A3A] uppercase">
                      Details:
                    </h3>
                    <ul className="list-disc ml-6 mb-2 text-[16px] font-manrope text-[#343434]">
                      {Array.isArray(product.descriptionDetails)
                        ? product.descriptionDetails.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))
                        : product.description && <li>{product.description}</li>}
                    </ul>
                  </div>
                )}

                {selectedTab === 'fragrance' && (
                  <div className="flex flex-col gap-0">
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(product.fragrancenotes)
                        ? product.fragrancenotes.map((note, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-1 font-serif text-[15px]"
                              style={{
                                background: '#F0E7DF',
                                color: '#3F2E1F',
                              }}
                            >
                              {note}
                            </span>
                          ))
                        : product.fragrancenotes &&
                          Object.keys(product.fragrancenotes).map((section) =>
                            product.fragrancenotes[section].map((note, idx) => (
                              <span
                                key={section + idx}
                                className="px-4 py-1 font-serif text-[15px]"
                                style={{
                                  background: '#F0E7DF',
                                  color: '#3F2E1F',
                                }}
                              >
                                {note}
                              </span>
                            ))
                          )}
                    </div>
                    {product.fragrance_notes?.top?.length > 0 && (
                      <div className="mt-0">
                        <h3 className="text-[20px] font-manrope font-semibold text-[#3A3A3A] uppercase mb-2">
                          Notes:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {product.fragrance_notes.top.map((note, index) => (
                            <span
                              key={index}
                              className="px-10 py-4  text-white text-base flex items-center justify-center"
                              style={{
                                width: '105px',
                                height: '64px',
                                background: '#B59B8E',
                                opacity: 1,
                              }}
                            >
                              {note.charAt(0).toUpperCase() + note.slice(1)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedTab === 'additional' && (
                  <div className="space-y-2">
                    {product.concentration && (
                      <div>
                        <span className="font-manrope font-bold text-[16px] uppercase tracking-[0.02em] leading-[28px] text-[#343434]">
                          TYPE:
                        </span>{' '}
                        {product.concentration}
                      </div>
                    )}
                    {product.longevity && (
                      <div>
                        <span className="font-manrope font-bold text-[16px] uppercase tracking-[0.02em] leading-[28px] text-[#343434]">
                          LONGEVITY:
                        </span>{' '}
                        {product.longevity}
                      </div>
                    )}
                    {product.sillage && (
                      <div>
                        <span className="font-manrope font-bold text-[16px] uppercase tracking-[0.02em] leading-[28px] text-[#343434]">
                          PROJECTION:
                        </span>{' '}
                        {product.sillage}
                      </div>
                    )}
                    {product.volume && (
                      <div>
                        <span className="font-manrope font-bold text-[16px] uppercase tracking-[0.02em] leading-[28px] text-[#343434]">
                          VOLUME:
                        </span>{' '}
                        {product.volume}
                      </div>
                    )}
                  </div>
                )}

                {selectedTab === 'bestfor' && (
                  <div className="space-y-2">
                    {product.occasion && (
                      <div>
                        <span className="font-manrope font-bold text-[16px] uppercase tracking-[0.02em] leading-[28px] text-[#343434]">
                          PERFECT FOR:
                        </span>{' '}
                        {Array.isArray(product.occasion)
                          ? product.occasion.join(', ')
                          : product.occasion}
                      </div>
                    )}
                    {product.season && (
                      <div>
                        <span className="font-manrope font-bold text-[16px] uppercase tracking-[0.02em] leading-[28px] text-[#343434]">
                          BEST SEASON:
                        </span>{' '}
                        {Array.isArray(product.season)
                          ? product.season.join(', ')
                          : product.season}
                      </div>
                    )}
                    {product.sillage && (
                      <div>
                        <span className="font-manrope font-bold text-[16px] uppercase tracking-[0.02em] leading-[28px] text-[#343434]">
                          PROJECTION:
                        </span>{' '}
                        {product.sillage}
                      </div>
                    )}
                    {product.volume && (
                      <div>
                        <span className="font-manrope font-bold text-[16px] uppercase tracking-[0.02em] leading-[28px] text-[#343434]">
                          VOLUME:
                        </span>{' '}
                        {product.volume}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <h2
          className="mt-20 mb-8 text-center font-serif font-extrabold text-3xl tracking-widest uppercase"
          style={{ color: '#3F2E1F' }}
        >
          YOU MAY ALSO LIKE
        </h2>
        <div className="flex gap-10 justify-center">
          {relatedProducts.slice(0, 4).map((related, i) => (
            <div
              key={i}
              className="bg-white flex flex-col items-center relative border rounded-none w-[260px] min-h-[385px]"
              style={{ borderColor: '#ECE5DF' }}
            >
              <button
                className="absolute right-4 top-4"
                onClick={() => toggleWishlist(related)}
              >
                <Heart
                  size={22}
                  style={{
                    color: isInWishlist(related) ? '#3F2E1F' : '#ECE5DF',
                    fill: isInWishlist(related) ? '#3F2E1F' : 'none',
                    strokeWidth: 1.8,
                  }}
                />
              </button>
              <img
                src={related.images?.[0] || '/images/default-perfume.png'}
                alt={related.name}
                className="w-[98px] h-[130px] object-contain mt-10 mb-6"
              />
              <div
                className="font-serif text-lg uppercase font-semibold tracking-wide mb-1 text-center"
                style={{ color: '#3F2E1F' }}
              >
                {related.name}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={17}
                    strokeWidth={1.7}
                    style={{
                      color: '#3F2E1F',
                      fill: i <= (related.rating || 5) ? '#3F2E1F' : 'none',
                    }}
                  />
                ))}
              </div>
              <div
                className="text-center text-[#7D7D7D] text-base font-manrope"
                style={{ fontSize: '15px' }}
              >
                ${related.price}
              </div>
              <button
                onClick={() => navigate(`/product/${related._id}`)}
                className="mt-3 mb-5 py-2 px-5 text-sm uppercase font-medium bg-[#3F2E1F] text-white"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
      {/* Render Cart Sidebar */}
      <ProductCartSection isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
