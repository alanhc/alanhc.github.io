import { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from "next/legacy/image"
import styles from '../styles/Home.module.css'
import path from 'path';
import { promises as fs } from 'fs';
import YouTube from "react-youtube";
import { useRouter } from 'next/router';
import { StarIcon } from '@chakra-ui/icons'
import NextLink from 'next/link';
import Profile from '../components/partial/Profile'
import { TagContext } from '../context/portfolioContext'
import Experience from '../components/partial/Experience'
import Layout from '../components/Layout'
import CollectionResult from '../components/partial/CollectionResult'
import LeftCheckBox from '../components/partial/LeftCheckBox'
import portfolioData from "../../public/api/portfolio.json"
import { useDisclosure, VStack, Heading, Flex, Center, Card, HStack, Box, Container, CardBody, Stack, StackDivider, Textarea, Button } from '@chakra-ui/react'



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
  const tagContext = useContext(TagContext);
  const tags = (tagContext?.tags === undefined) ? [] : tagContext.tags
  console.log(tags)
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
          <LeftCheckBox search_groups={portfolio.search_groups} global_state={{ search: portfolio.search }} init_tech_tags={portfolio.search_groups[1].options} />

          <CollectionResult projects={portfolio.projects} global_state={{ search: portfolio.search }} />
        </Flex>
       


      </VStack>
      <Center mt="5">
      <Heading size='xl' color='blue.500'>Interest</Heading>
      </Center>
      <Card variant="filled">
        <Center mt="10">
          <HStack maxW="2xl" >

            {portfolio.interest.map((_interest: any, i: number) => (
              <Link key={i} href={_interest.link} >

                <Box mt="5" ml="5" mb="5" mr="5">
                  
                  <Image width={300} height={300} src={_interest.image} alt={_interest.title} />
               
                  <Center>{_interest.title}</Center>
                </Box>
              </Link>
            ))}

          </HStack>
        </Center>
      </Card>
      
      <Center mt="10">
        <Heading size='xl' color='blue.500'>History</Heading>
      </Center>
      <Container mt="5">
        <Card variant="filled">
          <CardBody>
            <Stack  divider={<StackDivider />} spacing='4'>
                
                {portfolio.timeline.map((_timeline: any, i: number) => (
                  <Flex key={i} mt="3" maxW="5xl">
                    <Heading size='xs' textTransform='uppercase'>
                      {_timeline.time}
                    </Heading>
                    <Container ml="3" >
                      <ul>
                        {_timeline.description.map((_description: any, i: number) => (
                          
                         
                            <li key={i}> {_description}</li>
                     
                      
                        ))}
                      </ul>
                    </Container>
                  </Flex>

                ))}
        
            </Stack>
          </CardBody>
        </Card>
      </Container>
      <Center mt="10">
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
  const portfolio = portfolioData;
  return {
    props: {
      portfolio,
    },
  }
}
export default Home

