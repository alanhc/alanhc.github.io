
import { Text, Flex, Button, Container, SimpleGrid, VStack, Wrap, WrapItem, Center, Box, AspectRatio } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Profile from '../components/Profile'
import NextImage from "next/legacy/image";
import { useRouter } from 'next/router'

const Me: NextPage = ({ links }: any) => {
    const router = useRouter()
    const handle_click = (link: string) => {
        router.push(link)
    }
    return (
        <>
            <Container>
                <Container mt={5} mb="5"centerContent>
                    <AspectRatio minW={100} minH={100} ratio={1}>
                        <Box position='relative' bottom={1} >
                            <NextImage src='/image/me.jpeg' alt='My Picture' layout='fill' style={{ borderRadius: '100%' }} />
                        </Box>

                    </AspectRatio>
                    <Text>Alan</Text>
                </Container>

                <VStack mt="5">
                    {links.map((link: any, i: number) => (

                        <Button borderRadius='full' key={i} bg='red.300' color='white' px={4} h={8} w="100%"  onClick={(e)=>handle_click(link.link)}>

                            {link.name}

                        </Button>

                    ))}
                </VStack>


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
    //console.log("===", portfolio, typeof portfolio)
    return {
        props: {
            links,
        },
    }
}
export default Me