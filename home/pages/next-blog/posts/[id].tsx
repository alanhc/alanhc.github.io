import BlogLayout from "../../../components/BlogLayout";
import { getAllPostIds, getPostData } from '../../../lib/posts';
import Head from 'next/head';
import Date from '../../../components/Date';
import utilStyles from '../../styles/utils.module.css';
import { Container, Heading, Link } from "@chakra-ui/react";
import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CSSProperties } from "react";
import remarkGfm from 'remark-gfm'
import ReactMarkdown from "react-markdown";

const components = {
  code: ({ node, inline, className, children, ...props }:any) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={darcula as { [key: string]: CSSProperties }}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
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
        <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
          {postData.contentHtml}
        </ReactMarkdown>
        <Link>
          <a href="javascript:history.back()">👈Go Back</a>
        </Link>
      </article>
    </Container>
  );
}
