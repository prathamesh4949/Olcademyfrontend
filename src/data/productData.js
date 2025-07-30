// productData.js - Centralized product data for search functionality

// Hover images array
const hoverImages = [
  "/images/newimg2.PNG",
  "/images/newimg3.PNG", 
  "/images/newimg4.PNG",
  "/images/newimg5.PNG",
  "/images/newimg6.png",
  "/images/newimg7.jpeg",
  "/images/newimg8.jpeg",
  "/images/newimg1.PNG",
  "/images/newimg2.PNG",
  "/images/newimg3.PNG",
  "/images/newimg4.PNG",
  "/images/newimg5.PNG"
];

// All products from HomePage
export const homePageProducts = {
  fragrantFavourites: [
    { id: 1, name: "Aventus", price: 455, image: "/images/newimg1.PNG", hoverImage: hoverImages[0], category: "home", description: "Exquisite fragrance notes" },
    { id: 2, name: "Oud Wood", price: 455, image: "/images/newimg2.PNG", hoverImage: hoverImages[1], category: "home", description: "Exquisite fragrance notes" },
    { id: 3, name: "Creed", price: 455, image: "/images/newimg3.PNG", hoverImage: hoverImages[2], category: "home", description: "Exquisite fragrance notes" },
    { id: 7, name: "Royal Essence", price: 520, image: "/images/newimg4.PNG", hoverImage: hoverImages[3], category: "home", description: "Exquisite fragrance notes" },
    { id: 8, name: "Mystic Rose", price: 480, image: "/images/newimg5.PNG", hoverImage: hoverImages[4], category: "home", description: "Exquisite fragrance notes" },
    { id: 9, name: "Golden Amber", price: 495, image: "/images/newimg6.png", hoverImage: hoverImages[5], category: "home", description: "Exquisite fragrance notes" },
  ],
  summerScents: [
    { id: 4, name: "Citrus Bloom", image: "/images/newimg7.jpeg", hoverImage: hoverImages[6], price: 455, category: "summer", description: "An expression of lush orange. Sharp yet sweet." },
    { id: 5, name: "Island Breeze", image: "/images/newimg8.jpeg", hoverImage: hoverImages[7], price: 399, category: "summer", description: "A tropical escape in every spritz golden sunshine." },
    { id: 6, name: "Sunlit Amber", image: "/images/newimg1.PNG", hoverImage: hoverImages[0], price: 430, category: "summer", description: "Amber warmth wrapped in golden sunshine." },
    { id: 10, name: "Ocean Mist", image: "/images/newimg2.PNG", hoverImage: hoverImages[1], price: 420, category: "summer", description: "Fresh sea breeze with hints of salt and seaweed." },
    { id: 11, name: "Tropical Paradise", image: "/images/newimg3.PNG", hoverImage: hoverImages[2], price: 465, category: "summer", description: "Exotic fruits and coconut transport you to paradise." },
    { id: 12, name: "Summer Rain", image: "/images/newimg4.PNG", hoverImage: hoverImages[3], price: 445, category: "summer", description: "Petrichor and fresh flowers after summer rain." },
  ]
};

