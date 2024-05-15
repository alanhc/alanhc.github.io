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
import { NotionRenderer } from 'react-notion-x'
import 'react-notion-x/src/styles.css'

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
  useColorMode,
} from "@chakra-ui/react";
import SEO from "../../next-seo.config";
import { NextSeo } from "next-seo";
import { get } from "lodash";
import { getFolderMarkdownData, getMarkdownData } from "@/lib/parseFile";
import { NotionAPI } from 'notion-client'
import { NotionPage } from "@/components/NotionPage";



const Home: NextPage = ({ portfolio,recordMap }: any) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [msg, setMsg] = useState("");
  const { colorMode, toggleColorMode } = useColorMode()
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

  return (
    <Layout>
      <NextSeo
        title="Hello, from alanhc"
        description="Alan Tseng | alanhc | 曾宏鈞's website"
        {...SEO}
      />
      <NotionPage recordMap={recordMap} rootPageId={"Alan-Tseng-6928c2d8766044269c70b5a4b248bed8"} colorMode={colorMode}/>
    </Layout>
  );
};

export async function getStaticProps() {
  const project = await getFolderMarkdownData("projects");
  let tags = project.map((x: any) => x.tech).flat();
  tags.push("select");
  tags = Array.from(new Set(tags));
  console.log(tags)
  fs.writeFile("src/config/tags.json", JSON.stringify({tags:tags}), 'utf8');
  generateRSS();
  const portfolio = portfolioData;
  const notion = new NotionAPI()
  const pageId = 'Alan-Tseng-6928c2d8766044269c70b5a4b248bed8'
  let recordMap = await notion.getPage(pageId)
  
  return {
    props: {
      portfolio,recordMap
    },
  };
}
export default Home;
