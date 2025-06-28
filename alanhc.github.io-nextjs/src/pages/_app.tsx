import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, Heading, extendTheme } from "@chakra-ui/react";
import Script from "next/script";
import ProfileProvider from "@/context/portfolioContext";
import "nprogress/nprogress.css";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { useEffect } from "react";
import chakraTheme from "@chakra-ui/theme";
import { DefaultSeo } from "next-seo";
import { Rubik } from "next/font/google";
import SEO from "next-seo.config";
const rubik = Rubik({ subsets: ["latin"] });

const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
});
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    router.events.on("routeChangeStart", () => NProgress.start());
    router.events.on("routeChangeComplete", () => NProgress.done());
    router.events.on("routeChangeError", () => NProgress.done());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
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
      <DefaultSeo {...SEO} />
      <ProfileProvider>
        <ChakraProvider > {/* resetScope=".ck-reset"*/}
          <Component {...pageProps} />
        </ChakraProvider>
      </ProfileProvider>
    </>
  );
}
export default MyApp;
