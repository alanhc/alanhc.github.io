
import { Stack, HStack, VStack } from '@chakra-ui/react'
import { Heading, Container, Box } from '@chakra-ui/react'
import { Center, Square, Circle } from '@chakra-ui/react'
type AppProps = {
    children?: React.ReactNode;
};
const Layout = ({ children }: AppProps) => {
    return (
        <Container maxW="full" >
           
                {children}
            
            <Center>
                <p>@alanhc</p>
            </Center>
        </Container>

    )
}
export default Layout;