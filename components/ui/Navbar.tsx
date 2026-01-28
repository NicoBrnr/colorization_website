'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Palette, User, LogOut } from 'lucide-react';

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}#features`, label: t('features') },
    { href: `/${locale}#gallery`, label: t('gallery') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-10">
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

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name || ''} 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <span className="text-white text-sm font-medium">{user.name?.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-700"
                    >
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                      <form action="/api/auth/signout" method="POST">
                        <button
                          type="submit"
                          className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('signOut')}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/api/auth/signin"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                {t('signIn')}
              </Link>
            )}
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

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-gray-800">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-2">
                      {user.image ? (
                        <img 
                          src={user.image} 
                          alt={user.name || ''} 
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="text-white text-sm font-medium">{user.name}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                    <form action="/api/auth/signout" method="POST">
                      <button
                        type="submit"
                        className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('signOut')}
                      </button>
                    </form>
                  </div>
                ) : (
                  <Link
                    href="/api/auth/signin"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-center"
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    {t('signIn')}
                  </Link>
                )}
              </div>

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
