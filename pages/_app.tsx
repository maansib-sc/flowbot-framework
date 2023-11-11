import '@/styles/base.css';
import type { AppProps } from 'next/app';
// import { Inter } from 'next/font/google';
import "../configuration/CSS/Fonts.css"


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <main style={{fontFamily:'Aspekta !important'}}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
