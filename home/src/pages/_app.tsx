import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, Heading } from '@chakra-ui/react'
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react"

import Script from 'next/script';
import ProfileProvider from '../context/portfolioContext';

import 'nprogress/nprogress.css';
import { useRouter } from 'next/router'; 
import NProgress from 'nprogress'; 
import { useEffect } from 'react';

const theme = extendTheme({

  components: {
  },
})
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // Integrate nprogress
  useEffect(() => {
    router.events.on('routeChangeStart', () => NProgress.start());
    router.events.on('routeChangeComplete', () => NProgress.done());
    router.events.on('routeChangeError', () => NProgress.done());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </ProfileProvider>
    </>
  )
}

export default MyApp
