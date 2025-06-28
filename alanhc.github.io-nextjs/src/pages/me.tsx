
import { Text, Flex, Button, Container, SimpleGrid, VStack, Wrap, WrapItem, Center, Box, AspectRatio, useColorMode } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Profile from '../components/partial/Profile'
import NextImage from "next/legacy/image";
import { useRouter } from 'next/router'
import { NotionRenderer } from 'react-notion-x'
import 'react-notion-x/src/styles.css'
import { NotionAPI } from 'notion-client'
import { NotionPage } from "@/components/NotionPage";
import { useEffect } from 'react';
import {Link} from '@chakra-ui/react'
const Me: NextPage = ({ links, recordMap }: any) => {
    const router = useRouter()
    const handle_click = (link: string) => {
        router.push(link)
    }
    const { colorMode, toggleColorMode } = useColorMode()
   
    // useEffect(() => {
    //     window.location.assign('https://hackmd.io/@alanhc/me')
    // })
    return (
        <>
            <Container mt={5} mb="5" centerContent>
                <AspectRatio minW={100} minH={100} ratio={1}>
                    <Box position='relative' bottom={1} >
                        <NextImage src='/image/me.jpeg' alt='My Picture' layout='fill' style={{ borderRadius: '100%' }} />
                    </Box>

                </AspectRatio>
                <Text>Alan</Text>
                <iframe width="100%" height="1000" src="https://hackmd.io/@alanhc/me" frameBorder="0"></iframe>
            </Container>
        </>
    )
}
export async function getStaticProps() {
    const links = [
        { "name": "🙋🏻‍♂️Personal site", "link": "https://alanhc.github.io/" },
        { "name": "🖋Medium", "link": "https://medium.com/@alanhc" },
        { "name": "🎧Spotify", "link": "https://open.spotify.com/user/31rxytmoedznvqlxxeidew7abvpm" },
        { "name": "💡facebook", "link": "https://www.facebook.com/alanhc316/" },
        { "name": "🌄 instagram", "link": "https://www.instagram.com/alanhc.316" },
        { "name": "▶️Youtube", "link": "https://www.youtube.com/channel/UC_0avYAYhKmHqQsoFzxEzhw" },
        { "name": "Google Dev", "link": "https://g.dev/alanhc" },
        { "name": "Tezos NFT", "link": "https://objkt.com/profile/alanhc/owned" },

    ]
    const notion = new NotionAPI()
    const pageId = 'Alan-Tseng-5f7264b563bd4a9d82024f39b5173dda'
    let recordMap = await notion.getPage(pageId)
    return {
        props: {
            links, recordMap
        },
    }
}
export default Me