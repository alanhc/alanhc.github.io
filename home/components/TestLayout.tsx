
import { Stack, HStack, VStack, Divider } from '@chakra-ui/react'
import { Heading, Container, Box } from '@chakra-ui/react'
import { Center, Square, Circle } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'
type AppProps = {
    children?: React.ReactNode;
};
const TestLayout = ({ children }: AppProps) => {
    return (

        <Grid
            templateAreas={`"header header"
                        "nav main"
                        "nav footer"`}
            gridTemplateRows={'50px 1fr 30px'}
            gridTemplateColumns={'150px 1fr'}
            h='200px'
            gap='1'
            color='blackAlpha.700'
            fontWeight='bold'
        >
            <GridItem pl='2' bg='orange.300' area={'header'}>
                Header
            </GridItem>
            <GridItem pl='2' bg='pink.300' area={'nav'}>
                Nav
            </GridItem>
            <GridItem pl='2'  area={'main'}>
                {children}
            </GridItem>
            <GridItem pl='2' bg='blue.300' area={'footer'}>
                <Center mt="10">
                    <p>@alanhc</p>
                </Center>
            </GridItem>
        </Grid>

    )
}
export default TestLayout;