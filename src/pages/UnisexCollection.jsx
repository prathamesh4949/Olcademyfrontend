import React, { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { motion } from "framer-motion";
import { fadeIn } from "@/variants";

// Images
import aventus1 from "../../public/images/Export2.png";
import marmaladeBanner from "../../public/images/Export2.png";
import velourNoire from "../../public/images/Export2.png";

const UnisexCollection = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      setDarkMode(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const products = [
    {
      name: "Aventus",
      price: "$455",
      description: "A new expression of bitter Orange. Sharp yet sweet",
      image: aventus1,
    },
    {
      name: "Aventus",
      price: "$455",
      description: "A new expression of bitter Orange. Sharp yet sweet",
      image: aventus1,
    },
    {
      name: "Aventus",
      price: "$455",
      description: "A new expression of bitter Orange. Sharp yet sweet",
      image: aventus1,
    },
  ];

  return (
    <div className="bg-white dark:bg-black text-[#79300f] dark:text-[#f6d110]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="max-w-7xl mx-auto py-12 px-4">
        {/* Intro */}
        <motion.section
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="text-center px-6 mb-10"
        >
          <h2 className="text-3xl font-semibold text-[#4b2c10] my-6">
            Unisex's Fragrances
          </h2>
          <p className="text-[18px] text-[#3d2b1f] leading-relaxed max-w-3xl mx-auto">
            Creating iconic hand-crafted perfume for men, Creed has established
            a legacy of acclaimed fragrance, cologne and aftershave for men.
            Explore our collection of bestselling Creed men’s fragrance,
            including <u>Aventus</u> and <u>Silver Mountain Water</u>, the
            classic and woody <u>Royal Oud</u> and <u>Green Irish Tweed</u>.
          </p>
        </motion.section>

        {/* Just Arrived */}
        <motion.section className="py-10">
          <h3 className="text-2xl font-semibold text-center mb-8">
            Just Arrived
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
            {products.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#D9D9D9] p-4 text-center shadow rounded-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-contain mb-4"
                />
                <h4 className="text-xl font-semibold mb-2">{item.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <p className="text-lg font-bold mb-4">{item.price}</p>
                <button className="bg-[#79300f] text-white px-4 py-2 rounded">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Marmalade Banner */}
        <motion.section className="py-16 relative">
          <img
            src={marmaladeBanner}
            alt="Shop Marmalade"
            className="w-full h-[400px] object-cover rounded-md"
          />
          <div className="absolute bottom-6 left-6 bg-white px-4 py-2 font-semibold">
            Shop Orange Marmalade Cologne
          </div>
        </motion.section>

        {/* Best Sellers */}
        <motion.section className="py-12 bg-[#f8f8f8]">
          <h3 className="text-2xl font-semibold text-center mb-8">
            Best Sellers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
            {products.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#D9D9D9] p-4 text-center shadow rounded-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-contain mb-4"
                />
                <h4 className="text-xl font-semibold mb-2">{item.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <p className="text-lg font-bold mb-4">{item.price}</p>
                <button className="bg-[#79300f] text-white px-4 py-2 rounded">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="bg-[#79300f] text-white px-6 py-2 rounded text-lg">
              See More
            </button>
          </div>
        </motion.section>

        {/* Velour Noire Section */}
        <motion.section className="py-16 flex flex-col md:flex-row items-center gap-12">
          <img
            src={velourNoire}
            alt="Velour Noire"
            className="w-full md:w-1/2 rounded-lg"
          />
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-4">Velour Noire</h3>
            <p className="text-gray-700 mb-6">
              A unique mystery. A touch of opulence. Velour Noire reveals an
              intimate side of fragrance. Notes of black truffle, rich cocoa,
              and tonka beans create a bold trail that exudes personal
              attitude.
            </p>
            <button className="bg-[#79300f] text-white px-4 py-2 rounded">
              Shop Now
            </button>
          </div>
        </motion.section>

        {/* Huntsman Savile Row */}
        <motion.section className="py-12">
          <h3 className="text-center text-xl font-semibold mb-2">
            Huntsman Savile Row
          </h3>
          <p className="text-center text-sm mb-10">
            A collection of refined colognes and candles tailored to the modern
            man.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
            {products.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 text-center shadow rounded-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-contain mb-4"
                />
                <h4 className="text-xl font-semibold mb-2">{item.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <p className="text-lg font-bold mb-4">{item.price}</p>
                <button className="bg-[#79300f] text-white px-4 py-2 rounded">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default UnisexCollection;
