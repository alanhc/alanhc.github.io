import { NextPage } from "next"

import { promises as fs } from 'fs';
import { getSortedPostsData } from '../../lib/posts';
import NextLink from 'next/link';
import { Container, Divider, Link, position } from "@chakra-ui/react";
import Date from '../../components/Date';
import BlogLayout from "../../components/BlogLayout";
import ReactMarkdown from "react-markdown";
import { Flex, Tag, Button, SimpleGrid, Box, Text, StackDivider, Stack, Heading, Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import {
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList, Input, TagCloseButton, TagLabel
} from '@chakra-ui/react'

import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import { useState } from "react";
import Layout from "../../components/TestLayout";
import { useRouter } from 'next/router';
const Blog: NextPage = ({ allPostsData }: any) => {
    const router = useRouter();
    
    const tagsSet = new Set();

    allPostsData.forEach(({ tag }: any) => {
        tag.forEach((t: string) => {
            tagsSet.add(t);
        });
    });
    const tagsArray = Array.from(tagsSet) as string[];


    const { tag } = router.query;
    //console.log(tagsSet)
    const [search, setSearch] = useState(tag)
    const search_text = ({ content, tag, title }: any) => {
        return content.includes(search) || title.includes(search) || tag.includes(search)
    }
    return (
        <BlogLayout>
            <Flex>
            <Input placeholder="👀" value={search} onChange={(event) => setSearch(event.target.value)} />
             <Button onClick={()=>setSearch("")}>Clear</Button>
             </Flex>
            <Box mt={2} mb={2}>
                {tagsArray.sort().map((t: string, index) => (
                    <Link
                        size='md'
                        key={index}
                        borderRadius='full'
                        variant='solid'
                        colorScheme='blue'
                        onClick={() => setSearch(t)}
                    >
                        <span>
                            {(index !== tagsArray.length - 1) ? t + " | " : t}
                        </span>
                    </Link>
                ))}

            </Box>

            {(!search) ?
                <Stack divider={<StackDivider />} >

                    {allPostsData.map(({ id, date, title, tag, content }: any) => (

                        (<NextLink key={id} href={`/next-blog/posts/${id}`}>

                            <Box >
                                📍{title}
                                {" - "}

                                {tag.map((t: string, i: number) => (
                                    <small key={i}>{t} {i !== tag.length - 1 && ","}</small>

                                ))}

                                <div style={{ float: "right" }}>
                                    <small >{date}</small>
                                </div>
                            </Box>

                        </NextLink>)

                    ))}
                </Stack> : <Accordion allowToggle>
                    {allPostsData.filter(search_text).map(({ id, date, title, tag, content }: any) => (


                        <AccordionItem key={id}>
                            <h2>
                                <AccordionButton>
                                    <Box as="span" flex='1' textAlign='left'>
                                        {title}
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                {tag.map((t: string, i: number) => (
                                    <Tag key={i} ml="1">{t}</Tag>
                                ))}<br />
                                <NextLink href={`/next-blog/posts/${id}`}>

                                    <ReactMarkdown className="no_newline">{content}</ReactMarkdown>

                                </NextLink>
                            </AccordionPanel>
                        </AccordionItem>
                    ))}

                </Accordion>
            }
        </BlogLayout>
    );
}

export async function getStaticProps() {
    const allPostsData = getSortedPostsData();
    return {
        props: {
            allPostsData,
        },
    };


}
export default Blog;

