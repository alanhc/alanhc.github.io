import { NextPage } from "next"

import { promises as fs } from 'fs';
import { getSortedPostsData } from '../../lib/posts';
import NextLink from 'next/link';
import { Container, Divider, Link } from "@chakra-ui/react";
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
const Blog: NextPage = ({ allPostsData }: any) => {

    const tagsSet = new Set();

    allPostsData.forEach(({ tag }: any) => {
        tag.forEach((t: string) => {
            tagsSet.add(t);
        });
    });
    const tagsArray = Array.from(tagsSet) as string[];

    const distinctTags = Array.from(tagsSet);

    console.log(tagsSet)
    const [search, setSearch] = useState("")
    const search_text = ({ content, tag, title }: any) => {
        return content.includes(search) || title.includes(search) ||  tag.includes(search)
    }
    return (
        <Container>

            <Heading>Notes</Heading>
            <Input placeholder="👀" value={search} onChange={(event) => setSearch(event.target.value)} />
            <Box mt={2} mb={2}>
                {distinctTags.map((t, index) => (
                    <Link
                        size='md'
                        key={index}
                        borderRadius='full'
                        variant='solid'
                        colorScheme='blue'
                        onClick={() => setSearch(t)}
                    >   
                        {(index !== distinctTags.length - 1) ? t + " | " : t}
                    </Link>
                ))}
            </Box>

            {(!search) ?
                <Stack divider={<StackDivider />} >

                    {allPostsData.map(({ id, date, title, tag, content }: any) => (
                        <Box key={id}>
                            <NextLink href={`/next-blog/posts/${id}`}>
                                <a>
                                    📍{title}
                                    {" - "}
                                    <small>{date}</small>

                                    {tag.map((t: string, i: number) => (
                                        <Tag key={i} ml="1">{t}</Tag>
                                    ))}
                                </a>
                            </NextLink>
                        </Box>
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
                                    <a>
                                        <ReactMarkdown className="no_newline">{content}</ReactMarkdown>
                                    </a>
                                </NextLink>
                            </AccordionPanel>
                        </AccordionItem>
                    ))}

                </Accordion>
            }
        </Container>
    )
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

