import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '@/components/common/Footer';
import { motion } from 'framer-motion';
import { fadeIn } from '../variants';

// Import local images
import amberNocturne1 from '../../public/images/amberNocturne1.png';
import millesimeImperial from '../../public/images/millesimeImperial.png';
import amberNocturne2 from './Men/assets/aventus1.jpg';

const UniversalCollection = () => {
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
    <div className="min-h-screen bg-[#C0BA87] text-[#79300f] dark:bg-[#220104] dark:text-[#f6d110]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className=" mx-auto py-12 px-0">
        {/* Exclusive Fragrances Section */}
        <motion.section
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="mb-12 px-4"
        >
          <motion.h1
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            className="text-3xl font-semibold text-[#79300f] dark:text-[#F6E5E5] mb-4 px-8"
          >
            Exclusive Fragrances
          </motion.h1>
          <motion.p
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            className="text-[#3d2b1f] dark:text-[#F6E5E5] px-8"
          >
            Immerse yourself in a world of unrivaled quality with an extraordinary perfume from The
            House of Creed, artfully crafted using only the finest natural ingredients. From timeless classic Aventus
            to the newest floral rose masterpiece in Eldoria, elegant yet empowering scent, every
            gift is a loved one. Transform your perfume into a unique keepsake with our personalization services,
            exclusively available on the official online boutique.
          </motion.p>
        </motion.section>

        {/* Full-width Universal Collection Section */}
        <motion.section
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="w-full bg-[#B59248] dark:bg-[#021612] text-[#79300f] dark:text-[#f6d110] py-12 px-6"
        >
          <motion.div
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            className="flex flex-col md:flex-row items-center gap-12 w-full"
          >
            {/* Perfume Image */}
            <motion.div
              variants={fadeIn("left", 0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.4 }}
              className="w-full md:w-1/2 flex justify-center"
            >
              <motion.img
                variants={fadeIn("left", 0.6)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.4 }}
                src={amberNocturne1}
                alt="Amber Nocturne"
                className="w-[724px] md:w-[724px] lg:w-[360px] object-contain"
              />
            </motion.div>

            {/* Text Content */}
            <motion.div
              variants={fadeIn("right", 0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.4 }}
              className="w-full md:w-1/2 px-4"
            >
              <motion.h2
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.7 }}
                className="text-3xl md:text-4xl font-bold mb-4 leading-tight dark:text-[#F6E5E5]"
              >
                Amber Nocturne
              </motion.h2>
              <motion.p
                variants={fadeIn("up", 0.4)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.4 }}
                className="text-md md:text-lg leading-relaxed mb-6 text-[#3d2b1f] dark:text-[#F6E5E5]"
              >
                Meet VESARII Ember Nocturne — a perfume forged in twilight, kissed
                by wild lavender, smoked cedar, and a whisper of fire-kissed amber.
                Designed to enchant from the very first breath.
              </motion.p>
              <motion.a
                variants={fadeIn("up", 0.4)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.4 }}
                href="/product-cart"
                className="inline-block text-sm font-semibold border-b-2 border-[#79300f] dark:border-[#f6d110] text-[#79300f] dark:text-[#f6d110] hover:text-[#5e160e] dark:hover:text-[#dab61f] transition duration-300 px-30"
              >
                Discover More
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Universal Collection Section 2: Millésime Impérial */}
        <motion.section
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="bg-[#C0BA87] dark:bg-[#220104] text-[#79300f] dark:text-[#F6E5E5] py-12 px-6"
        >
          <motion.div
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12"
          >
            {/* Text Content */}
            <motion.div
              variants={fadeIn("left", 0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.4 }}
              className="w-full md:w-1/2 px-4"
            >
              <motion.h2
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.7 }}
                className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
              >
                Millésime Impérial
              </motion.h2>
              <motion.p
                variants={fadeIn("up", 0.4)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.4 }}
                className="text-md md:text-lg leading-relaxed mb-6 text-[#3d2b1f] dark:text-white"
              >
                Fresh and uplifting, Millésime Impérial radiates brilliance from
                the outset with its vibrant debut of zesty bergamot, luscious
                blackcurrant and refreshing violet leaves that gives way to a
                shimmering marine accord. Prized orris, the perfumer’s blue gold,
                shines bright at its heart before yielding to a warm, golden base
                of sensual cedarwood, sandalwood and musk. Housed in a lavish
                golden bottle, Millésime Impérial is the pinnacle of luxury.
              </motion.p>
              <motion.a
                variants={fadeIn("up", 0.4)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.4 }}
                href="/product-cart"
                className="text-sm font-semibold border-b-2 border-[#79300f] dark:border-[#f6d110] text-[#79300f] dark:text-[#f6d110] hover:text-[#5e160e] dark:hover:text-[#dab61f] transition duration-300"
              >
                Discover More
              </motion.a>
            </motion.div>

            {/* Perfume Image */}
            <motion.div
              variants={fadeIn("right", 0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.4 }}
              className="w-full md:w-1/2 flex justify-center"
            >
              <motion.img
                variants={fadeIn("right", 0.6)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.4 }}
                src={millesimeImperial}
                alt="Millésime Impérial"
                className="w-[780px] md:w-[780px] lg:w-[360px] object-contain"
              />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Universal Collection Section 3: Amber Nocturne */}
        <motion.section
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="bg-[#B59248] dark:bg-[#021612] text-[#79300f] dark:text-[#F6E5E5] py-12 px-6"
        >
          <motion.div
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12"
          >
            {/* Perfume Image */}
            <motion.div
              variants={fadeIn("left", 0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.4 }}
              className="w-full md:w-1/2 flex justify-center"
            >
              <motion.img
                variants={fadeIn("left", 0.6)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.4 }}
                src={amberNocturne1}
                alt="Amber Nocturne"
                className="w-[280px] md:w-[320px] lg:w-[360px] object-contain"
              />
            </motion.div>

            {/* Text Content */}
            <motion.div
              variants={fadeIn("right", 0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.4 }}
              className="w-full md:w-1/2"
            >
              <motion.h2
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.7 }}
                className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
              >
                Amber Nocturne
              </motion.h2>
              <motion.p
                variants={fadeIn("up", 0.4)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.4 }}
                className="text-md md:text-lg leading-relaxed mb-6 text-[#3d2b1f] dark:text-white"
              >
                Meet VESARII Ember Nocturne — a perfume forged in twilight, kissed
                by wild lavender, smoked cedar, and a whisper of fire-kissed amber.
                Designed to enchant from the very first breath.
              </motion.p>
              <motion.a
                variants={fadeIn("up", 0.4)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.4 }}
                href="/product-cart"
                className="text-sm font-semibold border-b-2 border-[#79300f] dark:border-[#f6d110] text-[#79300f] dark:text-[#f6d110] hover:text-[#5e160e] dark:hover:text-[#dab61f] transition duration-300"
              >
                Discover More
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.section>

