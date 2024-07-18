import { NextPage } from "next";

import { promises as fs } from "fs";
import { getSortedPostsData } from "@/lib/posts";
import NextLink from "next/link";
import SEO from "next-seo.config";
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
// import Date from "@/components/partial/Date";
import BlogLayout from "@/components/BlogLayout";
import ReactMarkdown from "react-markdown";
import { remark } from "remark";
// import CalHeatmap from "cal-heatmap";

// Optionally import the CSS
// import "cal-heatmap/cal-heatmap.css";
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
import { NextSeo } from "next-seo";
import moment from "moment";
import { usePathname } from "next/navigation";
export async function getStaticProps() {
  let allPostsData: any = await getSortedPostsData();
  allPostsData = allPostsData.map((post: any) => {
    let d = moment(post.date, "YYYY-MM-DD");

    return {
      year: d.year(),
      month: d.month(),
      month_c: d.format("MMMM"),
      day: d.day(),
      ...post,
    };
  });
  let posts: any = [...allPostsData];

  allPostsData = [];

  let m = 0;
  let yy = -1;
  let mm = -1;

  let y_ct = 0;
  posts.map((p: any) => {
    if (yy !== p.year) {
      allPostsData.push({
        title: p.year,
        ct: 0,
        month: [
          {
            title: p.month_c,
            posts: [{ id: p.id, title: p.title }],
          },
        ],
      });
      yy = p.year;
      mm = p.month;
      let y = allPostsData.length - 1;
      if (y > 0) allPostsData[y - 1].ct = y_ct + 1;
      y_ct = 0;
    } else if (mm === p.month) {
      let y = allPostsData.length - 1;
      let m = allPostsData[y].month.length - 1;
      allPostsData[y].month[m].posts.push({ id: p.id, title: p.title });
      y_ct++;
    } else {
      let y = allPostsData.length - 1;
      allPostsData[y].month.push({
        title: p.month_c,
        posts: [{ id: p.id, title: p.title }],
      });
      mm = p.month;
      y_ct++;
    }
  });
  allPostsData[allPostsData.length - 1].ct = y_ct + 1;

  return {
    props: {
      allPostsData,
    },
  };
}

const Blog: NextPage = ({ allPostsData }: any) => {
  const { activeStep } = useSteps({
    index: 1,
    count: allPostsData.length,
  });

//   const cal = new CalHeatmap();
 
  const pathname = usePathname();
  return (
    <BlogLayout>
      {/* {pathname == "/archive" && (
        <Container
          id="example-day"
        //   maxW="7xl"
        //   p="5"
        //   className="ck-reset"
        ></Container>
      )} */}
      {/* <HeatMap
                value={value}
                weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
                startDate={new Date('2016/01/01') as Date}
            /> */}
      <Stepper size="lg" index={-1} orientation="vertical" gap="0">
        {allPostsData.map((y: any, i: number) => (
          <Step key={i}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={`${y.title}`}
                active={" "}
              />
            </StepIndicator>
            <Box flexShrink="0">
              <StepTitle>
                {" "}
                <Tag mb="5">{y.ct}</Tag>
              </StepTitle>
              <StepDescription>
                <Stepper index={-1} orientation="vertical" gap="0">
                  {y.month.map((m: any, i: number) => (
                    <Step key={i}>
                      <StepIndicator>
                        <StepStatus
                          complete={<StepIcon />}
                          incomplete={`${m.title.slice(0, 3)}`}
                          active={" "}
                        />
                      </StepIndicator>
                      <Box flexShrink="0">
                        <StepTitle>
                          <Tag mb="5"> {m.posts.length} </Tag>
                        </StepTitle>
                        <StepDescription>
                          <Stack>
                            {m.posts.map((p: any, i: number) => (
                              <Box
                                key={i}
                                as={NextLink}
                                href={`/logA/posts/${p.id}`}
                              >
                                {p.title}
                              </Box>
                            ))}
                          </Stack>
                        </StepDescription>
                      </Box>
                      <StepSeparator />
                    </Step>
                  ))}
                </Stepper>
              </StepDescription>
            </Box>
            {/* <Heading>{y.title} ({y.ct}) </Heading> */}

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </BlogLayout>
  );
};

export default Blog;
