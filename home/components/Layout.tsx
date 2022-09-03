
import { Stack, HStack, VStack } from '@chakra-ui/react'
import { Heading, Container, Box } from '@chakra-ui/react'
import { Center, Square, Circle } from '@chakra-ui/react'
type AppProps = {
    children?: React.ReactNode;
};
const Layout = ({ children }: AppProps) => {
    return (
        <Container maxW="full">
           
            <Stack direction={{ base: 'column', md: 'row' }} spacing='24px'>
                {children}
            </Stack>

            <Center>
                <p>@alanhc</p>
            </Center>
        </Container>

    )
}
export default Layout;