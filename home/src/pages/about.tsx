import Layout from "@/components/Layout";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import SEO from "../../next-seo.config";
import { promises as fs } from 'fs';
import { join } from 'path';
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'



import { components } from "@/components/partial/MarkdownComponents";
export async function getStaticProps() {
  const file = await fs.readFile(process.cwd() + '/src/files/about.md', 'utf8');
  const mdxSource = await serialize(file)
  return {
    props: {
      mdxSource: mdxSource
    },
  };
}

const About: NextPage = ({ mdxSource }: any) => {

  return (
    <Layout>
      <NextSeo
        title="About"
        description="About alanhc"
        {...SEO}
      />
      <MDXRemote {...mdxSource} components={components} />
    </Layout>
  );
};
export default About;