// Men's Collection Products
export const mensProducts = {
  justArrived: [
    { id: 21, name: 'Royal Oud', price: 455, description: 'A rich and sophisticated blend of premium oud wood with royal essence', image: "/images/newimg1.PNG", hoverImage: hoverImages[0], category: "men", collection: "just-arrived" },
    { id: 22, name: 'Midnight Steel', price: 485, description: 'Bold and masculine fragrance with metallic undertones and dark spices', image: "/images/newimg2.PNG", hoverImage: hoverImages[1], category: "men", collection: "just-arrived" },
    { id: 23, name: 'Cedar Storm', price: 425, description: 'Fresh cedar wood combined with stormy sea breeze elements', image: "/images/newimg3.PNG", hoverImage: hoverImages[2], category: "men", collection: "just-arrived" },
    { id: 24, name: 'Amber Legend', price: 520, description: 'Legendary amber blend with hints of leather and tobacco', image: "/images/newimg4.PNG", hoverImage: hoverImages[3], category: "men", collection: "just-arrived" },
    { id: 25, name: 'Black Diamond', price: 575, description: 'Luxurious black diamond essence with precious wood notes', image: "/images/newimg5.PNG", hoverImage: hoverImages[4], category: "men", collection: "just-arrived" },
    { id: 26, name: 'Fire Stone', price: 445, description: 'Fiery spices meet cool stone minerals in perfect harmony', image: "/images/newimg6.png", hoverImage: hoverImages[5], category: "men", collection: "just-arrived" }
  ],
  bestSellers: [
    { id: 27, name: 'Golden Eagle', price: 495, description: 'Soaring high with golden citrus and powerful woody base', image: "/images/newimg7.jpeg", hoverImage: hoverImages[6], category: "men", collection: "best-sellers" },
    { id: 28, name: 'Ocean Depth', price: 435, description: 'Deep oceanic blend with aquatic freshness and marine minerals', image: "/images/newimg8.jpeg", hoverImage: hoverImages[7], category: "men", collection: "best-sellers" },
    { id: 29, name: 'Wild Hunter', price: 465, description: 'Untamed wilderness captured in a bottle with wild herbs and musk', image: "/images/newimg1.PNG", hoverImage: hoverImages[8], category: "men", collection: "best-sellers" },
    { id: 30, name: 'Storm Breaker', price: 510, description: 'Powerful storm energy with lightning-fresh citrus and thunder-deep woods', image: "/images/newimg2.PNG", hoverImage: hoverImages[9], category: "men", collection: "best-sellers" },
    { id: 31, name: 'Crimson Knight', price: 545, description: 'Noble fragrance with red berries and knight-worthy strength', image: "/images/newimg3.PNG", hoverImage: hoverImages[10], category: "men", collection: "best-sellers" },
    { id: 32, name: 'Phoenix Rising', price: 480, description: 'Reborn from ashes with smoky incense and golden amber', image: "/images/newimg4.PNG", hoverImage: hoverImages[11], category: "men", collection: "best-sellers" }
  ],
  premium: [
    { id: 33, name: 'Emperor\'s Crown', price: 650, description: 'Royal fragrance fit for an emperor with rare saffron and gold leaf', image: "/images/newimg5.PNG", hoverImage: hoverImages[0], category: "men", collection: "premium" },
    { id: 34, name: 'Platinum Rush', price: 625, description: 'Precious metal essence with platinum-bright citrus and silver cedar', image: "/images/newimg6.png", hoverImage: hoverImages[1], category: "men", collection: "premium" },
    { id: 35, name: 'Dark Sovereign', price: 685, description: 'Supreme darkness with black truffle and midnight jasmine', image: "/images/newimg7.jpeg", hoverImage: hoverImages[2], category: "men", collection: "premium" },
    { id: 36, name: 'Titan Force', price: 595, description: 'Titanium strength with metallic herbs and power-packed spices', image: "/images/newimg8.jpeg", hoverImage: hoverImages[3], category: "men", collection: "premium" },
    { id: 37, name: 'Mystic Warrior', price: 615, description: 'Ancient warrior spirit with mystical herbs and battle-worn leather', image: "/images/newimg1.PNG", hoverImage: hoverImages[4], category: "men", collection: "premium" },
    { id: 38, name: 'Infinity Edge', price: 705, description: 'Endless sophistication with infinite layers of rare ingredients', image: "/images/newimg2.PNG", hoverImage: hoverImages[5], category: "men", collection: "premium" }
  ]
};

