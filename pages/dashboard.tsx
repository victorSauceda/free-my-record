import React from 'react';
import Link from 'next/link';
import { useUser } from '../context/UserContext';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import router from 'next/router';
import { parseCookies } from 'nookies';
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale } = context;
  const cookies = parseCookies(context);
  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

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
  const { user, setUser } = useUser();
  const handleLogout = async () => {
    const res = await fetch('/api/logout', {
      method: 'POST',
    });

    if (res.ok) {
      setUser(null);
      router.push('/');
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-3/4 md:w-1/2 lg:w-1/3">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p className="text-gray-700 mb-4">
          Welcome to your dashboard, {user?.firstName}! You can manage your
          account and settings here.
        </p>
        <div className="flex flex-col space-y-4">
          <Link className="text-blue-500 hover:underline" href="/profile">
            Edit Profile
          </Link>
          <Link className="text-blue-500 hover:underline" href="/settings">
            Account Settings
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
