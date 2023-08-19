import BlogLayout from "../../../components/TestLayout";
import { getAllPostIds, getPostData } from '../../../lib/posts';
import Head from 'next/head';
import Date from '../../../components/Date';
import utilStyles from '../../styles/utils.module.css';
import { Box, Tag, Container, Heading, Link, Code, useClipboard, Flex, Button, HStack, Textarea, Divider, UnorderedList, OrderedList, ListItem } from "@chakra-ui/react";
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
import Script from "next/script";
import rehypePrism from 'rehype-prism-plus';

function CodeBlock({ language, node, inline, className, children, ...props }: any) {
  const { onCopy, value, setValue, hasCopied } = useClipboard(children);
  const match = /language-(\w+)/.exec(className || '');
  
  if (inline || !match) { //只有一行的code
    return (<Flex mb={2}>
      <Code {...props} colorScheme="blackAlpha">
        {children}
      </Code>
      <Button ml={2} onClick={onCopy} colorScheme='blue' variant='outline'>{hasCopied ? "Copied!" : "Copy"}</Button>
    </Flex>)
  } else if (match![1] ==='mermaid') {
    return (<Box className='mermaid'>{children}</Box>)
  } else {
    return (
      <Flex mb={2}>
        <SyntaxHighlighter
          style={darcula as { [key: string]: CSSProperties }}
          language={match![1] }
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
        <Button ml={2} onClick={onCopy} colorScheme='blue' variant='outline'>{hasCopied ? "Copied!" : "Copy"}</Button>
      </Flex>
    );
  }


}
function SectionBlock({ node, inline, className, children, id, ...props }: any) {
  const router = useRouter()
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';
  const URL = `${origin}${router.asPath}`;
  const { onCopy, value, setValue, hasCopied } = useClipboard(URL + "#" + children);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Link href={`#${children}`} id={children} onClick={onCopy} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <Heading  {...props}>
        {children} {isHovering && "🔗"}
      </Heading>
    </Link>
  );
}
const components = {
  code: CodeBlock,
  h1: ({ node, ...props }: any) => <SectionBlock as="h1" size='xl' {...props} />,
  h2: ({ node, ...props }: any) => <SectionBlock as="h2" size='lg' {...props} />,
  h3: ({ node, ...props }: any) => <SectionBlock as="h3" size='md' {...props} />,
  h4: ({ node, ...props }: any) => <SectionBlock as="h4" size='sm' {...props} />,
  h5: ({ node, ...props }: any) => <SectionBlock as="h5" size='xs' {...props} />,
  a: ({ node, ...props }: any) => <Link as={NextLink} {...props} />,
};


export async function getStaticProps({ params }: any) {
  const postData = await getPostData(params.id);

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
        <SectionBlock>{postData.title}</SectionBlock>
        <div>
          <Date dateString={postData.date} />
        </div>
        <Divider />
        {/*TOC*/}
        <UnorderedList>

          {postData.tocMarkdown.json.map((heading: any) => (
            <ListItem key={heading.content}>
              <Link href={`#${heading.content}`}>
                {heading.content}
              </Link>
            </ListItem>
          ))}

        </UnorderedList>
        {/*正文*/}
        <ReactMarkdown components={components} remarkPlugins={[remarkToc, remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {postData.contentHtml}
        </ReactMarkdown>
        <Script
          id="mermaidjs"
          type="module"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
            mermaid.initialize({ startOnLoad: true });
            mermaid.contentLoaded();
            `,
          }}
        />
        {/*Tags*/}
        <Container mt="5">
          {postData.tag.map((t: string, i: number) => (
            <Link key={i} onClick={() => router.push(`/next-blog?tag=${t}`)}>
              <Tag>
                {t}
              </Tag>
            </Link>

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

        <Link onClick={() => router.push("/next-blog")}>
          👈Go Back
        </Link>
      </article>


    </Container>
  );
}