// Women's Collection Products
export const womensProducts = {
  justArrived: [
    { id: 41, name: 'Rose Elegance', price: 465, description: 'A timeless blend of Bulgarian rose petals with delicate jasmine undertones', image: "/images/newimg1.PNG", hoverImage: hoverImages[0], category: "women", collection: "just-arrived" },
    { id: 42, name: 'Midnight Bloom', price: 495, description: 'Mysterious night-blooming flowers with hints of vanilla and sandalwood', image: "/images/newimg2.PNG", hoverImage: hoverImages[1], category: "women", collection: "just-arrived" },
    { id: 43, name: 'Golden Orchid', price: 435, description: 'Exotic orchid essence combined with warm amber and golden honey', image: "/images/newimg3.PNG", hoverImage: hoverImages[2], category: "women", collection: "just-arrived" },
    { id: 44, name: 'Crystal Blossom', price: 530, description: 'Pure white florals with crystal-clear musk and soft powder notes', image: "/images/newimg4.PNG", hoverImage: hoverImages[3], category: "women", collection: "just-arrived" },
    { id: 45, name: 'Velvet Peony', price: 585, description: 'Luxurious peony petals wrapped in velvet musk and silk accord', image: "/images/newimg5.PNG", hoverImage: hoverImages[4], category: "women", collection: "just-arrived" },
    { id: 46, name: 'Enchanted Garden', price: 455, description: 'A magical garden blend of lily, gardenia, and morning dew', image: "/images/newimg6.png", hoverImage: hoverImages[5], category: "women", collection: "just-arrived" }
  ],
  bestSellers: [
    { id: 47, name: 'Diamond Essence', price: 505, description: 'Sparkling citrus top notes with precious diamond dust accord', image: "/images/newimg7.jpeg", hoverImage: hoverImages[6], category: "women", collection: "best-sellers" },
    { id: 48, name: 'Moonlight Serenade', price: 445, description: 'Romantic moonlit florals with soft violin string harmonies', image: "/images/newimg8.jpeg", hoverImage: hoverImages[7], category: "women", collection: "best-sellers" },
    { id: 49, name: 'Secret Garden', price: 475, description: 'Hidden garden blooms with mysterious herb and moss undertones', image: "/images/newimg1.PNG", hoverImage: hoverImages[8], category: "women", collection: "best-sellers" },
    { id: 50, name: 'Silk Whisper', price: 520, description: 'Gentle silk accord with whispered florals and cashmere warmth', image: "/images/newimg2.PNG", hoverImage: hoverImages[9], category: "women", collection: "best-sellers" },
    { id: 51, name: 'Royal Bouquet', price: 555, description: 'Majestic floral arrangement with royal crown jewel essences', image: "/images/newimg3.PNG", hoverImage: hoverImages[10], category: "women", collection: "best-sellers" },
    { id: 52, name: 'Angel\'s Touch', price: 490, description: 'Heavenly light florals with angelic musk and cloud-soft powder', image: "/images/newimg4.PNG", hoverImage: hoverImages[11], category: "women", collection: "best-sellers" }
  ],
  premium: [
    { id: 53, name: 'Empress Crown', price: 670, description: 'Imperial fragrance with rare saffron, gold rose, and precious gems', image: "/images/newimg5.PNG", hoverImage: hoverImages[0], category: "women", collection: "premium" },
    { id: 54, name: 'Platinum Rose', price: 645, description: 'Precious platinum-infused rose with silver cedar and diamond dew', image: "/images/newimg6.png", hoverImage: hoverImages[1], category: "women", collection: "premium" },
    { id: 55, name: 'Dark Goddess', price: 705, description: 'Divine darkness with black orchid, midnight truffle, and shadow musk', image: "/images/newimg7.jpeg", hoverImage: hoverImages[2], category: "women", collection: "premium" },
    { id: 56, name: 'Crystal Queen', price: 615, description: 'Crystalline beauty with transparent florals and queen\'s crown accord', image: "/images/newimg8.jpeg", hoverImage: hoverImages[3], category: "women", collection: "premium" },
    { id: 57, name: 'Mystic Princess', price: 635, description: 'Enchanted princess essence with mystical herbs and fairy dust', image: "/images/newimg1.PNG", hoverImage: hoverImages[4], category: "women", collection: "premium" },
    { id: 58, name: 'Infinity Grace', price: 725, description: 'Endless elegance with infinite layers of graceful floral harmony', image: "/images/newimg2.PNG", hoverImage: hoverImages[5], category: "women", collection: "premium" }
  ]
};

