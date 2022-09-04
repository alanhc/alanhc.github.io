import { Button, Checkbox, VStack, Container, Accordion, AccordionItem, AccordionPanel, AccordionButton, Box, AccordionIcon, Stack } from "@chakra-ui/react";
import { useContext } from "react";
import { TagContext } from "../context/portfolioContext";
import { useOutsideClick } from '@chakra-ui/react'
import { Formik, Field, Form } from "formik";
const LeftCheckBox = ({ search_groups, global_state }: any) => {

  const tagContext = useContext(TagContext);
  const tags = (tagContext?.tags === undefined) ? [] : tagContext.tags
  const saveTag = tagContext?.saveTag;

  function handleChecked(value: string, checked: boolean) {
    
  
    if (saveTag) {
      if (checked) {
        tags.push(value)
        saveTag(tags);
      } else {
        var filteredArray = tags.filter(function (e) { return e !== value })
        
      }
      //
    }
  }
  const onClickSubmit =  (values:any) => {
    if (saveTag) saveTag(values.tags);
  };
  
  return (
    <div>
      <Container>
        <Formik
          initialValues={{
            tags: ["select"],
          }}
          onSubmit={onClickSubmit}
        >
          <Form>
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
                      <Stack pl={1} mt={1} spacing={1}>
                      {group.options.map((option: string) => (
                        <label key={option}>
                        <Field
                          as={Checkbox}
                          name="tags"
                          value={option}
                          defaultChecked={option==="select"}
                        />
                        {option}
                      </label>
                      ))}
                      </Stack>
                 
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
            <Button type="submit">Submit</Button>
          </Form>
        </Formik>
      </Container>
    </div>
  )
}
export default LeftCheckBox;
