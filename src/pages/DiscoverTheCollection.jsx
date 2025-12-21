import React from "react";

const collections = [
  {
    id: 1,
    name: "Signature Collection",
    description: "Our most iconic fragrances, crafted for timeless elegance.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f",
  },
  {
    id: 2,
    name: "Summer Scents",
    description: "Fresh, vibrant fragrances inspired by warm summer days.",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f",
  },
  {
    id: 3,
    name: "Oud Collection",
    description: "Deep, intense oud blends with a luxurious character.",
    image: "https://images.unsplash.com/photo-1610465299993-e6675c9f9efa",
  },
  {
    id: 4,
    name: "Customer Favourites",
    description: "Loved and chosen by our customers across the globe.",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad",
  },
];

export default function DiscoverCollection() {
  return (
    <div className="bg-[#faf7f3] min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-serif text-[#2c1b12] mb-4">
          Discover the Collection
        </h1>
        <p className="max-w-2xl mx-auto text-[#6b4a3a] text-lg">
          Explore our curated perfume collections — where rare ingredients,
          craftsmanship, and emotion come together.
        </p>
      </section>

      {/* Collection Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {collections.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition"
            >
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-64 w-full object-cover transform group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-serif text-[#2c1b12] mb-2">
                  {item.name}
                </h3>
                <p className="text-sm text-[#6b4a3a] mb-4">
                  {item.description}
                </p>
                <button className="px-6 py-2 border border-[#2c1b12] text-[#2c1b12] text-sm tracking-wider hover:bg-[#2c1b12] hover:text-white transition">
                  EXPLORE
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
