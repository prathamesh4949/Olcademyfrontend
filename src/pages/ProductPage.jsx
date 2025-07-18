import React, { useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('100ML');

  return (
    <div className="bg-[#f3f3f3] dark:bg-black text-[#1a1a1a] dark:text-white">
      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
        {/* Left - Main Image */}
        <div className="flex flex-col items-center gap-4">
          <img src="/images/ember-nocturne.png" alt="Ember Nocturne" className="w-[350px]" />
          <img src="/images/sample-1.jpg" alt="Thumbnail" className="w-[80px]" />
        </div>

        {/* Right - Info */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Ember Nocturne</h2>
          <p className="text-sm mb-2 text-gray-600 dark:text-gray-300">Lavender, Cedar, & Leather</p>
          <p className="text-lg font-semibold mb-4">$499</p>

          <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
            In this versatile creation, lavender rests on a spicy story of distinction and warmth,
            softened by a creamy cedar note and grounded by bold leather accords.
          </p>

          <div className="flex gap-2 mb-4">
            {["30ML", "50ML", "100ML"].map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`border px-4 py-2 text-sm ${selectedSize === size ? 'bg-black text-white' : ''}`}
              >
                {size}
              </button>
            ))}
          </div>

          <Button label="Personalize My Bottle" className="mb-2 w-full" />

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              min={1}
              className="w-12 border px-2 py-1 text-center"
            />
            <Button label="Add to Cart" />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-xl font-semibold mb-4">Story of Ember Nocturne</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            A heightened mix of elegance and boldness that reflects passion,
            confidence, and the mysterious provocation around midnight.
          </p>
        </div>
        <div>
          <img src="/images/sample-2.jpg" alt="Story" className="w-full rounded" />
        </div>
      </section>

      {/* Ingredients Section */}
      <section className="bg-white dark:bg-[#121212] py-16 text-center">
        <h3 className="text-xl font-semibold mb-6">Fragrance Ingredients</h3>
        <div className="relative inline-block">
          <img src="/images/ingredients.jpg" alt="Ingredients" className="rounded-xl max-w-[700px]" />
          <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-[#2c2c2c] text-black dark:text-white px-4 py-2 rounded-full shadow">
            Ingredients
          </button>
        </div>
      </section>

      {/* Similar Fragrances */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h3 className="text-xl font-semibold mb-6 text-center text-[#b14527]">Similar Fragrances</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-[#1a1a1a] p-4 rounded shadow text-center">
              <FiHeart className="ml-auto text-xl mb-2" />
              <img src="/images/sample-1.jpg" alt="Aventus" className="mx-auto w-[120px]" />
              <h4 className="text-sm font-semibold mt-2">Aventus</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300">A new expression of bitter Orange, Sharp yet Sweet</p>
              <p className="font-semibold mt-1">$455</p>
              <Button label="Add to Cart" className="mt-2" />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductPage;
