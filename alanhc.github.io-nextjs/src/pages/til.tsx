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
        <Link href="https://hackmd.io/@alanhc/til/" target="_blank" rel="noopener noreferrer">
            hhttps://hackmd.io/@alanhc/til/
        </Link>
    </Text>
     <iframe
        src="https://hackmd.io/@alanhc/til"
        style={{ width: "100%", height: "100vh", border: "none" }}
        title="alanhc's Today I Learned (TIL)"
      ></iframe>
    </BlogLayout>
  );
};
export default About;
