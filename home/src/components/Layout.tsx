import {
  Stack,
  HStack,
  VStack,
  Divider,
  Container,
  Center,
  Text,
  Box,
  Button,
  useColorMode,
  Flex,
  Spacer,
} from "@chakra-ui/react";

type AppProps = {
  children?: React.ReactNode;
};
const Layout = ({ children }: AppProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Container className="ck-reset" minW="full">
      <Flex>
      
        
        <Box>{children}</Box>
        <Spacer />
        <Button onClick={toggleColorMode}>
          {colorMode === "light" ? "☾" : "☀️"}
        </Button>
      </Flex>

      <Center mt="10">
        <Text>@alanhc</Text>
      </Center>
    </Container>
  );
};
export default Layout;
