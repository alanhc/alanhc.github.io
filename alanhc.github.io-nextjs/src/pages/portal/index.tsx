import { NextPage } from "next";

import { promises as fs } from "fs";
import { getSortedPostsData } from "@/lib/posts";
import NextLink from "next/link";
import SEO from 'next-seo.config';
import {
  Checkbox,
  Container,
  Divider,
  InputGroup,
  InputRightElement,
  Link,
  Select,
  position,
  useColorMode,
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
import Layout from "../../components/TestLayout";
import { useRouter } from "next/router";
import { CloseIcon } from "@chakra-ui/icons";
import { NextSeo } from 'next-seo';

const Blog: NextPage = ({ allPostsData }: any) => {
  const router = useRouter();
  const { tag } = router.query;
  const tagsSet = new Set();
  tagsSet.add(".");
  allPostsData.forEach(({ tag }: any) => {
    if (tag) {
      tag.forEach((t: string) => {
        tagsSet.add(t);
      });
    }
  });
  let date_options = Array.from(new Set(allPostsData.map(({ date }: any) => {
    const [y, m, d] = date.split("-")
    return `${y}-${m}`
  })))
  
  const tagsArray = Array.from(tagsSet) as string[];


  //console.log(tagsSet)
  const [select, setSelect] = useState(true)
  const [search, setSearch] = useState(tag);
  const filter_select = ({ content, tag, title }: any) => {
    if (!select) return true
    else return tag.includes("select")
  }
  const search_text = ({ content, tag, title }: any) => {
    if (!searchTag&& !search) return true
    if (searchTag === "." && !search) return true
    if (searchTag !== "." && searchTag && search) return tag.includes(searchTag) && (content.includes(search) || title.includes(search))
    else if (searchTag !== "." && searchTag) return tag.includes(searchTag)
    else return content.includes(search) || title.includes(search);
  };
  const [searchDate, setSearchDate] = useState("");
  const search_date = ({ content, tag, title, date }: any) => {
    let [y,m,d] = date.split("-")
    console.log(`${y}-${m}`,searchDate)
    if (!searchDate) return true;
    else return `${y}-${m}`===searchDate
  }
  const [searchTag, setSearchTag] = useState("")
 let preCh=""
  return (
    
    <BlogLayout>
      Life is short and memory is limited. Log it if you might forget it.
      <Flex mt={2}>
        <InputGroup size="md">
          <Input
            placeholder="👀"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <InputRightElement width="4.5rem">
            {search && <CloseIcon h="1.75rem" onClick={() => setSearch("")} />}
          </InputRightElement>
        </InputGroup>
        
      </Flex>
      <Select onChange={(o)=>setSearchDate(o.target.value)} placeholder='Select month'>
        {date_options.map((op:any)=>(
           <option key={op} value={op}>{op}</option>
        ))}
       
        {/* <option value='option2'>Option 2</option>
        <option value='option3'>Option 3</option> */}
      </Select>
      <Checkbox defaultChecked onChange={()=>setSelect(!select)}>Selected</Checkbox>
      <Box mt={2} mb={2}>
        {tagsArray.sort().map((t: string, index: number) => {
          if (index > 0 && tagsArray[index - 1][0] !== tagsArray[index][0]) {
            return (
              <>
                <Text as='b' color={"blue"}>{t.slice(0, 1)} </Text>
                <Link
                  size="md"
                  key={index}
                  borderRadius="full"
                  variant="solid"
                  colorScheme="blue"
                  onClick={() => setSearchTag(t)}
                >
                  <span>{index !== tagsArray.length - 1 ? t + ", " : t}</span>
                </Link>
              </>
            );
          } else {
            return (
              <Link
                size="md"
                key={index}
                borderRadius="full"
                variant="solid"
                colorScheme="blue"
                onClick={() => setSearchTag(t)}
              >
                <span>{index !== tagsArray.length - 1 ? t + ", " : t}</span>
              </Link>
            );
          }
        })}
      </Box>
      tag: {JSON.stringify(searchTag)}  date: {JSON.stringify(searchDate)}
      
      {(!search) && (!searchTag) && (!searchDate) ? (
        <Stack divider={<StackDivider />}>
          <Text>total:  {JSON.stringify(allPostsData.length)}</Text>
          {allPostsData.filter(filter_select).map(({ id, date, title, tag, content }: any) => (
            <NextLink key={id} href={`/logA/posts/${id}`}>
              <Box>
                📍{title}
                {" - "}
                {(tag) && tag.map((t: string, i: number) => (
                  <small key={i}>
                    {t} {i !== tag.length - 1 && ","}
                  </small>
                ))}
                <div style={{ float: "right" }}>
                  <small>{date}</small>
                </div>
              </Box>
            </NextLink>
          ))}
        </Stack>
      ) : (
        <Accordion allowToggle>
            total:  {JSON.stringify(allPostsData
            .filter(search_text)
            .filter(filter_select)
            .filter(search_date).length)}
          {allPostsData
            .filter(search_text)
            .filter(filter_select)
            .filter(search_date)
            .map(({ id, date, title, tag, content, markdownContent }: any) => (
              <AccordionItem key={id}>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      {title}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {tag.map((t: string, i: number) => (
                    <Tag key={i} ml="1">
                      {t}
                    </Tag>
                  ))}
                  <br />
                  <NextLink href={`/logA/posts/${id}`}>
                    <ReactMarkdown className="no_newline">
                      {markdownContent}
                    </ReactMarkdown>
                  </NextLink>
                </AccordionPanel>
              </AccordionItem>
            ))}
        </Accordion>
      )}
    </BlogLayout>

  );
};

export async function getStaticProps() {
  const allPostsData = await getSortedPostsData();
  //console.log(allPostsData)
  return {
    props: {
      allPostsData,
    },
  };
}
export default Blog;
