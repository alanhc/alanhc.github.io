import {useDisclosure,Link, Text, Container, Tooltip, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Heading} from '@chakra-ui/react'
const Profile = ({ portfolio }: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (

        <Container maxW='full' centerContent>
        <button onClick={onOpen}>
          <Tooltip label='say hi!'>
            <Image borderRadius='full' src="image/me.jpeg" alt="me" width="300" height="300" />
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
            <Link key={i} color='blue.500' href={social.link}>
              {social.name} {(i + 1 < portfolio.social_links.length) ? " | " : ""}
            </Link>
          ))}
        </Text>
        <Text fontSize='sm'>{portfolio.quote}</Text>
      </Container>
    )
}
export default Profile;
