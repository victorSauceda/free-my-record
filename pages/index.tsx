import Image from 'next/image';
import { Inter } from 'next/font/google';
import { GetStaticPropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  if (!locale) {
    throw new Error('Locale is undefined');
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'footer'])),
      // Will be passed to the page component as props
    },
  };
}

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { t } = useTranslation('common');
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="text-center">
        <p className="text-4xl font-extrabold text-blue-700 leading-tight mb-8">
          Free My Record
        </p>
        <p className="text-2xl text-gray-700">{t('description')}</p>
      </div>
      <div className="flex flex-col space-y-4 mt-8">
        <button className="bg-blue-700 text-white w-full px-6 py-2 rounded-lg hover:bg-blue-800 focus:outline-none focus:border-blue-900 focus:ring focus:ring-blue-200 active:bg-blue-900">
          {t('signup')}
        </button>
        <button className="bg-gray-700 text-white w-full px-6 py-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-200 active:bg-gray-900">
          {t('login')}
        </button>
      </div>
    </main>
  );
}
