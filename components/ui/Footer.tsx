'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Palette, Mail, Github } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">
                <span className="text-white">Colori</span>
                <span className="gradient-text">sation</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              {t('description')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/coloriser`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Coloriser une photo
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#features`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#gallery`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Galerie
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/privacy`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <a href="mailto:contact@example.com" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t('contact')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            {t('copyright')}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
