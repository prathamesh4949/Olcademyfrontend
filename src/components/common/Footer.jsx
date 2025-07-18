

import React from "react";
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube, FaLinkedinIn, FaPhoneAlt } from "react-icons/fa";
import { MdOutlineEmail, MdOutlineChatBubbleOutline } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-black text-[#f7f2e9] px-6 md:px-16 lg:px-32 py-12 font-serif relative border-t border-[#f7f2e9]/30">
      <div className="flex flex-col md:flex-row justify-between mb-8 space-y-10 md:space-y-0">
        {/* Customer Service */}
        <div>
          <h3 className="text-xl mb-3">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li>Contact Us</li>
            <li>FAQs</li>
            <li>Shipping & Returns</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-xl mb-3">Social</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><FaInstagram /> Instagram</li>
            <li className="flex items-center gap-2"><FaFacebookF /> Facebook</li>
            <li className="flex items-center gap-2"><FaTiktok /> TikTok</li>
            <li className="flex items-center gap-2"><FaYoutube /> YouTube</li>
            <li className="flex items-center gap-2"><FaLinkedinIn /> LinkedIn</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-xl mb-3">Legal Statement</h3>
          <ul className="space-y-2 text-sm">
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Cookies Policy</li>
            <li>Cookies Settings</li>
          </ul>
        </div>

        {/* Talk to Us */}
        <div>
          <h3 className="text-xl mb-3">Talk to Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 text-purple-200"><MdOutlineChatBubbleOutline className="text-lg" /> Live Chat</li>
            <li className="flex items-center gap-2 text-pink-400"><FaPhoneAlt className="text-lg" /> Phone Call</li>
            <li className="flex items-center gap-2 text-purple-300"><MdOutlineEmail className="text-lg" /> Send an Email</li>
          </ul>
        </div>
      </div>

      {/* Brand + Copyright */}
      <div className="text-center border-t border-[#f7f2e9]/30 pt-4 text-sm flex flex-col items-center">
        <h2 className="text-4xl mb-2 font-normal tracking-wide">Vesarii</h2>
        <p className="text-purple-300 mt-2">© 2025 Vesarii. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
