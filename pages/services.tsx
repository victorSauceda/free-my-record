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

export default function ServicesPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4">Our Services</h1>
        <p className="mb-4">
          We offer a variety of services to meet your needs.
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Expungement Clinics</li>
          <li>Automatic Record Clearance</li>
          <li>Background Checks</li>
          <li>Legal Tips</li>
          <li>And More</li>
        </ul>
        <p>Contact us with any questions below.</p>
        <div className="mt-4">
          <a href="/contact" className="text-blue-500">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
