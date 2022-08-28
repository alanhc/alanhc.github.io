
import Image from 'next/image'
import { getSortedPostsData } from '../lib/posts';
import Date from '../components/date';
import Link from 'next/link';
import Layout, { siteTitle } from '../components/layout';
//import styles from '../styles/Home.module.css'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
export default function Home({ allPostsData }) {
  return (
    <Layout home>
      
        
        {allPostsData.map(({ id, date, title }) => (
          <li className="" key={id}>
            <Link href={`/posts/${id}`}>
              <a>{title}</a>
            </Link>
            <br />
            <small className="">
              <Date dateString={date} />
            </small>
          </li>
        ))}

     


      <footer className="text-center">
        @alanhc
      </footer>
    </Layout>
  )
}
