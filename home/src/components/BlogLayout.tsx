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
  useDisclosure,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import BlogNav from "./partial/BlogNav";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { FaLinkedin } from "react-icons/fa";
// import NavLink from "./partial/NavLink"; // Import the NavLink component
type AppProps = {
  children?: React.ReactNode;
};
const NavLink = (props: any) => {
  const { children, link } = props;
  return (
    <Box
      as={NextLink}
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={link}
    >
      {children}
    </Box>
  );
};
const BlogLayout = ({ children }: AppProps) => {
  // Remove the duplicate declaration of colorMode
  const links = [
    { name: "About", link: "/about" },
    { name: "Projects", link: "/projects" },
    { name: "LogA", link: "/logA" },
    { name: "Contract", link: "/about#contact" },
  ];
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box position="sticky"  top="0"  bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Heading as={NextLink} href={"/"}>
              Alan Tseng
            </Heading>
          </HStack>

          <HStack>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {links.map(({ name, link }) => (
                <NavLink link={link} key={link}>
                  {name}
                </NavLink>
              ))}
             
            </HStack>
            <Button as={NextLink} href="https://www.linkedin.com/in/alanhc316/" target="_blank">
            <FaLinkedin />
            </Button>
            <Button onClick={toggleColorMode}>
            
              {colorMode === "light" ? "☾" : "☀️"}
            </Button>
            
          </HStack>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {links.map(({ name, link }) => (
                <NavLink link={link} key={link}>
                  {name}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
      <Container maxW="7xl" p="5" className="ck-reset">
        <Flex className="ck-reset">
          <BlogNav />
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
    </>
  );
};
export default BlogLayout;
