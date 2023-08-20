
import { Stack, HStack, VStack, Divider, Container, Center } from '@chakra-ui/react'

type AppProps = {
    children?: React.ReactNode;
};
const Layout = ({ children }: AppProps) => {
    return (
        <Container minW="full" >
           
                {children}
          
            <Center mt="10">
                <p>@alanhc</p>
            </Center>
        </Container>

    )
}
export default Layout;