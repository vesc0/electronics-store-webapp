"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = () => {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getLinkClass = (path: string): string =>
    pathname === path
      ? 'border-b-2 border-gray-800'
      : 'text-gray-900';

  return (
    <nav className="bg-gray-200 bg-opacity-80 backdrop-blur-lg p-4 flex justify-between items-center fixed top-0 w-full z-50">
      {/* Small screens: Hamburger, Store name (centered), Cart */}
      <div className="flex items-center justify-between w-full md:hidden">
        <button onClick={toggleMobileMenu} className="text-gray-900 text-2xl">
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="text-gray-900 text-xl font-bold text-center">
          <Link href="/" passHref>
            ELECTRONICS STORE
          </Link>
        </div>
        <div className="relative text-gray-900 flex items-center">
          <Link href="/cart" passHref>
            <div className="relative flex items-center cursor-pointer">
              <FaShoppingCart className="text-2xl" />
              {cartItemCount > 0 && (
                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Large screens: Store name, Home and Products, Cart */}
      <div className="hidden md:flex items-center justify-between w-full">
        <div className="flex items-center space-x-6">
          <div className="text-gray-900 text-xl font-bold">
            <Link href="/">
              ELECTRONICS STORE
            </Link>
          </div>
          <Link href="/" className={getLinkClass('/')}>
            <div className="text-gray-900 text-xl cursor-pointer">Home</div>
          </Link>
          <Link href="/products" className={getLinkClass('/products')}>
            <div className="text-gray-900 text-xl cursor-pointer">Products</div>
          </Link>
        </div>
        <div className="relative text-gray-900 flex items-center md:mr-4">
          <Link href="/cart" passHref>
            <div className="relative flex items-center cursor-pointer">
              <FaShoppingCart className="text-2xl" />
              {cartItemCount > 0 && (
                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile menu (expanded) */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-200 flex flex-col items-center py-4 space-y-4 md:hidden">
          <Link href="/" className={getLinkClass('/')}>
            <div className="text-gray-900 text-xl cursor-pointer">Home</div>
          </Link>
          <Link href="/products" className={getLinkClass('/products')}>
            <div className="text-gray-900 text-xl cursor-pointer">Products</div>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
