import { NextPage } from "next";

import { promises as fs } from "fs";
import { getSortedPostsData } from "@/lib/posts";
import NextLink from "next/link";
import SEO from 'next-seo.config';
import {
    Container,
    Divider,
    InputGroup,
    InputRightElement,
    Link,
    Select,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    position,
    useColorMode,
    useSteps,
} from "@chakra-ui/react";
import Date from "@/components/partial/Date";
import BlogLayout from "@/components/BlogLayout";
import ReactMarkdown from "react-markdown";
import { remark } from 'remark'
import {
    Flex,
    Tag,
    Button,
    SimpleGrid,
    Box,
    Text,
    StackDivider,
    Stack,
    Heading,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@chakra-ui/react";
import {
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,
    Input,
    TagCloseButton,
    TagLabel,
} from "@chakra-ui/react";

import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from "@chakra-ui/react";
import { useState } from "react";

import { useRouter } from "next/router";
import { CloseIcon } from "@chakra-ui/icons";
import { NextSeo } from 'next-seo';
import moment from "moment";
export async function getStaticProps() {
    let allPostsData: any = await getSortedPostsData();
    
    let mp:any = {}
    allPostsData = allPostsData.map((post: any) => {
        let d = moment(post.date, 'YYYY-MM-DD')
        if (!post.tags) post.tags = post.tag

        post.tags.map((t: any) => {
            if (!mp[t]) mp[t] = [post]
            else mp[t].push(post)
        })
        return {
            year: d.year(),
            month: d.month(),
            month_c: d.format("MMMM"),
            day: d.day(),
            ...post
        }
    })
    console.log("---", Object.keys(mp))
    


    return {
        props: {
            allPostsData, mp
        },
    };
}

const Blog: NextPage = ({ allPostsData, mp }: any) => {
    const { activeStep } = useSteps({
        index: 1,
        count: allPostsData.length,
    })
    let keys = Object.keys(mp)
    keys.sort()
    
    return (
        // <> {JSON.stringify(allPostsData)}
        <>
            <BlogLayout>
                {keys.map((k: any, i: number) => (
                    <Link key={i} as={NextLink} href={`#${k}`}>{k} {" "}</Link>
                ))}
                {keys.map((k: any, i: number) => (
                    <Stack key={k}>
                        <Heading id={k} size='md'>{k}</Heading>
                        <Stack direction={"column"}>
                            {mp[k].map((p: any, j: number) => (
                                <Box key={j}>
                                <Stack ml={10} direction={"row"}  key={j} as={NextLink} href={`/logA/posts/${p.id}`}><Tag minW="fit-content">{p.date}</Tag> <Text>{p.title}</Text></Stack>
                                </Box>
                            ))}
                        </Stack>
                    </Stack>    
                ))}
            </BlogLayout>
        </>

        // <BlogLayout>
               
        //     <Stepper  size='lg'  index={-1} orientation='vertical' gap='0'>
        //         {allPostsData.map((y: any, i: number) => (
        //             <Step key={i}>
        //                 <StepIndicator>
        //                     <StepStatus
        //                         complete={<StepIcon />}
        //                         incomplete={`${y.title}`}
        //                         active={" "}
        //                     />
        //                 </StepIndicator>
        //                 <Box flexShrink='0'>
        //                     <StepTitle> {y.ct}</StepTitle>
        //                     <StepDescription>
        //                     <Stepper index={-1} orientation='vertical' gap='0'>
        //                         {y.month.map((m: any, i: number) => (
        //                                 <Step key={i}>
        //                                     <StepIndicator>
        //                                         <StepStatus
        //                                             complete={<StepIcon />}
        //                                             incomplete={`${m.title.slice(0, 3)}`}
        //                                             active={" "}
        //                                         />
        //                                     </StepIndicator>
        //                                     <Box flexShrink='0'>
        //                                         <StepTitle> {m.posts.length} </StepTitle>
        //                                         <StepDescription>
        //                                             <Stack>
        //                                                 {m.posts.map((p: any, i: number) => (
        //                                                     <Box key={i} as={NextLink} href={`/logA/posts/${p.id}`}>{p.title}</Box>
        //                                                 ))}
        //                                             </Stack>
        //                                         </StepDescription>
        //                                     </Box>
        //                                     <StepSeparator />
        //                                 </Step>
                                  
        //                         ))}
        //                           </Stepper>

        //                     </StepDescription>
        //                 </Box>
        //                 {/* <Heading>{y.title} ({y.ct}) </Heading> */}

        //                 <StepSeparator />
        //             </Step>
        //         ))}
        //     </Stepper>

        // </BlogLayout>

    );
};


export default Blog;
