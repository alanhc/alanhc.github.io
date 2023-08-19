import { Container, SimpleGrid, Box, Flex } from "@chakra-ui/react";
import { Image, Badge, Stack, VStack, HStack, Tag, TagLabel, TagCloseButton, Button } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { TagContext, ITags } from "../context/portfolioContext";
import NextImage from "next/legacy/image"
import Project from "./Project";
const CollectionResult = ({ projects, global_state }: any) => {

    const tagContext = useContext(TagContext);
    let tags = (tagContext?.tags === undefined) ? [] : tagContext.tags
    const saveTag = tagContext?.saveTag;
    
    
    const handleClose = (value: string) => {
        var filteredArray = tags.filter(function (e) { return e !== value })
        if (saveTag) saveTag(filteredArray)
    }
    const handle_remove = (e:any) => {
        e.preventDefault()
        if (saveTag) saveTag([])
    }
    function myFilter(value: any) {
        return value.tags.some((x: string) => tags?.includes(x)) && value.language.some((x: string) => tags?.includes(x));
    }
    return (

        <Flex minW={{base:"auto",md:"container.md"}} ml="10">
            <VStack spacing="24px" >
                
                <HStack spacing={4} minW={300}>
                    <Container minW={{base:"250",md:"container.md"}}>
                  
                    {tags.map((tag: string) => (
                        
                        <Tag ml="-1" mr="4" mt="1" key={tag} borderRadius="full" variant="solid" bg="gray.500">
                            <TagLabel>{tag}</TagLabel>
                            <TagCloseButton onClick={(e) => handleClose(tag)} />
                        </Tag>
                    ))}
                   
                
                    </Container>
                    <Button onClick={handle_remove}>remove all</Button>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing="30px">
                    {projects.
                        filter(myFilter).map((metadata: any, i:number) => (
                            <Project metadata={metadata} key={i}/>
                        ))}

                </SimpleGrid>

            </VStack>
        </Flex>
    )
}


export default CollectionResult;