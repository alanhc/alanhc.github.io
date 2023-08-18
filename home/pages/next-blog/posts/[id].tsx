import BlogLayout from "../../../components/TestLayout";
import { getAllPostIds, getPostData } from '../../../lib/posts';
import Head from 'next/head';
import Date from '../../../components/Date';
import utilStyles from '../../styles/utils.module.css';
import { Tag, Container, Heading, Link, Code, useClipboard, Flex, Button, HStack, Textarea, Divider, UnorderedList, OrderedList, ListItem } from "@chakra-ui/react";
import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CSSProperties, Children } from "react";
import remarkGfm from 'remark-gfm'
import ReactMarkdown from "react-markdown";
import remarkToc from 'remark-toc';
import remarkSlug from 'remark-slug';
import router from "next/router";
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react'
import rehypeRaw from "rehype-raw";
import NextLink from 'next/link';


function CodeBlock({ node, inline, className, children, ...props }: any) {
  const { onCopy, value, setValue, hasCopied } = useClipboard(children);
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <Flex mb={2}>
      <SyntaxHighlighter
        style={darcula as { [key: string]: CSSProperties }}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
      <Button ml={2} onClick={onCopy} colorScheme='blue' variant='outline'>{hasCopied ? "Copied!" : "Copy"}</Button>
    </Flex>
  ) : (
    <Flex mb={2}>
      <Code {...props} colorScheme="blackAlpha">
        {children}
      </Code>
      <Button ml={2} onClick={onCopy} colorScheme='blue' variant='outline'>{hasCopied ? "Copied!" : "Copy"}</Button>
    </Flex>
  );
}
function SectionBlock({ node, inline, className, children, id, ...props }: any) {

  const router = useRouter()
  const { onCopy, value, setValue, hasCopied } = useClipboard("https://alanhc.github.io" + router.asPath + "#" + children);
  const [isHovering, setIsHovering] = useState(false);
  return (
    <Link onClick={onCopy} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>

      <Heading  {...props}>
        {children} {isHovering&&"🔗"}
      </Heading>
    </Link>
  );
}
const ListRenderer = ({ children }: any) => (
  <UnorderedList>{children}</UnorderedList>
);
const OrderListRenderer = ({ children }: any) => (
  <OrderedList>{children}</OrderedList>
);
const ListItemRenderer = ({ children }: any) => (
  <ListItem >{children}</ListItem>
);

const components = {
  code: CodeBlock,
  h1: ({ node, ...props }: any) => <SectionBlock as="h1" size='xl' {...props} />,
  h2: ({ node, ...props }: any) => <SectionBlock as="h2" size='lg' {...props} />,
  h3: ({ node, ...props }: any) => <SectionBlock as="h3" size='md' {...props} />,
  h4: ({ node, ...props }: any) => <SectionBlock as="h4" size='sm' {...props} />,
  h5: ({ node, ...props }: any) => <SectionBlock as="h5" size='xs' {...props} />,
  a: ({ node, ...props }: any) => <Link  {...props} />,
};
const components_toc = {
  ...components,
  ul: ListRenderer,
  ol: OrderListRenderer,
  li: ListItemRenderer,
};

export async function getStaticProps({ params }: any) {
  const postData = await getPostData(params.id);
  console.log("---", postData);
  return {
    props: {
      postData,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Post({ postData }: any) {


  return (
    <Container>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <Heading>{postData.title}</Heading>
        <div>
          <Date dateString={postData.date} />
        </div>
        <Divider />
        {/*TOC*/}
        <Container>
          <ReactMarkdown components={components_toc} >
            {postData.tocMarkdown}
          </ReactMarkdown>
        </Container>
        <ReactMarkdown components={components} remarkPlugins={[remarkToc, remarkGfm, remarkSlug]} rehypePlugins={[rehypeRaw]}>
          {postData.contentHtml}
        </ReactMarkdown>


        <Container mt="5">
          {postData.tag.map((t: string, i: number) => (
            <Tag key={i}>{t}</Tag>
          ))}
          {/*留言板
          <HStack mt={2}>
            <Textarea
              value={msg}
              placeholder='write something to me...'
              onChange={handleInputChange}
              size='sm'
            />
            <Button onClick={() => router.push(`mailto:alanhc.tseng1999@gmail.com?subject=hello,from alanhc.github.io &body=${msg} %0D%0A${window.location.href}`)}>
              Send
            </Button>
          </HStack>
          */}
        </Container>
        <Link>
          <a onClick={() => router.push("/next-blog")}>👈Go Back</a>
        </Link>
      </article>


    </Container>
  );
}
