
import { NextPage } from "next";
import { Container, Divider, Link, ListItem, UnorderedList } from "@chakra-ui/react";
import BlogLayout from "../components/BlogLayout";
import { stringify } from "querystring";
import NextLink from 'next/link';
const LinkPage: NextPage = () => {
    const categories =
    {
        tools: {
            Obsidian: "https://obsidian.md/",
            HackMD: "https://hackmd.io/",
            mdbook: "https://rust-lang.github.io/mdBook/"
        },
        dev: { Github: "https://github.com/" },
        research: {
            Zotero: "https://www.zotero.org/",
            Overleaf: "https://www.overleaf.com/"
        },
        person: {
            ttzeng: "https://ttzeng.github.io/",
            evanlin: "https://evanlin.com/"

        }
    }
    
    return (
        <BlogLayout>
            <UnorderedList>
                {Object.entries(categories).map(([key, value]) => (
                    <ListItem key={key}>
                        {key}
                        <br />
                        {Object.entries(value).map(([key, value]) => (
                          
                                <Link as={NextLink} key={key} href={value}  >

                                  {key} {" "}

                                </Link>
                        
                        ))}

                    </ListItem>
                ))}
            </UnorderedList>
        </BlogLayout>
    );
}
export default LinkPage;