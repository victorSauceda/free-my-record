import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Verify = () => {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      fetch('/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data, 'data');
          router.push('./dashboard');
        })
        .catch((error) => {
          console.error('Verification failed', error);
        });
    }
  }, [token]);

  return <div>Verifying...</div>;
};

export default Verify;
