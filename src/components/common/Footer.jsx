import React from 'react';
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#1C160C] to-[#292218] px-10 md:px-24 lg:px-40 py-20 font-[Manrope] font-semibold text-[18px] md:text-[19px] leading-[170%] tracking-wider">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between mb-7 space-y-14 md:space-y-0">
        {/* Address & Contact */}
        <div className="space-y-3">
          <p className="mb-2 bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent text-xl md:text-xl tracking-wider">
            Address
          </p>
          <p className="text-sm  opacity-80 mb-4 bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent md:text-xs lg:text-base">
            Vesarii Fragrance House, Paris, France
          </p>

          <div className="mt-10">
            <p className="mb-2 bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent text-xl md:text-lg">
              Contact
            </p>
            <p className="text-base md:text-base opacity-80 cursor-pointer bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent tracking-wide">
              +33 1 23 45 67
            </p>
            <p className="text-base md:text-base opacity-80 cursor-pointer bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent tracking-wide">
              contact@vesarii.com
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-16 text-sm md:text-xs lg:text-base transform -translate-x-50 lg:-translate-x-50">
          <div className="space-y-4">
            <p className="cursor-pointer bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent tracking-wide">
              Shop
            </p>
            <p className="cursor-pointer bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent tracking-wide">
              About
            </p>
            <p className="cursor-pointer bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent tracking-wide">
              Journal
            </p>
            <p className="cursor-pointer bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent tracking-wide">
              Contact
            </p>
            <p className="cursor-pointer bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent tracking-wide">
              Careers
            </p>
          </div>
          <div className="space-y-4">
            <p className="cursor-pointer bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent tracking-wide">
              Press
            </p>
            <p className="cursor-pointer bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent tracking-wide">
              Stockists
            </p>
            <p className="cursor-pointer bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent tracking-wide">
              Gift cards
            </p>
            <p className="cursor-pointer bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent tracking-wide">
              Sustainability
            </p>
            <p className="cursor-pointer bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent tracking-wide">
              Shipping
            </p>
          </div>
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-8 h-8 md:w-10 md:h-10 border border-[#EFDB94] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#CDAF6E]/10 transition-colors">
          <FaFacebookF className="text-lg md:text-xl text-[#CDAF6E]" />
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 border border-[#EFDB94] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#CDAF6E]/10 transition-colors">
          <FaInstagram className="text-lg md:text-xl text-[#CDAF6E]" />
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 border border-[#EFDB94] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#CDAF6E]/10 transition-colors">
          <FaXTwitter className="text-lg md:text-xl text-[#CDAF6E]" />
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 border border-[#EFDB94] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#CDAF6E]/10 transition-colors">
          <FaLinkedinIn className="text-lg md:text-xl text-[#CDAF6E]" />
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 border border-[#EFDB94] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#CDAF6E]/10 transition-colors">
          <FaYoutube className="text-lg md:text-xl text-[#CDAF6E]" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-[#EFDB94]/30 pt-6 text-base md:text-xs">
        <p className="bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent  md:text-sm lg:text-base tracking-wider">
          © 2024 Vesarii. All rights reserved.
        </p>
        <div className="flex md:gap-6 lg:gap-10 gap-5 lg:mt-0 md:mt-0 mt-4">
          <p className="cursor-pointer bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent md:text-sm lg:text-base tracking-wide">
            Privacy policy
          </p>
          <p className="cursor-pointer bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent md:text-sm lg:text-base tracking-wide">
            Terms of service
          </p>
          <p className="cursor-pointer bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent md:text-sm lg:text-base tracking-wide">
            Cookies settings
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;