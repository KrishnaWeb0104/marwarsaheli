import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaXTwitter, FaTiktok, FaYoutube } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="relative bg-[#F5D7A4] py-4 px-4">
      {/* Background image */}
      <img
        src="/Footer-BG.webp"
        alt="Palm BG"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <img
          src="/Marwar-Saheli-Logo-Transparent.webp"
          alt="Logo"
          className="h-25 w-auto"
        />

        {/* Nav Links */}
        <div className="flex gap-8 text-sm md:text-base text-black font-medium">
          <Link to="/aboutUs">About Us</Link>
          <Link to="/policies">Policies</Link>
          <Link to="/help">Help</Link>
          <Link to="/faq">FAQ</Link>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-xl">
          <Link href="https://instagram.com" target="_blank">
            <FaInstagram className="text-pink-600 hover:scale-110 transition" />
          </Link>
          <Link href="https://x.com" target="_blank">
            <FaXTwitter className="text-black hover:scale-110 transition" />
          </Link>
          <Link href="https://tiktok.com" target="_blank">
            <FaTiktok className="text-black hover:scale-110 transition" />
          </Link>
          <Link href="https://youtube.com" target="_blank">
            <FaYoutube className="text-red-600 hover:scale-110 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
