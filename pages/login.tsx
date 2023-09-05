import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const data = await response.json();
        setErrorMessage(data.message); // Set the error message
        setPassword('');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setErrorMessage(''); // Clear the error message when the user starts typing
    };
  const clearErrorMessage = () => {
    setErrorMessage('');
  };
  const handleKeyPress = (e: any) => {
    if (e.keyCode === 13) {
      handleLogin();
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        {errorMessage && (
          <p className="text-red-500 mb-4 animate-shake">{errorMessage}</p>
        )}
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={handleInputChange(setEmail)}
          onFocus={clearErrorMessage}
          onKeyDown={(e) => handleKeyPress(e)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={handleInputChange(setPassword)}
          onFocus={clearErrorMessage}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={handleLogin}
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Login
        </button>
        <div className="mt-2 text-center">
          <Link className="text-blue-500" href="/forgot-password">
            Forgot Password?
          </Link>
        </div>
        <div className="mt-4 text-center">
          <Link className="text-blue-500" href="/signup">
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
