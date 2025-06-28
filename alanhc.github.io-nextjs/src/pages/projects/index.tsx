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
import portfolioData from "../../../public/api/portfolio.json";
import generateRSS from "@/lib/generateRSS";
import NextLink from "next/link";

import {getFolderMarkdownData, getMarkdownData} from "@/lib/parseFile";
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
import SEO from "../../../next-seo.config";
import { NextSeo } from "next-seo";
export async function getStaticProps() {
  let portfolio = portfolioData;
  let projects = await getFolderMarkdownData("projects");
  //console.log(projects.content)

  let search_groups = [
    {
      title: "tags",
      options: Array.from(new Set(projects.map((x: any) => x.tags).flat())) ,
    },
    {
      title: "tech",
      options: Array.from(new Set(projects.map((x: any) => x.tech).flat())) ,
    }
  ]
  //portfolio.search_groups = 
  // console.log(portfolio.projects)
  return {
    props: {
      portfolio, projects, search_groups
    },
  };
}
const Projects: NextPage = ({ portfolio, projects, search_groups }: any) => {
  
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
  let tags = tagContext?.tags === undefined ? [] : tagContext.tags;
  //console.log(tags);
  //console.log(portfolio.projects, "\n\n\n",portfolio.search_groups)
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
            search_groups={search_groups}
            // global_state={{ search: portfolio.search }}
          />
          <CollectionResult
            projects={projects}
            // global_state={{ search: portfolio.search }}
          />
        </Flex>
      </VStack>
     
    </Layout>
  );
};


export default Projects;
