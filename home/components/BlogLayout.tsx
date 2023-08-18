
import { Link, Stack, HStack, VStack, Divider, Container, Center, Heading } from '@chakra-ui/react'
import NextLink from 'next/link';
type AppProps = {
    children?: React.ReactNode;
};
const BlogLayout = ({ children }: AppProps) => {
    const navigation = [
        { "Note": "/next-blog" },
        { "Link": "/link" },
    ]
    return (
        <Container>
            
            <Heading>
                {navigation.map((l:object, index:number) => (
                    <Link key={index}>
                        <NextLink href={Object.values(l)[0]}>
                            <a>
                                {Object.keys(l) }  {index!== navigation.length-1 && " · "}
                            </a>
                        </NextLink>
                    </Link>
                ))}
            </Heading>


            {children}

            <Center mt="10">
                <p>@alanhc</p>
            </Center>
        </Container>

    )
}
export default BlogLayout;