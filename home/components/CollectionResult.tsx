import { Container, SimpleGrid, Box } from "@chakra-ui/react";
import { Image, Badge, VStack, HStack, Tag, TagLabel, TagCloseButton, Button } from "@chakra-ui/react";
const CollectionResult = ({ projects }: any) => {
    //console.log("---", projects[0])
    const tags = ["tadA"]
    let result = [
        {
            title: "title_A",
            image: "https://alanhc.github.io/favicon_io/apple-touch-icon.png"
        }
    ]
    return (
        <Container>
            <VStack spacing="24px">

                <HStack spacing={4}>
                    {tags.map((tag) => (
                        <Tag key={tag} borderRadius="full" variant="solid">
                            <TagLabel>{tag}</TagLabel>
                            <TagCloseButton />
                        </Tag>
                    ))}
                </HStack>
                <SimpleGrid columns={[2, 3]} spacing="40px">
                    {projects
                        .map((metadata: any) => (
                            <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' key={metadata.title}>
                                <Image src={metadata.image} alt={metadata.image} />
                                <Box p="6">
                                    <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
                                        {metadata.title}
                                    </Box>

                                    <Box display="flex" alignItems="baseline">
                                        {metadata.tags.map((tag: string) => (
                                            <Badge key={tag} borderRadius="full" px="2" colorScheme="teal">
                                                {tag}
                                            </Badge>
                                        ))}

                                    </Box>


                                    <Box>
                                        {metadata.formattedPrice}
                                        <Box as="span" color="gray" fontSize="sm">
                                            JS
                                        </Box>
                                    </Box>
                                </Box>

                            </Box>
                        ))}

                </SimpleGrid>

            </VStack>
        </Container>
    )
}
/*
<Box key={metadata.title} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                            <Image src={metadata.image} alt={metadata.image} />
                            <Box p='6'>
                                <Box display='flex' alignItems='baseline'>
                                    <Badge borderRadius='full' px='2' colorScheme='teal'>
                                        New
                                    </Badge>
                                </Box>
                            </Box>
                        </Box>
*/

export default CollectionResult;