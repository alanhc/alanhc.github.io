import { Checkbox, VStack, Container, Accordion, AccordionItem, AccordionPanel, AccordionButton, Box, AccordionIcon } from "@chakra-ui/react";
const LeftCheckBox = ({ search_groups }: any) => {
    //console.log("=", search_groups)
   
    return (
        <div>
            <Container>
                LeftCheckBox<br />
                <Accordion defaultIndex={[0]}  allowMultiple>
                {search_groups.map((group: any)=>(
                    <AccordionItem >
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          {group.title}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel>
                      {group.options.map((option: string)=>(
                        <Checkbox defaultChecked key={option}>{option}</Checkbox>
                      ))}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
                </Accordion>
            </Container>
        </div>
    )
}
export default LeftCheckBox;
