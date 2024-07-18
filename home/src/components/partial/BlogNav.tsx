import {
  Button,
  Flex,
  Heading,
  Link,
  Spacer,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  useColorMode,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { usePathname } from 'next/navigation'
export default function BlogNav({}: any) {
  const navigation = [
    { Posts: "/logA" },
    { Archive: "/archive" },
    { Tags: "/tags" },
  ];
  const { colorMode, toggleColorMode } = useColorMode();
  // get href from object value
  const pathname = usePathname()
  return (
  
     
      <Tabs defaultIndex={navigation.findIndex((item) => Object.values(item)[0] === pathname)} >
        <TabList>
          {navigation.map((k, index) => (
            <Link key={index} as={NextLink} href={Object.values(k)[0]}>
              <Tab key={index}>{Object.keys(k)}</Tab>
            </Link>
          ))}
        </TabList>
      </Tabs>
    
      
  );
}
