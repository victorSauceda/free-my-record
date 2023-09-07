import React, { useState } from 'react';
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
  const [showModal, setShowModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const handleLogout = async () => {
    const res = await fetch('/api/logout', {
      method: 'POST',
    });

    if (res.ok) {
      setUser(null);
      router.push('/');
    }
  };
  const handleDeleteAccount = async () => {
    if (deleteInput.toLowerCase() === 'delete') {
      console.log('user id', user.id);
      const res = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (res.ok) {
        setUser(null);
        alert('User deleted successfully');
        router.push('/');
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-3/4 md:w-1/2 lg:w-1/3">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p className="text-gray-700 mb-4">
          {user?.firstName} {user?.lastName}
        </p>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <div className="flex items-center space-x-4">
            <div className="bg-orange-400 p-4 text-white text-2xl font-bold">
              3
            </div>
            <div>
              <h4 className="text-lg font-semibold">Automatic Expungement</h4>
              <p className="text-gray-700">
                Current Expungements or Future-Eligible
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-orange-400 p-4 text-white text-2xl font-bold">
              3
            </div>
            <div>
              <h4 className="text-lg font-semibold">Automatic Expungement</h4>
              <p className="text-gray-700">
                Current Expungements or Future-Eligible
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-orange-400 p-4 text-white text-2xl font-bold">
              3
            </div>
            <div>
              <h4 className="text-lg font-semibold">Not Expungeable</h4>
            </div>
          </div>
        </div>

        <div className="mt-40 text-center">
          <div className="mb-4">
            <a className="text-blue-500 hover:underline" href="/entries">
              View All Entries
            </a>
          </div>
          <div>
            <a className="text-blue-500 hover:underline" href="/rapsheet">
              RAP Sheet View
            </a>
          </div>
        </div>
        <div className="flex flex-col space-y-4 text-center mt-20">
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
          <button
            onClick={() => setShowModal(true)}
            className="text-red-500 hover:underline"
          >
            Delete Account
          </button>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
                <h2 className="text-2xl font-semibold mb-4">
                  Are you sure you want to delete your account?
                </h2>
                <p className="text-gray-700 mb-4">Type "delete" to confirm.</p>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                  placeholder="Type 'delete' to confirm"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
