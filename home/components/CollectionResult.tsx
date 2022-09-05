import { Container, SimpleGrid, Box, Flex } from "@chakra-ui/react";
import { Image, Badge, VStack, HStack, Tag, TagLabel, TagCloseButton, Button } from "@chakra-ui/react";
import { useContext } from "react";
import { TagContext, ITags } from "../context/portfolioContext";

const CollectionResult = ({ projects, global_state }: any) => {
    const tagContext = useContext(TagContext);
    let tags = (tagContext?.tags === undefined) ? [] : tagContext.tags
    const saveTag = tagContext?.saveTag;
    const handleClose = (value:string)=>{
        var filteredArray = tags.filter(function (e) { return e !== value })
        if(saveTag) saveTag(filteredArray)
    }
    function myFilter(value: any) {
        let arrA = value.tags;
        let arrB = tags;
        return arrA.some((x: string) => arrB?.includes(x));
    }
    return (

        <Container maxW='full'>
            <VStack spacing="24px" >
                <HStack spacing={4}>
                    {tags.map((tag: string) => (
                        <Tag key={tag} borderRadius="full" variant="solid">
                            <TagLabel>{tag}</TagLabel>
                            <TagCloseButton onClick={(e)=>handleClose(tag)}/>
                        </Tag>
                    ))}
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 3}} spacing="40px">
                    {projects.
                        filter(myFilter).map((metadata: any) => (
                            <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' key={metadata.title}>
                                <Image src={metadata.image} alt={metadata.image}  boxSize='250px'/>
                                <Box p="6">
                                    <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
                                        {metadata.title}
                                    </Box>

                                    <Box display="flex" alignItems="baseline">
                                        {metadata.tags.map((tag: string) => (
                                            tag!=="select"&& <Badge key={tag} borderRadius="full" px="2" colorScheme="teal">
                                                {tag}
                                            </Badge>
                                        ))}

                                    </Box>


                                    <Box>
                                        {metadata.formattedPrice}
                                        {metadata.language.map((lan:string)=>(
                                            <Box key={lan} as="span" color="gray" fontSize="sm">
                                                {lan} &nbsp; 
                                            </Box>
                                        ))}
                                        
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