import {Box,Image,useDisclosure,Link, Text, Container, Tooltip, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Heading, AspectRatio} from '@chakra-ui/react'
import NextImage from "next/legacy/image";
import NextLink from 'next/link';
const Profile = ({ portfolio }: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (

        <Container maxW='full' centerContent mt="5">
        <button onClick={onOpen}>
          <Tooltip label='say hi!'>
          <AspectRatio minW="300" ratio={1}>
          <Box position='relative' bottom={1} >
            <NextImage src='/image/me.jpeg' alt='My Picture' layout='fill' style={{ borderRadius: '100%' }} />
          </Box>
          </AspectRatio>
            {/*
            
            <Image borderRadius='full' src="image/me.jpeg" alt="me" width="300" height="300" />
           
            */}
          </Tooltip>
        </button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(5px) ' />
          <ModalContent>
            <ModalHeader>Hello!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {portfolio.introduction}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Heading>Alan Tseng</Heading>
        <Text fontSize='xl'>
          {portfolio.social_links.map((social: any, i: number) => (
            <Link as={NextLink} key={i} color='blue.500' href={social.link}>
              {social.name} {(i + 1 < portfolio.social_links.length) ? " | " : ""}
            </Link>
          ))}
        </Text>
        <Text fontSize='sm'>{portfolio.quote}</Text>
      </Container>
    )
}
export default Profile;
