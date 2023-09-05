import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { validatePassword } from '@/utils/validation';
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
export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const [confirmPasswordBlurred, setConfirmPasswordBlurred] = useState(false);
  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    }
    setIsValidPassword(validatePassword(password));
  }, [password, confirmPassword]);
  const handleSignUp = async () => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
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
  const handleBlur = () => {
    if (password.length > 0) {
      setPasswordBlurred(true);
      setIsValidPassword(validatePassword(password));
    }
  };
  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordBlurred(!confirmPasswordBlurred);
    setPasswordsMatch(password === confirmPassword);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={handleBlur}
          required
        />
        {!isValidPassword && passwordBlurred && !confirmPasswordBlurred && (
          <p className="text-red-500 mb-4 animate-shake">
            Password must be at least 8 characters long, contain at least one
            number and one symbol.
          </p>
        )}
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 mb-4 border rounded"
          disabled={!isValidPassword}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={handleConfirmPasswordBlur}
        />
        {!passwordsMatch && confirmPasswordBlurred && (
          <p className="text-red-500 mb-4 animate-shake">
            Passwords do not match
          </p>
        )}

        <button
          onClick={handleSignUp}
          className={`w-full p-2 rounded ${
            !passwordsMatch ||
            !isValidPassword ||
            email === '' ||
            confirmPassword === ''
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          disabled={
            !passwordsMatch ||
            !isValidPassword ||
            email === '' ||
            confirmPassword === ''
          }
        >
          Sign Up
        </button>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-blue-500">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
