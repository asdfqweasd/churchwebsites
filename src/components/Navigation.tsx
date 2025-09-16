'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isMinistriesOpen, setIsMinistriesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const ministriesItems = [
    { name: "Mens Ministry", href: "/ministries/mens" },
    { name: "Womens Ministry", href: "/ministries/womens" },
    { name: "Youth Ministry", href: "/ministries/youth" },
    { name: "Childrens Ministry", href: "/ministries/children" }
  ];

  const navItems = [
    { name: "HOME", href: "/" },
    { name: " About us", href: "/about" },
    { 
      name: "Ministries", 
      href: "#", 
      hasDropdown: true,
      dropdownItems: ministriesItems
    },
    { name: "Events ", href: "/events" },
    { name: "Sermons", href: "/sermons" },
    { name: "Giving", href: "/giving" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <nav className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-bold text-white tracking-wider">
            Church Logo
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setIsMinistriesOpen(true)}
                      onMouseLeave={() => setIsMinistriesOpen(false)}
                    >
                      <button className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200 flex items-center uppercase">
                        {item.name}
                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {isMinistriesOpen && (
                        <div className="absolute left-0 mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl py-2 z-50">
                          {item.dropdownItems?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 transition-colors duration-200 font-medium"
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200 uppercase"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-gray-300 p-2"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/50 backdrop-blur-sm">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setIsMinistriesOpen(!isMinistriesOpen)}
                        className="text-white hover:text-gray-300 px-3 py-2 text-base font-medium w-full text-left flex items-center justify-between uppercase tracking-wide"
                      >
                        {item.name}
                        <svg className={`h-4 w-4 transition-transform ${isMinistriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isMinistriesOpen && (
                        <div className="pl-4 space-y-1">
                          {item.dropdownItems?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-200"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-white hover:text-gray-300 block px-3 py-2 text-base font-medium transition-colors duration-200 uppercase tracking-wide"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
