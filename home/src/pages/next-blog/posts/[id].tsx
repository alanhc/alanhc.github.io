import BlogLayout from "../../../components/TestLayout";
import { getAllPostIds, getPostData } from "../../../lib/posts";
import Head from "next/head";
import Date from "../../../components/partial/Date";
import {
  Box,
  Tag,
  Container,
  Heading,
  Link,
  Code,
  useClipboard,
  Flex,
  Button,
  HStack,
  Textarea,
  Divider,
  UnorderedList,
  OrderedList,
  ListItem,
} from "@chakra-ui/react";
import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CSSProperties, Children } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import remarkToc from "remark-toc";
import remarkSlug from "remark-slug";
import router from "next/router";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import rehypeRaw from "rehype-raw";
import NextLink from "next/link";
import Script from "next/script";
import SectionBlock from "../../../components/partial/SectionBlock";
import slugify from "slugify"
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import rehypeSlug from 'rehype-slug'
import GithubSlugger, {slug} from 'github-slugger'
import rehypePrism from 'rehype-prism-plus'

function CodeBlock({
  language,
  node,
  inline,
  className,
  children,
}: any) {
  const { onCopy, value, setValue, hasCopied } = useClipboard(children);
  const match = /language-(\w+)/.exec(className || "");
  if (inline || !match) {
    //只有一行的code
    return (
      <Flex mb={2}>
        <Code colorScheme="blackAlpha">
          {children}
        </Code>
        <Button ml={2} onClick={onCopy} colorScheme="blue" variant="outline">
          {hasCopied ? "Copied!" : "Copy"}
        </Button>
      </Flex>
    );
  } else if (match![1] === "mermaid") {
    return <Box className="mermaid">{children}</Box>;
  } else {
    return (
      <Flex mb={2}>
        <SyntaxHighlighter
          style={darcula}
          language={match![1]}
          PreTag="div"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
        <Button ml={2} onClick={onCopy} colorScheme="blue" variant="outline">
          {hasCopied ? "Copied!" : "Copy"}
        </Button>
      </Flex>
    );
  }
}

const components = {
  code: CodeBlock,
  h1: ({ node, ...props }: any) => (
    <SectionBlock as="h1" size="xl" {...props} />
  ),
  h2: ({ node, ...props }: any) => (
    <SectionBlock as="h2" size="lg" {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <SectionBlock as="h3" size="md" {...props} />
  ),
  h4: ({ node, ...props }: any) => (
    <SectionBlock as="h4" size="sm" {...props} />
  ),
  h5: ({ node, ...props }: any) => (
    <SectionBlock as="h5" size="xs" {...props} />
  ),
  a: ({ node, ...props }: any) => <Link as={NextLink} {...props} />,
  ul:  ({ node, ...props }: any) => <UnorderedList {...props} />,
  li:  ({ node, ...props }: any) => <ListItem {...props} />,
  ol: ({ node, ...props }: any) => <OrderedList {...props} />,
};

export async function getStaticProps({ params }: any) {
  const postData = await getPostData(params.id);
  const all_markdonw = postData.tocMarkdown.content+"\n"+postData.postMarkdown
  const mdxSource = await serialize(all_markdonw,
    {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeRaw],
        format: 'mdx',
      }
    }
  )
  
  return {
    props: {
      postData,
      mdxSource: mdxSource
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

export default function Post({ postData, mdxSource }: any) {
  console.log(mdxSource)
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

        
        {/*正文*/}
        <MDXRemote {...mdxSource} components={components} />
        {/*<ReactMarkdown
          components={components}
          remarkPlugins={[remarkToc, remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {postData.postMarkdown}
          </ReactMarkdown>*/}
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
              <Tag>{t}</Tag>
            </Link>
          ))}
        </Container>

        <Link onClick={() => router.push("/next-blog")}>👈Go Back</Link>
      </article>
    </Container>
  );
}
