import { useEffect } from 'react';
import { useRouter } from 'next/router';

const SignInPage = () => {
  const router = useRouter();
  const { code, token } = router.query;

  useEffect(() => {
    if (code) {
      try {
        localStorage.setItem('token', String(code));
        localStorage.setItem('id_token', String(token));
        window.close();
      } catch (error) {
        console.log('Error setting localStorage:', error);
      }
    }
  }, [code]);

  return (
    <div>
      <h1>loading...</h1>
    </div>
  );
};

export default SignInPage;
