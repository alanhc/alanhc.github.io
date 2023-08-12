import { NextPage } from "next"

import { promises as fs } from 'fs';
import { getSortedPostsData } from '../../lib/posts';
import NextLink from 'next/link';
import { Container, Divider, Link } from "@chakra-ui/react";
import Date from '../../components/Date';
import BlogLayout from "../../components/BlogLayout";
import { Flex, Tag, Button, SimpleGrid, Box, Text, StackDivider, Stack, Heading, Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import {
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,
} from '@chakra-ui/react'
const Blog: NextPage = ({ allPostsData }: any) => {
    return (
        <Container>
            <Heading>Notes</Heading>
    
            <Stack divider={<StackDivider />} >
                {allPostsData.map(({ id, date, title, tag }: any) => (
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
            </Stack>
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

