import { Container, SimpleGrid, Box, Flex } from "@chakra-ui/react";
import { Image, Badge, Stack, VStack, HStack, Tag, TagLabel, TagCloseButton, Button } from "@chakra-ui/react";
import { useContext } from "react";
import { TagContext, ITags } from "../context/portfolioContext";
import NextImage from 'next/image'
import Project from "./Project";
const CollectionResult = ({ projects, global_state }: any) => {

    const tagContext = useContext(TagContext);
    let tags = (tagContext?.tags === undefined) ? [] : tagContext.tags
    const saveTag = tagContext?.saveTag;
    const handleClose = (value: string) => {
        var filteredArray = tags.filter(function (e) { return e !== value })
        if (saveTag) saveTag(filteredArray)
    }
    function myFilter(value: any) {
        let arrA = value.tags;
        let arrB = tags;
        return arrA.some((x: string) => arrB?.includes(x));
    }
    return (

        <Flex minW={{base:"auto",md:"container.md"}} ml="10">
            <VStack spacing="24px" >
                <HStack spacing={4}>
                    {tags.map((tag: string) => (
                        <Tag key={tag} borderRadius="full" variant="solid" bg="blue.300">
                            <TagLabel>{tag}</TagLabel>
                            <TagCloseButton onClick={(e) => handleClose(tag)} />
                        </Tag>
                    ))}
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing="40px">
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