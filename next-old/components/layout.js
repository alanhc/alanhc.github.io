import Head from 'next/head';
import Image from 'next/image';
//import styles from './layout.module.css';
//import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';


const name = 'Alan Tseng';
export const siteTitle = "Alan Tseng's Website";

export default function Layout({ children, home }) {
  return (
    <div className="">
      <Head>
        <title>Alan Tseng | HUNG-CHUN, TSENG | 曾宏鈞</title>
        <meta name="description" content="Alan Tseng's website" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />

      </Head>
      <header className=" flex flex-col items-center">
        {home ? (
          <>
              <Image
                priority
                src="/images/profile.jpeg"
                height={144}
                width={144}
                className=' justify-center rounded-full'
                alt={name}
              />
            
            <h1 className="underline text-center">{name}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                <Image
                  priority
                  src="/images/profile.jpeg"
                  className='rounded-full'
                  height={108}
                  width={108}
                  alt={name}
                />
              </a>
            </Link>
            <h2 >
              <Link href="/">
                <a >{name} !!!</a>
              </Link>
            </h2>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  );
}