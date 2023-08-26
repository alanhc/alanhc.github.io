import {
  Link,
  Stack,
  HStack,
  VStack,
  Divider,
  Container,
  Center,
  Heading,
  Button,
  useColorMode,
  Box,
  Spacer,
  Flex,
} from "@chakra-ui/react";
import NextLink from "next/link";
type AppProps = {
  children?: React.ReactNode;
};
const BlogLayout = ({ children }: AppProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigation = [{ "🏠": "/" }, { "🗒️": "/next-blog" }, { "🔗": "/link" }];

  return (
    <Container className="ck-reset">
      <Flex>
        <Heading>
          {navigation.map((l: object, index: number) => (
            <Link key={index} as={NextLink} href={Object.values(l)[0]}>
              {Object.keys(l)} {index !== navigation.length - 1 && " · "}
            </Link>
          ))}

         
        </Heading>
        <Spacer />
        <Button onClick={toggleColorMode} mr={0}>
          {colorMode === "light" ? "☾" : "☀️"}
        </Button>
      </Flex>
      {children}
      <Center mt="10">
        <p>@alanhc</p>
      </Center>
    </Container>
  );
};
export default BlogLayout;
