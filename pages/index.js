import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Alan Tseng | HUNG-CHUN, TSENG | 曾宏鈞</title>
        <meta name="description" content="Alan Tseng's website" />
        <link rel="shortcut icon" href="favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicon.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="favicon.png"/>
      
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Alan Tseng&apos;s wesite!
        </h1>        
      </main>

      <footer className={styles.footer}>
        @alanhc
      </footer>
    </div>
  )
}