{/* Universal Collection Section 4: Millésime Impérial */}
<motion.section
  variants={fadeIn("right", 0.2)}
  initial="hidden"
  whileInView="show"
  viewport={{ once: false, amount: 0.4 }}
  className="bg-[#C0BA87] dark:bg-[#220104] text-[#79300f] dark:text-[#F6E5E5] py-12 px-6"
>
  <motion.div
    variants={fadeIn("up", 0.4)}
    initial="hidden"
    whileInView="show"
    viewport={{ once: false, amount: 0.4 }}
    className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12"
  >
    {/* Text Content */}
    <motion.div
      variants={fadeIn("left", 0.4)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.4 }}
      className="w-full md:w-1/2 px-4"
    >
      <motion.h2
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.7 }}
        className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
      >
        Millésime Impérial
      </motion.h2>
      <motion.p
        variants={fadeIn("up", 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.4 }}
        className="text-md md:text-lg leading-relaxed mb-6 text-[#3d2b1f] dark:text-white"
      >
        Fresh and uplifting, Millésime Impérial radiates brilliance from
        the outset with its vibrant debut of zesty bergamot, luscious
        blackcurrant and refreshing violet leaves that gives way to a
        shimmering marine accord. Prized orris, the perfumer’s blue gold,
        shines bright at its heart before yielding to a warm, golden base
        of sensual cedarwood, sandalwood and musk. Housed in a lavish
        golden bottle, Millésime Impérial is the pinnacle of luxury.
      </motion.p>
      <motion.a
        variants={fadeIn("up", 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.4 }}
        href="/product-cart"
        className="text-sm font-semibold border-b-2 border-[#79300f] dark:border-[#f6d110] text-[#79300f] dark:text-[#f6d110] hover:text-[#5e160e] dark:hover:text-[#dab61f] transition duration-300"
      >
        Discover More
      </motion.a>
    </motion.div>

    {/* Perfume Image */}
    <motion.div
      variants={fadeIn("right", 0.4)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.4 }}
      className="w-full md:w-1/2 flex justify-center"
    >
      <motion.img
        variants={fadeIn("right", 0.6)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.4 }}
        src={millesimeImperial}
        alt="Millésime Impérial"
        className="w-[280px] md:w-[320px] lg:w-[360px] object-contain"
      />
    </motion.div>
  </motion.div>
</motion.section>

 
      </main>
      <Footer />
    </div>
  );
};

export default UniversalCollection;