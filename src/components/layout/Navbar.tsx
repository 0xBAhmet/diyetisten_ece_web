"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Leaf } from "lucide-react";

const navLinks = [
  { name: "Ana Sayfa", path: "/" },
  { name: "Hakkımda", path: "/hakkimda" },
  { name: "Hizmetler", path: "/hizmetler" },
  { name: "Blog", path: "/blog" },
  { name: "İletişim", path: "/iletisim" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-transparent ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-anthracite-100 py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary-100 text-primary-600 p-2 rounded-xl group-hover:bg-primary-200 transition-colors">
            <Leaf size={24} />
          </div>
          <span className="text-xl font-bold text-anthracite-900 tracking-tight">
            Diyetisyen
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`relative font-medium text-sm transition-colors hover:text-primary-600 ${
                pathname === link.path ? "text-primary-600" : "text-anthracite-600"
              }`}
            >
              {link.name}
              {pathname === link.path && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                />
              )}
            </Link>
          ))}
          
          <Link
            href="/iletisim"
            className="px-6 py-2.5 bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white rounded-full font-medium transition-all"
          >
            Randevu Al
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-anthracite-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 bg-white border-b border-anthracite-100 shadow-xl py-6 px-6 flex flex-col gap-4 md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-lg font-medium py-2 border-b border-anthracite-50 ${
                pathname === link.path ? "text-primary-600" : "text-anthracite-700"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/iletisim"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 px-6 py-3 bg-primary-600 text-white text-center rounded-xl font-medium"
          >
            Randevu Al
          </Link>
        </motion.div>
      )}
    </header>
  );
}
