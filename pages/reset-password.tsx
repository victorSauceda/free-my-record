import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [newPasswordBlurred, setNewPasswordBlurred] = useState(false);
  const [confirmPasswordBlurred, setConfirmPasswordBlurred] = useState(false);

  const router = useRouter();
  const { token } = router.query;
  useEffect(() => {
    setIsValid(validatePassword(newPassword));
    setPasswordsMatch(newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch('/api/validate-reset-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
        }
      } catch (error) {
        console.error('An error occurred:', error);
        setIsValidToken(false);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  if (isValidToken === null) {
    return <div>Loading...</div>;
  }

  if (!isValidToken) {
    return <div>Invalid or expired token. Please try again.</div>;
  }
  const handleResetPassword = async () => {
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 mb-4 border rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onBlur={() => setNewPasswordBlurred(true)}
        />
        {!isValid && newPasswordBlurred && (
          <p className="text-red-500 mb-4 animate-shake">
            Password must be at least 8 characters long, contain a number and a
            symbol.
          </p>
        )}
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full p-2 mb-4 border rounded"
          value={confirmPassword}
          disabled={!isValid}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => setConfirmPasswordBlurred(true)}
        />
        {!passwordsMatch && confirmPasswordBlurred && (
          <p className="text-red-500 mb-4 animate-shake">
            Passwords do not match.
          </p>
        )}
        <button
          onClick={handleResetPassword}
          className={`w-full p-2 rounded ${
            !passwordsMatch || !isValid
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          disabled={!isValid || !passwordsMatch}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