// Unisex Collection Products
export const unisexProducts = {
  justArrived: [
    { id: 61, name: 'Aventus Unisex', price: 485, description: 'A new expression of bitter Orange. Sharp yet sweet with universal appeal', image: "/images/newimg1.PNG", hoverImage: hoverImages[0], category: "unisex", collection: "just-arrived" },
    { id: 62, name: 'Cosmic Harmony', price: 465, description: 'Perfect balance of masculine and feminine notes in cosmic unity', image: "/images/newimg2.PNG", hoverImage: hoverImages[1], category: "unisex", collection: "just-arrived" },
    { id: 63, name: 'Golden Fusion', price: 525, description: 'Luxurious blend that transcends gender boundaries with golden elegance', image: "/images/newimg3.PNG", hoverImage: hoverImages[2], category: "unisex", collection: "just-arrived" },
    { id: 64, name: 'Mystic Waters', price: 445, description: 'Aquatic freshness with mysterious depths for everyone', image: "/images/newimg4.PNG", hoverImage: hoverImages[3], category: "unisex", collection: "just-arrived" },
    { id: 65, name: 'Velvet Dreams', price: 505, description: 'Soft velvet touch with dreamy florals and woods', image: "/images/newimg5.PNG", hoverImage: hoverImages[4], category: "unisex", collection: "just-arrived" },
    { id: 66, name: 'Urban Spirit', price: 475, description: 'Modern city vibes with contemporary unisex appeal', image: "/images/newimg6.png", hoverImage: hoverImages[5], category: "unisex", collection: "just-arrived" }
  ],
  bestSellers: [
    { id: 67, name: 'Eternal Bliss', price: 515, description: 'Timeless fragrance that captures eternal happiness for all', image: "/images/newimg7.jpeg", hoverImage: hoverImages[6], category: "unisex", collection: "best-sellers" },
    { id: 68, name: 'Crystal Clear', price: 455, description: 'Pure and transparent scent with crystal-like clarity', image: "/images/newimg8.jpeg", hoverImage: hoverImages[7], category: "unisex", collection: "best-sellers" },
    { id: 69, name: 'Midnight Sun', price: 495, description: 'Paradoxical blend of night and day in perfect harmony', image: "/images/newimg1.PNG", hoverImage: hoverImages[8], category: "unisex", collection: "best-sellers" },
    { id: 70, name: 'Silk Road', price: 535, description: 'Exotic journey through ancient silk trading routes', image: "/images/newimg2.PNG", hoverImage: hoverImages[9], category: "unisex", collection: "best-sellers" },
    { id: 71, name: 'Phoenix Fire', price: 565, description: 'Rebirth and transformation in a unisex masterpiece', image: "/images/newimg3.PNG", hoverImage: hoverImages[10], category: "unisex", collection: "best-sellers" },
    { id: 72, name: 'Ocean Breeze', price: 435, description: 'Fresh oceanic winds with universal marine appeal', image: "/images/newimg4.PNG", hoverImage: hoverImages[11], category: "unisex", collection: "best-sellers" }
  ],
  huntsman: [
    { id: 73, name: 'Savile Elegance', price: 625, description: 'Refined sophistication tailored for modern individuals', image: "/images/newimg5.PNG", hoverImage: hoverImages[0], category: "unisex", collection: "huntsman" },
    { id: 74, name: 'Royal Heritage', price: 595, description: 'Traditional craftsmanship meets contemporary unisex appeal', image: "/images/newimg6.png", hoverImage: hoverImages[1], category: "unisex", collection: "huntsman" },
    { id: 75, name: 'London Mist', price: 555, description: 'Mysterious London fog captured in an elegant bottle', image: "/images/newimg7.jpeg", hoverImage: hoverImages[2], category: "unisex", collection: "huntsman" },
    { id: 76, name: 'Gentleman\'s Code', price: 645, description: 'Timeless code of elegance for the modern gentleman and lady', image: "/images/newimg8.jpeg", hoverImage: hoverImages[3], category: "unisex", collection: "huntsman" },
    { id: 77, name: 'Tailored Dreams', price: 575, description: 'Perfectly crafted dreams in a bespoke fragrance', image: "/images/newimg1.PNG", hoverImage: hoverImages[4], category: "unisex", collection: "huntsman" },
    { id: 78, name: 'Mayfair Nights', price: 685, description: 'Luxurious evenings in London\'s most prestigious district', image: "/images/newimg2.PNG", hoverImage: hoverImages[5], category: "unisex", collection: "huntsman" }
  ]
};

// Function to get all products in a flat array
export const getAllProducts = () => {
  const allProducts = [];
  
  // Add home page products
  allProducts.push(...homePageProducts.fragrantFavourites);
  allProducts.push(...homePageProducts.summerScents);
  
  // Add men's products
  allProducts.push(...mensProducts.justArrived);
  allProducts.push(...mensProducts.bestSellers);
  allProducts.push(...mensProducts.premium);
  
  // Add women's products
  allProducts.push(...womensProducts.justArrived);
  allProducts.push(...womensProducts.bestSellers);
  allProducts.push(...womensProducts.premium);
  
  // Add unisex products
  allProducts.push(...unisexProducts.justArrived);
  allProducts.push(...unisexProducts.bestSellers);
  allProducts.push(...unisexProducts.huntsman);
  
  return allProducts;
};

// Search function
export const searchProducts = (query, filters = {}) => {
  const allProducts = getAllProducts();
  
  if (!query && Object.keys(filters).length === 0) {
    return allProducts;
  }
  
  return allProducts.filter(product => {
    // Text search
    const matchesQuery = !query || 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase());
    
    // Category filter
    const matchesCategory = !filters.category || 
      product.category === filters.category;
    
    // Price range filter
    const matchesPriceRange = !filters.priceRange || 
      (product.price >= filters.priceRange.min && product.price <= filters.priceRange.max);
    
    return matchesQuery && matchesCategory && matchesPriceRange;
  });
};