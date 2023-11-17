import { SessionProvider } from 'next-auth/react';
import '@/styles/base.css';
import type { AppProps } from 'next/app';
import "../configuration/CSS/Fonts.css"
import Providers from '@/components/Providers';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <main style={{ fontFamily: 'Aspekta, sans-serif' }}>
        <Component {...pageProps} />
      </main>
    </Providers>
  );
}

export default MyApp;
