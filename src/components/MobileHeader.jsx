import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, Menu } from 'lucide-react';

export default function VesariiHeader() {
  const [activeTab, setActiveTab] = useState('men');

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Logo - Centered on mobile, left on desktop */}
      <div className="px-4 py-4 flex justify-center md:justify-start">
        <div className="flex flex-col items-center justify-center text-amber-900">
          <div className="flex gap-0.5 mb-0.5">
            <div className="w-2 h-3 bg-amber-900 transform -skew-x-12"></div>
            <div className="w-2 h-4 bg-amber-900"></div>
            <div className="w-2 h-3 bg-amber-900 transform skew-x-12"></div>
          </div>
          <div className="text-[10px] font-serif font-bold tracking-[0.15em]">VESARII</div>
          <div className="flex gap-0.5 mt-0.5">
            <div className="w-2 h-3 bg-amber-900 transform skew-x-12"></div>
            <div className="w-2 h-4 bg-amber-900"></div>
            <div className="w-2 h-3 bg-amber-900 transform -skew-x-12"></div>
          </div>
        </div>
      </div>

      {/* Mobile Icons Row - Only on mobile */}
      <div className="px-4 pb-4 flex md:hidden items-center justify-center gap-8">
        <button className="p-0">
          <Menu className="w-7 h-7 text-amber-900" strokeWidth={1.5} />
        </button>
        <button className="p-0">
          <Search className="w-7 h-7 text-amber-900" strokeWidth={1.5} />
        </button>
        <button className="p-0">
          <Heart className="w-7 h-7 text-amber-900" strokeWidth={1.5} />
        </button>
        <button className="p-0">
          <ShoppingBag className="w-7 h-7 text-amber-900" strokeWidth={1.5} />
        </button>
        <button className="p-0">
          <User className="w-7 h-7 text-amber-900" strokeWidth={1.5} />
        </button>
      </div>

      {/* Desktop Layout - Hidden on mobile */}
      <div className="hidden md:block px-4 pb-4">
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search For Perfume"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-amber-900 text-gray-600 text-sm"
            />
          </div>

          {/* Desktop Icons */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button className="p-0">
              <Heart className="w-7 h-7 text-amber-900" strokeWidth={1.5} />
            </button>
            <button className="p-0">
              <ShoppingBag className="w-7 h-7 text-amber-900" strokeWidth={1.5} />
            </button>
            <button className="p-0">
              <User className="w-7 h-7 text-amber-900" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Desktop */}
        <div className="mt-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 border-2 border-amber-900 rounded-lg text-amber-900 bg-white whitespace-nowrap">
              <Menu className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">FILTERS</span>
            </button>
            
            <button
              onClick={() => setActiveTab('men')}
              className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap tracking-wide ${
                activeTab === 'men'
                  ? 'bg-amber-400 text-amber-900'
                  : 'bg-gray-100 text-amber-900'
              }`}
            >
              MEN'S
            </button>
            
            <button
              onClick={() => setActiveTab('women')}
              className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap relative tracking-wide ${
                activeTab === 'women'
                  ? 'bg-amber-400 text-amber-900'
                  : 'bg-gray-100 text-amber-900'
              }`}
            >
              WOMEN'S
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                A
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('unisex')}
              className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap tracking-wide ${
                activeTab === 'unisex'
                  ? 'bg-amber-400 text-amber-900'
                  : 'bg-gray-100 text-amber-900'
              }`}
            >
              UNISEX
            </button>
            
            <button
              onClick={() => setActiveTab('gifts')}
              className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap tracking-wide ${
                activeTab === 'gifts'
                  ? 'bg-amber-400 text-amber-900'
                  : 'bg-gray-100 text-amber-900'
              }`}
            >
              GIFTS
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </header>
  );
}