import { useEffect } from "react";
import { useRouter } from 'next/router';

const SignInPage = () => {
    const router = useRouter();
    const { code } = router.query;

    useEffect(() => {
        if (code) {
            localStorage.setItem('email', code);
            window.close()
        }
    }, [code]);

    return (
        <div>
            <h1>loading...</h1>
        </div>
    );
};

export default SignInPage;