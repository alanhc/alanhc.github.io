import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Script from 'next/script';
import ProfileProvider from '../context/portfolioContext';

import '../styles.css'

function MyApp({ Component, pageProps }: AppProps) {

  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS
  //console.log(GA_MEASUREMENT_ID)
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <ProfileProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </ProfileProvider>
    </>
  )
}

export default MyApp
