
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { fadeIn } from '@/variants';

const GiftCollection = () => {
  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#79300f] dark:bg-[#0d0603] dark:text-[#f6d110]">
      <Header />

      {/* Hero Section */}
      <motion.section
        variants={fadeIn('up', 0.2)}
        initial="hidden"
        whileInView="show"
        className="text-center px-6 py-10"
      >
        <h2 className="text-[32px] font-dm-serif mb-4">Luxury Gifts</h2>
        <p className="max-w-3xl mx-auto text-[16px] leading-7">
          From the crisp of the tissue paper to the last loop of the bow, it has to be just right.
          Whether it’s a token of appreciation or the grandest of gestures, each gift is presented
          in an iconic box as famous as our fragrance.
        </p>
        <img
          src="/images/Rectangle 60.png"
          alt="Gift Hero"
          className="w-[1446px] h-[620px] object-cover mt-8 rounded"
        />
      </motion.section>

      {/* Gifts For Her */}
      <motion.section variants={fadeIn('up', 0.2)} initial="hidden" whileInView="show" className="px-6 py-10">
        <h3 className="text-[28px] text-center font-bold mb-6">Gifts For Her</h3>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {['/images/gift-her-1.jpg', '/images/gift-her-2.jpg'].map((src, i) => (
            <div key={i} className="bg-white p-6 rounded shadow text-center">
              <img src={src} alt="Gift For Her" className="w-full h-[300px] object-cover mb-4 rounded" />
              <h4 className="text-[20px] font-semibold">Story of Ember Nocturne</h4>
              <p className="text-sm mb-4">
                Vesarii’s luxurious gifts feature the iconic and timeless Ember Nocturne — our
                most coveted creation in limited-edition presentation.
              </p>
              <Button className="bg-[#79300f] text-white">Shop Now</Button>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Gifts For Him */}
      <motion.section variants={fadeIn('up', 0.2)} initial="hidden" whileInView="show" className="px-6 py-10 bg-[#FAF3E0] dark:bg-[#1a1410]">
        <h3 className="text-[28px] text-center font-bold mb-6">Gifts For Him</h3>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {['/images/gift-him-1.jpg', '/images/gift-him-2.jpg'].map((src, i) => (
            <div key={i} className="bg-white p-6 rounded shadow text-center">
              <img src={src} alt="Gift For Him" className="w-full h-[300px] object-cover mb-4 rounded" />
              <h4 className="text-[20px] font-semibold">Story of Ember Nocturne</h4>
              <p className="text-sm mb-4">
                Men’s collections reimagined with bold sophistication and sensual minimalism.
              </p>
              <Button className="bg-[#79300f] text-white">Shop Now</Button>
            </div>
          ))}
        </div>
      </motion.section>

      {/* By Price */}
      <motion.section variants={fadeIn('up', 0.2)} initial="hidden" whileInView="show" className="px-6 py-10">
        <h3 className="text-[28px] text-center font-bold mb-6">By Price</h3>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { label: 'Under $50', src: '/images/gift-price-50.jpg' },
            { label: 'Under $100', src: '/images/gift-price-100.jpg' },
            { label: 'Under $200', src: '/images/gift-price-200.jpg' },
          ].map(({ label, src }, i) => (
            <div key={i} className="bg-white p-6 rounded shadow text-center">
              <img src={src} alt={label} className="w-full h-[250px] object-cover mb-4 rounded" />
              <h4 className="text-[20px] font-semibold mb-2">{label}</h4>
              <Button className="bg-[#79300f] text-white">Shop Now</Button>
            </div>
          ))}
        </div>
      </motion.section>

      {/* By Occasion */}
<motion.section
  variants={fadeIn('up', 0.2)}
  initial="hidden"
  whileInView="show"
  className="px-6 py-10 bg-[#F2F2F2] dark:bg-[#0d0603]"
>
  <h3 className="text-[28px] text-center font-bold mb-6 text-[#79300f] dark:text-[#f6d110]">By Occasion</h3>

  {/* Home Gift */}
  <div className="max-w-md mx-auto text-center mb-12">
    <img
      src="/images/occasion-home.jpg"
      alt="Home Gift"
      className="w-full h-[250px] object-cover mb-4 rounded"
    />
    <h4 className="text-[20px] font-semibold mb-2">Home Gift</h4>
    <Button className="bg-[#79300f] text-white">Shop Now</Button>
  </div>

  {/* Birthday & Wedding Gift */}
  <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
    {[
      {
        title: 'Birthday Gift',
        src: '/images/Rectangle 60.png',
      },
      {
        title: 'Wedding Gift',
        src: '/images/Rectangle 60.png',
      },
    ].map(({ title, src }, i) => (
      <div key={i} className="text-center bg-white p-6 rounded shadow">
        <img src={src} alt={title} className="w-full h-[250px] object-cover mb-4 rounded" />
        <h4 className="text-[20px] font-semibold mb-2">{title}</h4>
        <Button className="bg-[#79300f] text-white">Shop Now</Button>
      </div>
    ))}
  </div>
</motion.section>


      <Footer />
    </div>
  );
};

export default GiftCollection;
