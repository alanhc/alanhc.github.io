import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Layout from '../components/Layout'
import CollectionResult from '../components/CollectionResult'
import LeftCheckBox from '../components/LeftCheckBox'
import { IProjects } from '../types/portfolio'

const Home: NextPage = ({portfolio}:any) => {
  //console.log(portfolio)
  return (
    <Layout>
      <Head>
        <title>Hello, from alanhc</title>
        <meta name="description" content="Alan Tseng | alanhc | 曾宏鈞's website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/*
      <h1 className={styles.title}>
        Hi! I&apos;m <Link href="/">Alan</Link>
      </h1>
      */}
      
      <LeftCheckBox search_groups={portfolio.search_groups}/>
      
      <CollectionResult projects={portfolio.projects}/>
    
    </Layout>
  )
}

export async function getStaticProps() {
//export async function getServerSideProps() {
  console.log(process.env.baseUrl)
  const res = fetch(`${process.env.baseUrl}/api/portfolio.json`)
  
  const portfolio = await (await res).json()
  
  //console.log("===", portfolio)
  return {
    props: {
      portfolio,
    },
  }
}
export default Home

