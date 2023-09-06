import React from 'react';
import { GetStaticPropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  if (!locale) {
    throw new Error('Locale is undefined');
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4">About Us</h1>
        <p className="mb-4">
          We are a team of passionate individuals dedicated to providing the
          best services.
        </p>
        <p className="mb-4">
          Our mission is to make your life easier and more convenient.
        </p>
        <p>
          For more information, please contact us at{' '}
          <a href="mailto:info@freemyrecord.com" className="text-blue-500">
            info@freemyrecord.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
