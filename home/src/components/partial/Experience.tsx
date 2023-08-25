import { Stack, Heading, Card, CardHeader, CardBody, CardFooter, Text, Flex } from "@chakra-ui/react";
import { parseISO, format } from 'date-fns';
const Experience = ({ experience }: any) => {

    
    return (
        <Stack direction={{ base: 'column', md: 'row' }} >

            {
                experience.map((exp: any, i:number) => (

                    <Card maxW='full' key={i} variant="unstyled">
                        <CardBody>
                            <Stack mt='6' spacing='3'>
                                <Heading size='xl' color='blue.500'>{Object.keys(exp)[0]}</Heading>


                                {exp[Object.keys(exp)[0]].map((content:any, i:number) => (
                                    <Card key={i} maxW='sm' variant="unstyled">
                                        <CardHeader >
                                            <Text fontSize='lg' as='b'> {content.first} </Text>
                                            - {content.second}
                                            
                                        </CardHeader>
                                        <Text  as='b' color='gray.500' fontSize='xs'>
                                            {content.time.from} {(content.time.to) && "-"}  {content.time.to}
                                          
                                        </Text>
                                        <Text color='gray.500' fontSize='sm'>
                                            {content.description}
                                        </Text>
                                    </Card>
                                ))}




                            </Stack>
                        </CardBody>

                    </Card>

                ))
            }
        </Stack>


    )
}


export default Experience;