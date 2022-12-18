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
import { Divider, Text, Image, VStack, Container, HStack, Stack, Heading, Flex, Card, FormControl, FormLabel, Input, FormHelperText, Textarea, FormErrorMessage, Center } from "@chakra-ui/react";
//import Link from 'next/link' 
import { Link } from '@chakra-ui/react'
import Experience from '../components/Experience'
import { Avatar, AvatarBadge, AvatarGroup, Button } from '@chakra-ui/react'
import { Tooltip, SimpleGrid, Box } from '@chakra-ui/react'
import YouTube from "react-youtube";
import { useRouter } from 'next/router'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import Profile from '../components/Profile'
import { Field, Form, Formik } from 'formik';
import { useState } from 'react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
const jsonDirectory = path.join(process.cwd(), 'public/api');
const Home: NextPage = ({ portfolio }: any) => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [msg, setMsg] = useState("")
  const opts = {
    height: '240',
    width: '240',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };
  const handleInputChange = (e: any) => {
    setMsg(e.target.value)
  }

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

      <VStack spacing={10} >
        <Profile portfolio={portfolio} />
        <Experience experience={portfolio.experience} />
        <Heading size='xl' color='blue.500'>Projects</Heading>
        <Flex direction={{ base: 'column', md: 'row' }} >
          <LeftCheckBox search_groups={portfolio.search_groups} global_state={{ search: portfolio.search }} />

          <CollectionResult projects={portfolio.projects} global_state={{ search: portfolio.search }} />
        </Flex>
        <Heading size='xl' color='blue.500'>Interest</Heading>
        <Text>
          {portfolio.interest.map((_interest: any, i: number) => (
            <Link key={i} href={_interest[Object.keys(_interest)[0]]} isExternal>
              {Object.keys(_interest)} <ExternalLinkIcon mx='2px' />
            </Link>

          ))}
        </Text>

      </VStack>
      <Center>
        <Heading size='xl' color='blue.500'>Contact</Heading>
      </Center>
      <Container>
        <HStack mt="5" >
          <Textarea
            value={msg}
            placeholder='write something to me...'
            onChange={handleInputChange}
            size='sm'
          />
          <Button onClick={() => router.push(`mailto:alanhc.tseng1999@gmail.com?subject=hello,from alanhc.github.io&body=${msg}`)}>
            Send
          </Button>
        </HStack>
      </Container>

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

