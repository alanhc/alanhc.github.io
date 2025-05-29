import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
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
  useColorModeValue,
  IconButton,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaLinkedin } from "react-icons/fa";
const NavLink = (props: any) => {
  const { children, link } = props
  return (
    <Box
      as={NextLink}
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={link}>
      {children}
    </Box>
  )
}
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  maxW?: string;
}

const Layout = ({ children, maxW = "12xl" }: LayoutProps) => {
  if (!maxW) maxW = "7xl";
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const links = [
    { name: "About", link: "/about" },
    { name: "Projects", link: "/projects" },
    { name: "LogA", link: "/logA" },
    { name: "Contract", link: "/about#contact" },
  ]

  return (
    <>
      <Box position="sticky"  top="0" zIndex="sticky"  bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Heading as={NextLink} href={"/"}>Alan Tseng</Heading>

          </HStack>

          <HStack>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {links.map(({ name, link }) => (
                <NavLink link={link} key={link}>{name}</NavLink>
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
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
            {links.map(({ name, link }) => (
                <NavLink link={link} key={link}>{name}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
      <Container maxW={maxW} p="12">
        <Box>{children}</Box>
      </Container>
      <Center mt="10">
        <Text>@alanhc</Text>
      </Center>
    </>
  );
};
export default Layout;
