import React from 'react';
import Link from 'next/link';
import { useUser } from '../context/UserContext';
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
const Dashboard: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-3/4 md:w-1/2 lg:w-1/3">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p className="text-gray-700 mb-4">
          Welcome to your dashboard, {user?.email}! You can manage your account
          and settings here.
        </p>
        <div className="flex flex-col space-y-4">
          <Link href="/profile">
            <a className="text-blue-500 hover:underline">Edit Profile</a>
          </Link>
          <Link href="/settings">
            <a className="text-blue-500 hover:underline">Account Settings</a>
          </Link>
          <Link href="/logout">
            <a className="text-red-500 hover:underline">Logout</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
