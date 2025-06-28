import Layout from "@/components/Layout";
import { NextPage } from "next";
import Link from "next/link";
import { Text } from "@chakra-ui/react";
import BlogLayout from "@/components/BlogLayout";
const About: NextPage = ({ mdxSource, tocSource }: any) => {
  return (
    <BlogLayout>
    <Text>
        This also available at{" "}
        <Link href="https://alanhc.github.io/blog/" target="_blank" rel="noopener noreferrer">
            https://alanhc.github.io/blog/
        </Link>
    </Text>
     <iframe
        src="https://alanhc.github.io/blog/"
        style={{ width: "100%", height: "100vh", border: "none" }}
        title="alanhc's blog"
      ></iframe>
    </BlogLayout>
  );
};
export default About;
