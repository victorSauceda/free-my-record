import { GetStaticPropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
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
const isValidEmail = (email: string) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};
export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const handleForgotPassword = async () => {
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/check-email');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setValidEmail(isValidEmail(e.target.value));
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter' && validEmail) {
      handleForgotPassword();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4">Forgot Password</h1>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={handleEmailChange}
          onKeyDown={handleKeyPress}
          required
        />
        <button
          onClick={handleForgotPassword}
          className={`w-full p-2 rounded ${
            !validEmail
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          disabled={!validEmail}
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}
