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

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4">Contact Us</h1>
        <p className="mb-4">
          We're here to help! Reach out to us anytime and we'll happily answer
          your questions.
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            Email:{' '}
            <a href="mailto:support@example.com" className="text-blue-500">
              support@example.com
            </a>
          </li>
          <li>Phone: +1 (123) 456-7890</li>
          <li>Address: 123 Main St, Anytown, USA</li>
        </ul>
        <p>You can also follow us on social media:</p>
        <div className="flex space-x-4 mt-4">
          <a href="#" className="text-blue-500">
            Facebook
          </a>
          <a href="#" className="text-blue-400">
            Twitter
          </a>
          <a href="#" className="text-red-600">
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
