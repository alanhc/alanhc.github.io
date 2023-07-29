import BlogLayout from "../../../components/BlogLayout";
import { getAllPostIds, getPostData } from '../../../lib/posts';
import Head from 'next/head';
import Date from '../../../components/Date';
import utilStyles from '../../styles/utils.module.css';
import { Container, Heading, Link } from "@chakra-ui/react";

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
        <Heading>{postData.title}</Heading>
        <div >
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        <Link>
          <a href="javascript:history.back()">👈Go Back</a>
        </Link>
      </article>
    </Container>
  );
}