import type { NextPage } from 'next'
import Head from 'next/head'
//import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Layout from '../components/Layout'
import CollectionResult from '../components/CollectionResult'
import LeftCheckBox from '../components/LeftCheckBox'
import { IProjects } from '../types/portfolio'
import path from 'path';
import { promises as fs } from 'fs';
import { Divider, Text, Image, VStack, Container, HStack, Stack, Heading } from "@chakra-ui/react";
//import Link from 'next/link' 
import { Link } from '@chakra-ui/react'

const jsonDirectory = path.join(process.cwd(), 'public/api');
const Home: NextPage = ({ portfolio }: any) => {
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
      <VStack maxW='full'>
        <Container maxW='full' centerContent>
          <Image borderRadius='full' src="image/me.jpeg" alt="me" width="300" height="300" />
          <Heading>Hi!  I&apos;m Alan Tseng</Heading>
          <Text fontSize='xl'>
            {portfolio.social_links.map((social:any,i:number)=>(
              <Link key={i} color='blue.500' href={social.link}>
                {social.name} {(i+1<portfolio.social_links.length)?" | ":""}
              </Link>
            ))}
          </Text>
          <Text fontSize='sm'>{portfolio.quote}</Text>
        </Container>
        <Divider />

        <Stack direction={{ base: 'column', md: 'row' }} >
          <LeftCheckBox search_groups={portfolio.search_groups} global_state={{ search: portfolio.search }} />

          <CollectionResult projects={portfolio.projects} global_state={{ search: portfolio.search }} />
        </Stack>
      </VStack>

    </Layout>
  )
}

export async function getStaticProps() {
  //export async function getServerSideProps() {
  //console.log(process.env.baseUrl)
  //const res = fetch(`${process.env.baseUrl}/api/portfolio.json`)

  //const portfolio = await (await res).json()

  const portfolio = JSON.parse(await fs.readFile(jsonDirectory + '/portfolio.json', 'utf8'));

  //console.log("===", portfolio, typeof portfolio)
  return {
    props: {
      portfolio,
    },
  }
}
export default Home

