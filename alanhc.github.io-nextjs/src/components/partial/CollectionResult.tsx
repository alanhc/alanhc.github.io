import {
    Container,
    SimpleGrid,
    Box,
    Flex,
    TabList,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
} from "@chakra-ui/react";
import {
    Image,
    Badge,
    Stack,
    VStack,
    HStack,
    Tag,
    TagLabel,
    TagCloseButton,
    Button,
} from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { TagContext, ITags } from "../../context/portfolioContext";
import NextImage from "next/legacy/image";
import Project from "./Project";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import Link from "next/link";

const columnHelper = createColumnHelper<any>();

const columns = [
    columnHelper.accessor("id", {
        cell: (info) => <Link href={`/projects/${info.getValue()}`}>link</Link>,
        header: "link"
    }),
    columnHelper.accessor("title", {
        cell: (info) => info.getValue(),
        header: "Project Name"
    }),
   
    columnHelper.accessor("tags", {
        cell: (info) => info.getValue().join(", "),
        header: "Tags"
    }),
    columnHelper.accessor("tech", {
        cell: (info) => info.getValue().join(", "),
        header: "Technologies"
    }),
    // columnHelper.accessor("description", {
    //     cell: (info) => info.getValue(),
    //     header: "Description"
    // }),
    
];

const CollectionResult = ({ projects, mdxSource }: any) => {
    const tagContext = useContext(TagContext);
    let tags = tagContext?.tags === undefined ? [] : tagContext.tags;
    const saveTag = tagContext?.setTags;

    const handleClose = (value: string) => {
        var filteredArray = tags.filter(function (e) {
            return e !== value;
        });
        if (saveTag) saveTag(filteredArray);
    };
    const handle_remove = (e: any) => {
        e.preventDefault();
        if (saveTag) saveTag([]);
    };
    function myFilter(value: any) {
        return (
            value.tags.some((x: string) => tags?.includes(x)) &&
            value.tech.some((x: string) => tags?.includes(x))
        );
    }
    console.log(projects);
    return (
        <Flex minW={{ base: "auto", md: "container.md" }} ml="10">
            <VStack spacing="24px">
                <HStack spacing={4} minW={300}>
                    <Container minW={{ base: "250", md: "container.md" }}>
                        {tags.sort().map((tag: string) => (
                            <Tag
                                ml="-1"
                                mr="4"
                                mt="1"
                                key={tag}
                                borderRadius="full"
                                variant="solid"
                                bg="gray.500"
                            >
                                <TagLabel>{tag}</TagLabel>
                                <TagCloseButton onClick={(e: any) => handleClose(tag)} />
                            </Tag>
                        ))}
                    </Container>
                    <Button onClick={handle_remove}>remove all</Button>
                </HStack>
                <Tabs variant="soft-rounded" colorScheme="green">
                    <TabList justifyContent="center">
                        <Tab>Grid</Tab>
                        <Tab>Table</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <SimpleGrid columns={{ base: 1, md: 3 }} spacing="30px">
                                {projects.filter(myFilter).map((metadata: any, i: number) => (
                                    <Project metadata={metadata} key={i} />
                                ))}
                            </SimpleGrid>
                        </TabPanel>
                        <TabPanel>
                            
                            <DataTable columns={columns} data={projects.filter(myFilter)} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </VStack>
        </Flex>
    );
};

export default CollectionResult;
