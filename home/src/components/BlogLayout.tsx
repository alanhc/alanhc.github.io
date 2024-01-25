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
import BlogNav from "./partial/BlogNav";
type AppProps = {
  children?: React.ReactNode;
};
const BlogLayout = ({ children }: AppProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  
  return (
    <>
    <Container maxW="7xl" p="5" className="ck-reset">
      <BlogNav/>
      {children}
      <Center mt="10">
        <p>@alanhc</p>
      </Center>
    </Container>
    </>
  );
};
export default BlogLayout;
