import { Button, Flex, Heading, Link, Spacer, useColorMode } from "@chakra-ui/react";
import NextLink from "next/link";
export default function BlogNav({  }:any) {
  const navigation = [{ "🏠": "/" }, { "🗒️": "/next-blog" }, { "🔗": "/link" }];
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex className="ck-reset">
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
  )
}