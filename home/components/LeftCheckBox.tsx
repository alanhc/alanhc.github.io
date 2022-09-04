import { Checkbox, VStack, Container, Accordion, AccordionItem, AccordionPanel, AccordionButton, Box, AccordionIcon, Stack } from "@chakra-ui/react";

const LeftCheckBox = ({ search_groups }: any) => {
  //console.log("=", search_groups)
  function handleChecked(value:string, checked:boolean) {
    
    console.log("checkbox:",value, checked)
  }
  return (
    <div>
      <Container>
        <Accordion defaultIndex={[0]} allowMultiple>
          {search_groups.map((group: any) => (
            <AccordionItem key={group.title}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {group.title}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                {group.options.map((option: string) => (
                  <Stack pl={1} mt={1} spacing={1} key={option}>
                    <Checkbox defaultChecked={(option==="select")}  key={option} onChange={(e)=>{handleChecked(option, e.target.checked)}}>{option}</Checkbox>
                  </Stack>
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
