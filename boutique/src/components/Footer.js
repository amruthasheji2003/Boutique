import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-semibold mb-4">Tailor's Touch Boutique</h3>
            <p className="mb-4">Crafting perfection, one stitch at a time.</p>
            <p>&copy; {new Date().getFullYear()} Tailor's Touch Boutique. All rights reserved.</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
              <li><Link to="/about-us" className="hover:text-gray-300">About Us</Link></li>
              <li><Link to="/contact-us" className="hover:text-gray-300">Contact Us</Link></li>
              <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="mb-2">Tailor's Touch Boutique,MH93+RWW, Ettumanoor, Kerala 686631</p>
            <p className="mb-2">Phone: +91 81369 42160,+91 92072 34631</p>
            <p>Email: tailorstouchboutique@gmail.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;