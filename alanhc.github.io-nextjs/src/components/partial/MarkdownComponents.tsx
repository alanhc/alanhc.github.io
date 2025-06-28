import SectionBlock from "@/components/partial/SectionBlock";
import NextLink from "next/link";
import { UnorderedList, ListItem, OrderedList, Link,Text, Code } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
export const components = {
    h1: ({ node, ...props }: any) => (
      <SectionBlock as="h1" size="xl" {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <SectionBlock as="h2" size="lg" {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <SectionBlock as="h3" size="md" {...props} />
    ),
    h4: ({ node, ...props }: any) => (
      <SectionBlock as="h4" size="sm" {...props} />
    ),
    h5: ({ node, ...props }: any) => (
      <SectionBlock as="h5" size="xs" {...props} />
    ),
    a: ({ node, children, ...props }: any) => <Link as={NextLink} {...props} isExternal>{children}<ExternalLinkIcon mx='2px' /></Link>,
    ul: ({ node, ...props }: any) => <UnorderedList {...props} />,
    li: ({ node, ...props }: any) => <ListItem {...props} />,
    ol: ({ node, ...props }: any) => <OrderedList {...props} />,
    code:({ node, ...props }: any) => <Code colorScheme="twitter" variant="outline"  {...props} />,
  };