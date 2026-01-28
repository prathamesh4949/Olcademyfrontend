import React from 'react';
import { Heart, ShoppingCart, Search, Menu, User } from 'lucide-react';

const PerfumeCard = () => (
  <div className="bg-white rounded-lg shadow-sm p-3 relative">
    <button className="absolute top-2 right-2 z-10 p-1.5 hover:bg-gray-100 rounded-full">
      <Heart className="w-4 h-4 text-gray-600" />
    </button>
    
    <div className="aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center">
      <div className="w-24 h-32 bg-gradient-to-b from-amber-100 to-amber-200 rounded relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-6 bg-gradient-to-b from-amber-400 to-amber-500 rounded-t" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-20 bg-gradient-to-br from-amber-900 to-amber-950 rounded flex items-center justify-center">
          <div className="text-amber-200 text-xs font-serif text-center">
            <div className="text-[8px] tracking-wider">VESARII</div>
            <div className="text-[6px] mt-0.5">Eau De Parfum</div>
          </div>
        </div>
      </div>
    </div>
    
    <h3 className="text-xs font-semibold text-amber-900 text-center mb-1.5">
      MOONLIT GARDENIA
    </h3>
    
    <div className="flex justify-center gap-0.5 mb-2">
      {[1, 2, 3, 4].map((star) => (
        <span key={star} className="text-amber-500 text-xs">★</span>
      ))}
      <span className="text-gray-300 text-xs">★</span>
    </div>
    
    <p className="text-[10px] text-gray-600 text-center mb-3 line-clamp-2">
      Just launched! Intoxicating white floral under moonlight. Sensual, dreamy, and utterly...
    </p>
    
    <div className="text-center mb-2">
      <span className="text-base font-bold text-amber-900">$92.00</span>
    </div>
    
    <button className="w-full bg-amber-900 hover:bg-amber-800 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-medium">
      <ShoppingCart className="w-3.5 h-3.5" />
      ADD TO CART
    </button>
  </div>
);

export default function PerfumeMobileGrid() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-amber-900 font-serif text-lg font-bold">M.L.</div>
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-gray-700" />
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              <User className="w-5 h-5 text-gray-700" />
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search For Perfume"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
        
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm whitespace-nowrap">
            <Menu className="w-4 h-4" />
            FILTERS
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm whitespace-nowrap">
            MEN'S
          </button>
          <button className="px-4 py-2 bg-amber-200 border border-amber-300 rounded-lg text-sm whitespace-nowrap font-medium">
            WOMEN'S
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm whitespace-nowrap">
            UNISEX
          </button>
        </div>
      </div>
      
      {/* Grid - Responsive: 1 column on very small, 2 on mobile, more on larger screens */}
      <div className="p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          <PerfumeCard />
          <PerfumeCard />
          <PerfumeCard />
          <PerfumeCard />
          <PerfumeCard />
          <PerfumeCard />
        </div>
      </div>
    </div>
  );
}