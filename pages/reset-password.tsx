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
    <div>
      <h1>Reset Password</h1>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      {!isValid && (
        <p>
          Password must be at least 8 characters long, contain a number and a
          symbol.
        </p>
      )}
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {!passwordsMatch && <p>Passwords do not match.</p>}
      <button
        onClick={handleResetPassword}
        disabled={!isValid || !passwordsMatch}
      >
        Reset Password
      </button>
    </div>
  );
}
