import { createContext, Context, useState, FC, useEffect } from "react";
import React, { ReactNode } from "react";
import portfolio from "../public/api/portfolio.json"

export interface ITags {
  tags: string[];
  saveTag: (e: string[]) => void;
}
interface Props {
  children?: ReactNode
  // any props that come into the component
}
export const TagContext = createContext<ITags | null>(null);

const TagProvider = ({ children }: Props) => {
  let _tags: string[] = [];
  const [tags, setTags] = useState<string[]>(_tags);
  useEffect(() => {
    const init = async () => {
      
      //const pre_tags = await portfolio.search_groups.map(async (group: any, i: number) => {
        const pre_tags = await portfolio.projects.map((project:any,i:number)=>{
         
          return _tags.concat(project.language)
          
        })
        

      _tags = await (await Promise.all(pre_tags)).flat()
      _tags = _tags.filter((v, i, a) => a.indexOf(v) === i); //distinct array
      _tags.push("select")
      
      console.log(_tags)
      setTags(_tags)

    }
    
    init();
  }, [])

  const saveTag = (value: string[]) => {
    setTags(value);
  };
  return <TagContext.Provider value={{ tags, saveTag }}>{children}</TagContext.Provider>;
};

export default TagProvider;