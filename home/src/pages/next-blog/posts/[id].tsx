import BlogLayout from "@/components/BlogLayout";
import { getAllPostIds, getPostData } from "@/lib/posts";
import Head from "next/head";
import Date from "@/components/partial/Date";
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
import SectionBlock from "@/components/partial/SectionBlock";
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import rehypeSlug from 'rehype-slug'
import GithubSlugger, {slug} from 'github-slugger'
import rehypePrism from 'rehype-prism-plus'
import { NextSeo } from "next-seo";
import SEO from "next-seo.config";
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
        <Code >
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
    //很多行
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
          {hasCopied ? "Copied!" : match![1]}
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
  const all_markdonw = postData.tocMarkdown.content+"\n"+postData.markdownContent
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
  //console.log(mdxSource)
  return (
    <BlogLayout>
      <NextSeo
        title={postData.title}
        {...SEO}
      />
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        
        <SectionBlock mt={2}>{postData.title}</SectionBlock>
        <Box>
          <Date dateString={postData.date} />
        </Box>
         {/*Tags*/}
         <Box mt={2} mb={2}>
          {postData.tag.map((t: string, i: number) => (
            <Link key={i} onClick={() => router.push(`/next-blog?tag=${t}`)}>
              <Tag mr={2}>#{t}</Tag>
            </Link>
          ))}
        </Box>
        <Divider />
        
       
        {/*正文*/}
        <MDXRemote {...mdxSource} components={components} />
      
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
       

        <Link onClick={() => router.push("/next-blog")}>👈Go Back</Link>
      </article>
    </BlogLayout>
  );
}
