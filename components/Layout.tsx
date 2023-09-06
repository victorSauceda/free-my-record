'use client';
import React, { useState } from 'react';
// import '../styles/global';
import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css';
import { Transition } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('common');
  const changeTo = router.locale === 'en' ? 'es' : 'en';
  const onToggleLanguageClick = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-700 text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-extrabold tracking-tight w-1/4">
            <Link href={'/'}>Free My Record</Link>
          </h1>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center px-3 py-2 border rounded border-white relative"
            >
              <div className={`hamburger-icon ${isOpen ? 'hide' : 'show'}`}>
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"
                  ></path>
                </svg>
              </div>
              <div className={`x-icon ${isOpen ? 'show' : 'hide'}`}>
                {' '}
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
                  ></path>
                </svg>
              </div>
            </button>
          </div>
          <nav className="hidden md:flex space-x-4 text-lg">
            <Link href="/" className="hover:text-blue-400">
              {t('nav.home')}
            </Link>
            <Link href="/about" className="hover:text-blue-400">
              {t('nav.about')}
            </Link>
            <Link href="/services" className="hover:text-blue-400">
              {t('nav.services')}
            </Link>
            <Link href="/contact" className="hover:text-blue-400">
              {t('nav.contact')}
            </Link>
          </nav>
          <div className="flex items-center w-1/4 justify-end">
            {changeTo !== 'es' && (
              <div className="w-16 text-center text-sm">{t('language')}</div>
            )}
            <div className="relative w-16 h-6 bg-gray-300 rounded-full">
              <button
                onClick={() => onToggleLanguageClick(changeTo)}
                className={`absolute top-0 h-6 w-8 bg-blue-500 rounded-full transition-transform duration-300 ease-in-out ${
                  changeTo === 'en'
                    ? 'transform translate-x-8'
                    : 'transform translate-x-0'
                }`}
              ></button>
            </div>
            {changeTo === 'es' && (
              <div className="w-16 text-center text-sm ml-4">
                {t('language')}
              </div>
            )}
          </div>
        </div>
        <Transition
          show={isOpen}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <nav className="md:hidden bg-blue-600 p-4">
            <ul className="space-y-4 text-lg">
              <li>
                <Link href="/" className="hover:text-blue-400">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-400">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </nav>
        </Transition>
      </header>

      <main className="container mx-auto p-6 flex-grow">
        <div className="bg-white p-6 rounded-lg shadow-md">{children}</div>
      </main>

      <footer className="bg-gray-800 text-white p-6">
        <div className="container mx-auto text-center">
          <p className="mb-2 text-lg">
            {t('copyright')} &copy; 2023 Free My Record
          </p>
          <p className="mb-2 text-sm">{t('email')}: info@freemyrecord.com</p>
          <p className="text-sm">{t('phone')}: +1 (123) 456-7890</p>
        </div>
      </footer>
    </div>
  );
}
