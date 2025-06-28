import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/legacy/image";
import styles from "../styles/Home.module.css";
import path from "path";
import { promises as fs } from "fs";
import { useRouter } from "next/router";
import Profile from "@/components/partial/Profile";
import { TagContext } from "@/context/portfolioContext";
import Experience from "@/components/partial/Experience";
import Layout from "@/components/Layout";
import CollectionResult from "@/components/partial/CollectionResult";
import LeftCheckBox from "@/components/partial/LeftCheckBox";
import portfolioData from "../../public/api/portfolio.json";
import generateRSS from "@/lib/generateRSS";
import NextLink from "next/link";
import {
  useDisclosure,
  VStack,
  Heading,
  Flex,
  Center,
  Card,
  HStack,
  Box,
  Container,
  CardBody,
  Stack,
  StackDivider,
  Textarea,
  Button,
  Link,
} from "@chakra-ui/react";
import SEO from "../../next-seo.config";
import { NextSeo } from "next-seo";
import { get } from "lodash";
import { getMarkdownData } from "@/lib/parseFile";
const Home: NextPage = ({ portfolio }: any) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [msg, setMsg] = useState("");

  const opts = {
    height: "240",
    width: "240",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };
  const handleInputChange = (e: any) => {
    setMsg(e.target.value);
  };
  const tagContext = useContext(TagContext);
  const tags = tagContext?.tags === undefined ? [] : tagContext.tags;
  //console.log(tags);
  return (
    <Layout>
      <NextSeo
        title="Hello, from alanhc"
        description="Alan Tseng | alanhc | 曾宏鈞's website"
        {...SEO}
      />

      {/*edu work awards*/}
      <VStack spacing={10}>
        <Profile portfolio={portfolio} />
        <Experience experience={portfolio.experience} />
        
       
      </VStack>
      {/*interest*/}
      <Center mt="5">
        <Heading size="xl" color="blue.500">
          Interest
        </Heading>
      </Center>
      <Card variant="filled">
        <Center mt="10">
          <HStack maxW="2xl">
            {portfolio.interest.map((_interest: any, i: number) => (
              <Link as={NextLink}key={i} href={_interest.link}>
                <Box mt="5" ml="5" mb="5" mr="5">
                  <Image
                    width={300}
                    height={300}
                    src={_interest.image}
                    alt={_interest.title}
                  />

                  <Center>{_interest.title}</Center>
                </Box>
              </Link>
            ))}
          </HStack>
        </Center>
      </Card>
      {/*histiry*/}
      <Center mt="10">
        <Heading size="xl" color="blue.500">
          History
        </Heading>
      </Center>
      <Container mt="5">
        <Card variant="filled">
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              {portfolio.timeline.map((_timeline: any, i: number) => (
                <Flex key={i} mt="3" maxW="5xl">
                  <Heading size="xs" textTransform="uppercase">
                    {_timeline.time}
                  </Heading>
                  <Container ml="3">
                    <ul>
                      {_timeline.description.map(
                        (_description: any, i: number) => (
                          <li key={i}> {_description}</li>
                        )
                      )}
                    </ul>
                  </Container>
                </Flex>
              ))}
            </Stack>
          </CardBody>
        </Card>
      </Container>
      <Center mt="10">
        <Heading size="xl" color="blue.500">
          Contact
        </Heading>
      </Center>
      {/*contract*/}
      <Container>
        <HStack mt="5">
          <Textarea
            value={msg}
            placeholder="write something to me..."
            onChange={handleInputChange}
            size="sm"
          />
          <Button
            onClick={() =>
              router.push(
                `mailto:alanhc.tseng1999@gmail.com?subject=hello,from alanhc.github.io&body=${msg}`
              )
            }
          >
            Send
          </Button>
        </HStack>
      </Container>
    </Layout>
  );
};

export async function getStaticProps() {
  const project = await getMarkdownData("projects");
  let tags = project.map((x: any) => x.tech).flat();
  tags.push("select");
  //fs.writeFile("src/config/tags.json", JSON.stringify({tags:tags}));
  generateRSS();
  const portfolio = portfolioData;
  return {
    props: {
      portfolio,
    },
  };
}
export default Home;
