import React from "react";
import LeafIcon from "../../../public/images/LeafImage.png"; 
import Header from "./Header";

const AboutPage = () => {
  return (

    <div  className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9F7F6' }}>
          <Header />
          {/* <NotificationSystem />
          <QuickViewModal />
     */}

   <section className="bg-[#F9F7F6] text-[#271004] font-[Manrope]">
      {/* --- OUR STORY --- */}
      <div className="max-w-4xl mx-auto text-center py-20 px-6">
        <h2 className="text-2xl font-[Playfair] font-semibold mb-4 relative inline-block">
          Our Story
          <span className="block w-12 h-[2px] bg-[#a67c52] mx-auto mt-2"></span>
        </h2>
        <p className="text-[17px] leading-[160%] mt-6">
          At <span className="font-semibold">VESARII</span>, each perfume is a masterpiece —
          a delicate balance of rare ingredients, artisanal craftsmanship, and timeless elegance.
          From the hand-selected oud woods to the golden amber notes, every scent tells a story
          of refinement and artistry.
        </p>
      </div>

      {/* --- ARTISANS CRAFT --- */}
      <div className="max-w-5xl mx-auto text-center py-16 px-6 border-t border-[#e4d4c8]">
        <h2 className="text-2xl font-[Playfair] font-semibold mb-4 relative inline-block">
          Artisans Craft
          <span className="block w-12 h-[2px] bg-[#a67c52] mx-auto mt-2"></span>
        </h2>
        <p className="text-[17px] leading-[160%] mt-6 max-w-3xl mx-auto">
          Every fragrance begins with a story — a vision brought to life by master artisans
          who understand the delicate balance between nature and craft.
        </p>
        <ul className="mt-6 text-[17px] leading-[160%] text-left max-w-3xl mx-auto list-disc list-inside">
          <li>
            Our perfumers source the rarest ingredients from across the world, blending them
            with precision and care.
          </li>
          <li>
            Each bottle embodies the harmony of tradition and innovation, ensuring a fragrance
            that is uniquely yours.
          </li>
          <li>
            From initial concept to final spritz, every note is meticulously curated to evoke
            emotion and memory.
          </li>
        </ul>
      </div>

      {/* --- RARE INGREDIENTS --- */}
      <div className="max-w-6xl mx-auto text-center py-20 px-6 border-t border-[#e4d4c8]">
        <h2 className="text-2xl font-[Playfair] font-semibold mb-4 relative inline-block">
          Rare Ingredients
          <span className="block w-12 h-[2px] bg-[#a67c52] mx-auto mt-2"></span>
        </h2>
        <p className="text-[17px] leading-[160%] mt-6 mb-12 max-w-3xl mx-auto">
          Every VESARII fragrance begins with ingredients that are as rare as they are exceptional,
          sourced from the far corners of the world.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-10">
          {[
            {
              title: "Exotic Botanicals",
              desc: "Handpicked for purity, aroma, and timeless elegance.",
            },
            {
              title: "Precious Essences",
              desc: "Globally sourced with care, bringing depth and character to every fragrance.",
            },
            {
              title: "Olfactory Story",
              desc: "Each ingredient tells a tale of sophistication and artistry.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="p-8 bg-white shadow-sm border border-[#eee] rounded-lg hover:shadow-md transition"
            >
              {/* <div className="text-[#a67c52] text-4xl mb-4">✦</div> */}

              <div className="mb-4">
                <img
                  src={LeafIcon}
                  alt="Leaf Icon"
                  className="w-10 h-10 mx-auto"
                />
              </div>
              <h3 className="text-lg font-[Playfair] font-semibold mb-2">{card.title}</h3>
              <p className="text-[15px] leading-[150%]">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- LUXURY EXPERIENCE --- */}
      <div className="max-w-6xl mx-auto text-center py-20 px-6 border-t border-[#e4d4c8]">
        <h2 className="text-2xl font-[Playfair] font-semibold mb-4 relative inline-block">
          Luxury Experience
          <span className="block w-12 h-[2px] bg-[#a67c52] mx-auto mt-2"></span>
        </h2>
        <p className="text-[17px] leading-[160%] mt-6 mb-12 max-w-3xl mx-auto">
          VESARII isn’t just perfume — it’s a curated experience that awakens your senses and
          elevates your everyday moments.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              title: "Sensory Exploration",
              desc: "Discover fragrances that unfold with every note, taking you on a personal journey.",
            },
            {
              title: "Bespoke Craftsmanship",
              desc: "Each perfume is meticulously crafted to reflect individuality and elegance.",
            },
            {
              title: "Immersive Experience",
              desc: "From scent discovery to daily ritual, every detail is designed for indulgence.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="p-8 bg-white shadow-sm border border-[#eee] rounded-lg hover:shadow-md transition"
            >
              <div className="text-[#a67c52] text-4xl mb-4">✦</div>
              <h3 className="text-lg font-[Playfair] font-semibold mb-2">{card.title}</h3>
              <p className="text-[15px] leading-[150%]">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    </div>

    
 
  );
};

export default AboutPage;
