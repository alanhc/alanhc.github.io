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

import { getMarkdownData } from "@/lib/parseFile";
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
    AspectRatio,
} from "@chakra-ui/react";
import SEO from "../../../next-seo.config";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'
import { NextSeo } from "next-seo";
import { components } from "@/components/partial/MarkdownComponents";
import { da } from "date-fns/locale";
import YouTube from "react-youtube";
import NextImage from "next/legacy/image"
export async function getStaticPaths() {
    let fileNames: any = await glob(`src/projects/*.md`)

    fileNames = fileNames.map((f: any) => {
        return f.split("/").pop()
    })
    console.log(fileNames)
    const paths: any = [];
    fileNames.forEach((id: any) => {
        let slug = id.replace(/\.md$/, "");
        paths.push({
            params: {
                slug: `${slug}`
            }
        })
    })
    return { paths: paths, fallback: true };
}
export async function getStaticProps({ params }: any) {
    console.log(params)

    let metadata: any = (await getMarkdownData("projects", params.slug))[0];
    const mdxSource = await serialize(metadata.content, {
        mdxOptions: {
            development: process.env.NODE_ENV === 'development',
        }
    })
    return {
        props: {
            data: metadata, mdxSource
        },
    };
}
const Projects: NextPage = ({ data, mdxSource }: any) => {


    console.log(data, mdxSource)
    const opts = {

        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };
    return (
        <Layout>
            <NextSeo
                title="Hello, from alanhc"
                description="Alan Tseng | alanhc | 曾宏鈞's website"
                {...SEO}
            />
            {data &&
                <Box>
                    <Heading>{data.title}</Heading>
                    {data.modal.video &&
                        <AspectRatio ratio={4 / 3}>
                            <YouTube
                                videoId={data.modal.video}
                                opts={opts}
                            />
                        </AspectRatio>

                    }
                    {data.modal.screenshot?.map((img: string, i: number) => (

                        <NextImage key={i} width="400" height="300" layout="responsive" src={img} alt={img} />

                    ))}
                    {/* {JSON.stringify(data)} */}
                    <MDXRemote {...mdxSource} components={components} />
                </Box>}



        </Layout>
    );
};


export default Projects;
