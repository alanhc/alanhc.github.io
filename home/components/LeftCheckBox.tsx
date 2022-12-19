import { Flex, Button, Checkbox, VStack, Container, Accordion, AccordionItem, AccordionPanel, AccordionButton, Box, AccordionIcon, Stack } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { TagContext } from "../context/portfolioContext";
import { useOutsideClick } from '@chakra-ui/react'
import { Formik, Field, Form } from "formik";
const LeftCheckBox = ({ search_groups, global_state }: any) => {

  const tagContext = useContext(TagContext);
  const tags = (tagContext?.tags === undefined) ? [] : tagContext.tags
  const saveTag = tagContext?.saveTag;
  

  const handleChecked =  (value: string, checked: boolean) =>{
    
    
      //console.log("===", value, checked)
      if (checked) {
        //let tmp = tags
        var arr = tags.slice()
        arr.push(value)
        if (saveTag) saveTag(arr);
        //console.log(value, checked, tmp)
      } else {
        var filteredArray = tags.filter(function (e) { return e !== value })
        if(saveTag) saveTag(filteredArray)
      }
    
  }
  const onClickSubmit =  (values:any) => {
    if (saveTag) saveTag(values.tags);
  };
  const checkInArray = (value:string, checked:boolean)=>{
    return false
    
  }
  return (
    <div>
      <Flex>
  
        
            <Accordion defaultIndex={[0,1]} allowMultiple>
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
                      {group.options.map((option: string, index:number) => (
                        <label key={option}>
                        <Checkbox
                          isChecked={tags.includes(option)}
                          defaultChecked={option==="select"}
                          onChange={(e:any)=>{handleChecked(option, e.target.checked)}}
                        >
                        {option}
                        </Checkbox>
                      </label>
                      ))}
                      </Stack>
                 
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
            {/*<Button type="submit">Submit</Button>*/}
     
      </Flex>
      </div>
  
  )
}
export default LeftCheckBox;
