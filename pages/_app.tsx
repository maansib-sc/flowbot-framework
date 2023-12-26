import '@/styles/base.css';
import type { AppProps } from 'next/app';
import "@/styles/Fonts.css"

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <main style={{ fontFamily: 'Aspekta, sans-serif' }}>
        <Component {...pageProps} />
      </main>
  );
}

export default MyApp;
