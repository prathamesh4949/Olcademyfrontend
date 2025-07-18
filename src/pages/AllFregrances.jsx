

import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import Header from '../components/common/Header';
import Footer from '@/components/common/Footer';
import amberNocturne1 from './Men/assets/aventus1.jpg';
import { motion } from 'framer-motion';
import { fadeIn } from '../variants';



import Export from '../../public/images/Export.png'
import Export2 from '../../public/images/Export2.png'
import Export3 from '../../public/images/Export3.png'

const AllFragrancesSection = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      setDarkMode(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-[#fff9c7] text-[#79300f] dark:bg-[#220104] dark:text-[#f6d110]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Banner Section */}
      <motion.section
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.4 }}
        className="relative h-[500px] bg-[#3a1c0e] dark:bg-[#220104] text-white flex items-center justify-center text-center"
      >
        <motion.img
          variants={fadeIn("left", 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          src={amberNocturne1}
          alt="All Fragrances Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <motion.div
          variants={fadeIn("up", 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="relative z-10 px-4"
        >
          <motion.h2
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            className="text-5xl font-semibold mb-4"
          >
            All Fragrances
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            className="max-w-xl mx-auto text-lg"
          >
            Discover the complete collection of Creed fragrances exclusively on the official Creed online boutique. Creating iconic hand-crafted perfume since 1760, Creed has established a legacy of acclaimed fragrances, treasured by perfume connoisseurs around the world for their quality, timelessness and sophistication.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Men’s Fragrances Grid */}
      <motion.section
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.4 }}
        className="py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-center"
      >
        {[1, 2].map((_, idx) => (
          <motion.div
            key={idx}
            variants={fadeIn("up", 0.4 + idx * 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            className="flex flex-col items-center"
          >
            <motion.img
              variants={fadeIn("right", 0.6)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.4 }}
              src={Export}
              alt="Men's Fragrance"
              className="w-[446px] h-[592px] object-contain mb-6"
            />
            <motion.h3
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.4 }}
              className="text-2xl  font-semibold text-[#5e160e] dark:text-[#f6d110] mb-2 "
            >
              Men’s Fragrances
            </motion.h3>
            <motion.a
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.4 }}
              href="/mens-collection"
              className="text-sm text-[#5e160e] underline underline-offset-4 hover:text-[#79300f] dark:text-[#f6d110] dark:hover:text-yellow-300"
            >
              Discover More
            </motion.a>
          </motion.div>
        ))}
      </motion.section>

      {/* Universal Collection Section */}
      <motion.section
        variants={fadeIn("left", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.4 }}
        className="py-20 px-6 bg-[#f6d110] dark:bg-[rgb(2,22,18)] flex flex-col lg:flex-row items-center justify-between gap-12"
      >
        <motion.div
          variants={fadeIn("left", 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="flex-1"
        >
          <motion.img
            variants={fadeIn("left", 0.6)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            src={Export2}
            alt="Universal Collection"
            className="w-[1440px] h-[910px] object-contain mx-auto"
          />
        </motion.div>
        <motion.div
          variants={fadeIn("right", 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="flex-1 max-w-[600px] text-left"
        >
          <motion.h2
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            className="text-5xl font-semibold text-[#79300f] dark:text-yellow-300 mb-4"
          >
            Universal Collection
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            className="text-lg text-[#3d2b1f] dark:text-white mb-6"
          >
            Meet VESARII Ember Nocturne — a perfume forged in twilight, kissed by wild lavender, smoked cedar, and a whisper of fire-kissed amber. Designed to enchant from the very first breath.
          </motion.p>
          <motion.a
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            href="/universal-collection"
            className="text-sm text-[#5e160e] underline underline-offset-4 hover:text-[#79300f] dark:text-yellow-200 dark:hover:text-white"
          >
            Discover More
          </motion.a>
        </motion.div>
      </motion.section>

      {/* Women’s Fragrances Grid */}
      <motion.section
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.4 }}
        className="py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-center"
      >
        {[1, 2].map((_, idx) => (
          <motion.div
            key={idx}
            variants={fadeIn("up", 0.4 + idx * 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            className="flex flex-col items-center"
          >
            <motion.img
              variants={fadeIn("left", 0.6)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.4 }}
              src={Export}
              alt="Women's Fragrance"
              className="w-[446px] h-[592px] object-contain mb-6"
            />
            <motion.h3
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.4 }}
              className="text-2xl font-semibold text-[#5e160e] dark:text-[#f6d110] mb-2"
            >
              Women’s Fragrances
            </motion.h3>
            <motion.a
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.4 }}
              href="/womens-collection"
              className="text-sm text-[#5e160e] underline underline-offset-4 hover:text-[#79300f] dark:text-[#f6d110] dark:hover:text-yellow-300"
            >
              Discover More
            </motion.a>
          </motion.div>
        ))}
      </motion.section>

      {/* Les Royales & Acqua Originale Section */}
      <motion.section
        variants={fadeIn("right", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.4 }}
        className="py-20 px-6 bg-[#f6d110] dark:bg-[rgb(2,22,18)] flex flex-col lg:flex-row items-center justify-between gap-12"
      >
        <motion.div
          variants={fadeIn("left", 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="flex flex-col items-center"
        >
          <motion.img
            variants={fadeIn("left", 0.6)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            src={amberNocturne1}
            alt="Les Royales Exclusives"
            className="w-[250px] h-[350px] object-contain mb-6"
          />
          <motion.h3
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            className="text-2xl font-semibold text-[#5e160e] dark:text-[#f6d110] mb-2"
          >
            Les Royales Exclusives
          </motion.h3>
          <motion.a
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            href="/universal-collection"
            className="text-sm text-[#5e160e] underline underline-offset-4 hover:text-[#79300f] dark:text-[#f6d110] dark:hover:text-yellow-300"
          >
            Discover More
          </motion.a>
        </motion.div>

        <motion.div
          variants={fadeIn("right", 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="flex flex-col items-center"
        >
          <motion.img
            variants={fadeIn("right", 0.6)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            src={amberNocturne1}
            alt="Acqua Originale"
            className="w-[250px] h-[350px] object-contain mb-6"
          />
          <motion.h3
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            className="text-2xl font-semibold text-[#5e160e] dark:text-[#f6d110] mb-2"
          >
            Acqua Originale
          </motion.h3>
          <motion.a
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            href="/universal-collection"
            className="text-sm text-[#5e160e] underline underline-offset-4 hover:text-[#79300f] dark:text-[#f6d110] dark:hover:text-yellow-300"
          >
            Discover More
          </motion.a>
        </motion.div>
      </motion.section>

      {/* Signature Collection */}
      <motion.section
        variants={fadeIn("left", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.4 }}
        className="py-20 px-6 bg-[#f6d110] dark:bg-[#220104] flex flex-col lg:flex-row items-center justify-between gap-12"
      >
        <motion.div
          variants={fadeIn("left", 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="flex-1"
        >
          <motion.img
            variants={fadeIn("left", 0.6)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            src={Export2}
            alt="Signature Collection"
            className="w-[724px] h-[724px] object-contain mx-auto"
          />
        </motion.div>
        <motion.div
          variants={fadeIn("right", 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="flex-1 max-w-[600px] text-left"
        >
          <motion.h2
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            className="text-5xl font-semibold text-[#79300f] dark:text-[#f6d110] mb-4"
          >
            Signature Collection
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            className="text-lg text-[#3d2b1f] dark:text-white mb-6"
          >
            Meet VESARII Ember Nocturne — a perfume forged in twilight, kissed by wild lavender, smoked cedar, and a whisper of fire-kissed amber. Designed to enchant from the very first breath.
          </motion.p>
          <motion.a
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            href="#"
            className="text-sm text-[#5e160e] underline underline-offset-4 hover:text-[#79300f] dark:text-[#f6d110] dark:hover:text-yellow-300"
          >
            Discover More
          </motion.a>
        </motion.div>
      </motion.section>

      {/* Discover Your Next Signature Scent */}
      <motion.section
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.4 }}
        className="py-16 px-6 bg-[#fff9c7] dark:bg-[rgb(2,22,18)] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
      >
        <motion.div
          variants={fadeIn("left", 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="text-left"
        >
          <motion.h2
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            className="text-3xl md:text-4xl font-semibold text-[#79300f] dark:text-[#f6d110] mb-4"
          >
            Discover Your Next Signature Scent
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            className="text-md text-[#3d2b1f] dark:text-white mb-6 max-w-lg"
          >
            With Vesarii fragrances, it feels truly discovered not chosen. Your signature scent is waiting. Start your
            olfactory journey with a curated sample set.
          </motion.p>
          <motion.a
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            href="/product-cart"
            className="inline-block bg-[#79300f] dark:bg-[#442b03] text-white dark:text-[#f6d110] px-5 py-2 text-sm font-medium rounded-md hover:bg-[#5e160e] dark:hover:bg-[#dab61f] dark:hover:text-black transition"
          >
            Shop Sample Now
          </motion.a>
        </motion.div>
        <motion.div
          variants={fadeIn("right", 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="flex justify-center items-center gap-4"
        >
          <motion.img
            variants={fadeIn("left", 0.6)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            src={Export3}
            alt="Sample Box"
            className="w-[757.51px] h-[757.51px] object-contain"
          />
          {/* <motion.img
            variants={fadeIn("right", 0.6)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            src={amberNocturne1}
            alt="Sample Box Cover"
            className="w-[220px] h-auto object-contain"
          /> */}
        </motion.div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default AllFragrancesSection;