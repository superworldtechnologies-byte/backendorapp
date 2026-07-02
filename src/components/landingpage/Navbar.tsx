"use client";

import PawIcon from "@/icons/icon1";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle transparent to blurred background swap on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check on mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/bookings", label: "Bookings" },
    { href: "/pets", label: "Pets" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div 
        className={`px-6 md:px-12 lg:px-24 xl:px-40 py-3 flex items-center justify-between relative transition-all duration-300 ${
          isScrolled 
            ? "bg-black/10 backdrop-blur-3xl " 
            : "bg-transparent backdrop-blur-none"
        }`}
      >
        {/* Logo */}
        <a href="/">
          <PawIcon className="h-11 w-11 text-[#FFC357]" />
        </a>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center bg-zinc-50 border border-zinc-200 rounded-full px-1 py-1 gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-white border border-zinc-200 font-medium text-zinc-800 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <a href="/services" className="hidden md:flex items-center gap-2.5 bg-[#FFC357] text-sm font-medium pl-5 pr-2 py-2 rounded-full cursor-pointer border-0">
          Schedule a visit
          <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
            <svg
              width="12"
              height="10"
              viewBox="0 0 12 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M.6 4.602h10m-4-4 4 4-4 4"
                stroke="#3f3f47"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-0 p-1"
        >
          <span
            className={`block w-6 h-0.5 bg-zinc-800 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-zinc-800 transition-all ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-zinc-800 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>

        {/* Mobile Menu */}
        <div
          className={`absolute top-full left-0 w-full bg-white border-t border-zinc-200 flex-col p-5 gap-1 md:hidden z-50 ${
            menuOpen ? "flex" : "hidden"
          }`}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-zinc-100 text-zinc-900 font-medium"
                    : "text-zinc-500 hover:bg-zinc-50"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}