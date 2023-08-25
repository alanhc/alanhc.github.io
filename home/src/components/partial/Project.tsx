import { Box, Badge, useDisclosure, Button, VStack, HStack, AspectRatio } from "@chakra-ui/react";
import NextImage from "next/legacy/image"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, Flex
} from '@chakra-ui/react'
import { useState } from "react";
import YouTube from "react-youtube";
import { Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
const Project = ({ metadata }: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const opts = {

        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };
    return (
        <>
            <button key={metadata.title} onClick={onOpen}>
                <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'  >
                    <NextImage width="600" height="500" layout="responsive" src={(metadata.image) ? `/${metadata.image}` : "/image/github.png"} alt={metadata.image} />
                    <Box p="6" >
                        <Box display="flex" mt="1" fontWeight="semibold" as="h3" lineHeight="tight" >
                            {metadata.title}
                        </Box>
                        <Box display="flex" alignItems="baseline"  >
                            {metadata.tags.map((tag: string) => (
                                tag !== "select" && <Badge key={tag} borderRadius="full" px="2" ml="0.5" colorScheme="gray">
                                    {tag}
                                </Badge>
                            ))}
                        </Box>
                        <Box display="flex" mt="1">
                            {metadata.formattedPrice}
                            {metadata.language.slice(0, 3).map((lan: string) => (
                                <Box key={lan} as="span" color="gray" fontSize="sm">
                                    {lan} &nbsp;
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>

            </button>
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(10px)' />
                <ModalContent>
                    <ModalHeader>{metadata.modal.title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        {metadata.modal.video &&
                            <AspectRatio ratio={4 / 3}>
                                <YouTube
                                    videoId={metadata.modal.video}
                                    opts={opts}
                                />
                            </AspectRatio>

                        }
                        {metadata.modal.screenshot?.map((img: string, i: number) => (
                           
                                <NextImage key={i} width="400" height="300" layout="responsive" src={img} alt={img} />
                    
                        ))}

                        {metadata.modal.description}

                        <Flex>
                            {metadata.modal.demo && <Link href={metadata.modal.demo} ml="2" isExternal>
                                demo <ExternalLinkIcon mx='2px' />
                            </Link>}
                            {metadata.modal.github && <Link href={metadata.modal.github} ml="2" isExternal>
                                github <ExternalLinkIcon mx='2px' />
                            </Link>}
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>

    )
}
export default Project;
