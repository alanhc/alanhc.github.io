import Layout from "@/components/Layout";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import SEO from "../../next-seo.config";
import { promises as fs } from "fs";
import { join } from "path";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

import { components } from "@/components/partial/MarkdownComponents";
import { Box, Button, Code, Flex, Link, ListItem, OrderedList, Stack, UnorderedList, useClipboard } from "@chakra-ui/react";
import markdownToc from 'markdown-toc';
import remarkGfm from "remark-gfm";
import SectionBlock from "@/components/partial/SectionBlock";
import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import NextLink from "next/link";
const toc_components = {
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
  ul: ({ node, ...props }: any) => <UnorderedList {...props} />,
  li: ({ node, ...props }: any) => <ListItem {...props} />,
  ol: ({ node, ...props }: any) => <OrderedList {...props} />,
};
export async function getStaticProps() {
  const file = await fs.readFile(process.cwd() + "/src/files/about.md", "utf8");
  
  const mdxSource = await serialize(file);
  const tocMarkdown = await markdownToc(file);
  const tocSource = await serialize(tocMarkdown.content, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [],
          format: "mdx",
        },
      });
  console.log(tocSource);
  return {
    props: {
      mdxSource: mdxSource,
      tocSource: tocSource,
    },
  };
}

const About: NextPage = ({ mdxSource, tocSource }: any) => {
  return (
    <Layout>
      <NextSeo title="About" description="About alanhc" {...SEO} />
      {/* {JSON.stringify(tocSource)}  */}
      <Stack direction="row" spacing={8}>
        <Stack flex={1} maxW={"fit-content"} position="sticky" top="0">
          {/* {JSON.stringify(tocSource)}  */}
          <MDXRemote {...tocSource} components={toc_components} />
        </Stack>
        <Stack flex={1} >
          {/* {JSON.stringify(toc)} */}
          <MDXRemote {...mdxSource} components={components} />

        </Stack>
      </Stack>
    </Layout>
  );
};
export default About;
