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
export async function getStaticProps() {
  generateRSS();
  let portfolio = portfolioData;
  
  //portfolio.search_groups = 
  return {
    props: {
      portfolio,
    },
  };
}
const Projects: NextPage = ({ portfolio }: any) => {
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
        {/*projects*/}
        <Flex direction={{ base: "column", md: "row" }}>
          <LeftCheckBox
            search_groups={portfolio.search_groups}
            global_state={{ search: portfolio.search }}
            init_tech_tags={portfolio.search_groups[1].options}
          />
          <CollectionResult
            projects={portfolio.projects}
            global_state={{ search: portfolio.search }}
          />
        </Flex>
      </VStack>
     
    </Layout>
  );
};


export default Projects;
