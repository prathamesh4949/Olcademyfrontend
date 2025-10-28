import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { Star, Heart } from 'lucide-react';
import ProductService from '../services/productService';
import ScentService from '../services/scentService';

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
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [personalizationText, setPersonalizationText] = useState('');
  const [personalizationList, setPersonalizationList] = useState([]);
  const [selectedTab, setSelectedTab] = useState(TAB[0].key);

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

  const handleAdd = () => {
    if (personalizationText.trim() !== '') {
      setPersonalizationList([...personalizationList, personalizationText.trim()]);
      setPersonalizationText('');
    }
  };

  if (!product) return null;

  return (
    <div className="min-h-screen font-sans" style={{ background: '#F8F7F5', color: '#3F2E1F' }}>
      <Header />
      <main className="max-w-[1200px] mx-auto pt-12 pb-24 px-4 w-full">
        {/* Main area */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* Image */}
          <div className="md:w-1/2 w-full flex flex-col items-center">
            <img
              src={product.images?.[0] || '/images/default-perfume.png'}
              alt={product.name}
              className="w-[802px] h-[926] object-contain bg-white"
              style={{ boxShadow: '0px 12px 36px rgba(63,46,31,0.10)' }}
            />
          </div>
          {/* Details */}
          <div className="md:w-1/2 w-full flex flex-col pr-2">
            <h1 className="font-[Playfair] font-bold uppercase tracking-[0.05em] leading-[100%] text-[48px] text-[#5A2408] mb-2">
              {product.name}
            </h1>

            {/* Product Price */}
            <p className="font-[manrope] font-medium text-[37px] leading-[100%] tracking-[0.02em] text-[#431A06] mt-3 mb-3">
              ${product.price}
            </p>

            {/* Product Ratings */}
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

            <div className="font-[Manrope] font-medium text-[20px] leading-[26px] tracking-[0.04em] align-middle text-[#666464] mt-4 mb-4">
              {product.description}
            </div>

            {/* Size selection */}
          
            <div className="flex items-center gap-3 mb-5 mt-1">
              {/* Label */}
              <span className="font-[manrope] font-semibold text-[25px] tracking-[0.02em] text-[#3A3A3A] text-lg">
                Size:
              </span>

              {/* Sizes */}
              <div className="flex gap-[10px]">
                {product.sizes?.map((sizeObj, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(sizeObj.size)}
                    className={`flex items-center justify-center uppercase text-[16px] font-[Manrope] tracking-[0.02em] transition-all duration-150 w-[65px] h-[40px] px-[20px] py-[8px] border border-[#3A3A3A] opacity-100 ${
                      i === 1
                        ? 'bg-[#3A3A3A] text-white border-b-[1.5px]'
                        : 'bg-white text-[#3A3A3A] border-b-[1px]'
                    }`}
                  >
                    {sizeObj.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button
              className="font-medium text-lg uppercase tracking-widest w-full py-3 mt-0 border-0 rounded-none bg-[#431A06] text-white"
              onClick={() =>
                addToCart({ ...product, selectedSize, personalization: personalizationText })
              }
            >
              Add to Cart
            </button>
            
            

            {/* Personalize Section */}
            <div className="mt-4 w-full font-manrope">
              {/* Button */}
              <button
                className="w-full h-[56px] border-2 border-[#431A06] text-[#431A06] text-[22px] font-semibold tracking-wide uppercase flex items-center justify-center transition-all duration-200"
                onClick={() => setShowPersonalization(!showPersonalization)}
              >
                PERSONALIZE YOUR BOTTLE
              </button>

              {/* Input Section */}
              {showPersonalization && (
                <div className="mt-4 w-full">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={personalizationText}
                      onChange={(e) => setPersonalizationText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                      placeholder="add your notes"
                      className={`w-full h-[56px] px-5 pr-12 rounded border transition-all duration-200 outline-none text-[18px] font-manrope placeholder:text-[#7D7D7D] ${
                        personalizationText
                          ? 'bg-[#B59B8E] text-white border-none'
                          : 'bg-[#FAF6F0] text-[#3A3A3A] border border-[#7D7D7D]'
                      }`}
                    />

                    {/* Inline + button */}
                    <button
                      className={`absolute right-5 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center text-2xl font-bold transition-all duration-200 ${
                        personalizationText ? 'text-white' : 'text-[#7D7D7D]'
                      }`}
                      onClick={handleAdd}
                      type="button"
                      aria-label="Add"
                    >
                      +
                    </button>
                  </div>

                  {/* Display saved content */}
                  {personalizationList.map((item, index) => (
                    <div
                      key={index}
                      className="mt-2 flex items-center justify-between w-full h-[56px] px-5 rounded bg-[#B59B8E] text-white text-[18px] font-manrope"
                    >
                      <span>{item}</span>
                      <button
                        className="text-white text-2xl font-bold"
                        onClick={() =>
                          setPersonalizationList(personalizationList.filter((_, i) => i !== index))
                        }
                        type="button"
                        aria-label="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="mt-8">
              <div className="flex gap-2">
                {TAB.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key)}
                    className={`w-[158px] h-[80px] px-6 py-3 text-[16px] font-manrope font-normal uppercase tracking-[0.02em] text-center transition-all duration-75`}
                    style={{
                      background: selectedTab === tab.key ? '#431A06' : '#EFE9E6',
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

              <div className="min-h-[95px] pt-7 pb-3 text-[17px] tracking-wide rounded-none border-t-0">
              
                {/* DESCRIPTION */}
                {selectedTab === 'description' && (
                  <div className="space-y-2">
                    <h3 className="text-[20px] font-manrope font-semibold text-[#3A3A3A] uppercase">
                      Details:
                    </h3>
                    <ul className="list-disc ml-6 mb-2 text-[16px] font-manrope text-[#343434]">
                      {Array.isArray(product.descriptionDetails)
                        ? product.descriptionDetails.map((item, idx) => <li key={idx}>{item}</li>)
                        : product.description && <li>{product.description}</li>}
                    </ul>
                  </div>
                )}

               
                {/* FRAGRANCE PROFILE */}
                {selectedTab === 'fragrance' && (
                  <div className="flex flex-col gap-0">
                    {/* Existing fragrance notes */}
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(product.fragrancenotes)
                        ? product.fragrancenotes.map((note, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-1 font-serif text-[15px]"
                              style={{ background: '#F0E7DF', color: '#3F2E1F' }}
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
                                style={{ background: '#F0E7DF', color: '#3F2E1F' }}
                              >
                                {note}
                              </span>
                            ))
                          )}
                    </div>

                    {/* Top Notes Section */}
                    {product.fragrance_notes?.top?.length > 0 && (
                      <div className="mt-0">
                        {/* Heading on a separate line */}
                        <h3 className="text-[20px] font-manrope font-semibold text-[#3A3A3A] uppercase mb-2">
                          Notes:
                        </h3>

                        {/* Notes */}
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

               
                {/* ADDITIONAL INFORMATION */}
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

                
                {/* BEST FOR */}
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
                        {Array.isArray(product.season) ? product.season.join(', ') : product.season}
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
        {/* YOU MAY ALSO LIKE */}
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
              <button className="absolute right-4 top-4" onClick={() => toggleWishlist(related)}>
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
                {[1, 2, 3, 4, 5].map((j) => (
                  <Star
                    key={j}
                    size={16}
                    style={{
                      color: '#A89273',
                      fill: j <= (related.rating || 5) ? '#A89273' : 'none',
                    }}
                    strokeWidth={1.08}
                  />
                ))}
              </div>
              <div className="text-[#735F47] text-[15px] text-center mb-2 min-h-[33px] leading-snug">
                {related.shortDescription || ''}
              </div>
              <div className="font-serif text-2xl font-bold mb-2" style={{ color: '#3F2E1F' }}>
                ${related.price}
              </div>
              <button
                className="w-full py-3 font-serif uppercase text-base rounded-none font-semibold"
                style={{ background: '#3F2E1F', color: '#fff' }}
              >
                QUICK VIEW
              </button>
            </div>
          ))}
        </div>
        {/* Back to Home */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="font-serif uppercase text-lg px-8 py-3 border-2 rounded-none font-semibold tracking-wide"
            style={{ borderColor: '#3F2E1F', color: '#3F2E1F', background: 'none' }}
          >
            ← Back to Home
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
