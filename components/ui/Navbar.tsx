'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Palette } from 'lucide-react';

export function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/coloriser`, label: t('colorize') },
    { href: `/${locale}#features`, label: t('features') },
    { href: `/${locale}#gallery`, label: t('gallery') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl hidden sm:block">
              <span className="text-white">Colori</span>
              <span className="gradient-text">sation</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/coloriser`}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-all hover:scale-105"
            >
              {t('colorize')}
            </Link>
          </div>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center gap-2 ml-4">
            <Link
              href="/fr"
              className={`px-2 py-1 rounded text-sm ${locale === 'fr' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              FR
            </Link>
            <Link
              href="/en"
              className={`px-2 py-1 rounded text-sm ${locale === 'en' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              EN
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900 border-b border-gray-800"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-300 hover:text-white transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-4 border-t border-gray-800">
                <Link
                  href="/fr"
                  className={`px-3 py-1 rounded ${locale === 'fr' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
                >
                  FR
                </Link>
                <Link
                  href="/en"
                  className={`px-3 py-1 rounded ${locale === 'en' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
                >
                  EN
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
