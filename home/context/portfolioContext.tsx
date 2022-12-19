import { createContext, Context, useState, FC, useEffect } from "react";
import React, { ReactNode } from "react";
import portfolio from "../public/api/portfolio.json"
export interface ITags {
  tags: string[];
  saveTag: (e: string[])=> void;
}
interface Props {
    children?: ReactNode
    // any props that come into the component
}
export const TagContext = createContext<ITags | null>(null);

const TagProvider = ({ children }: Props) => {
  let _tags:string[] = [];
  const [tags, setTags] = useState<string[]>(_tags);
  useEffect(()=>{
const init = async()=>{
    // TODO 確認邏輯
    const pre_tags = await portfolio.search_groups.map(async (group:any,i:number)=>{
      //_tags.concat(new Array(group.options))
      if (group.title==="tag") return ["select"]
      const _ =  await _tags.concat(group.options)
      return _ 
      
    })
    _tags = await(await Promise.all(pre_tags)).flat()
    setTags(_tags)
   
  }
  init();
  },[])
  
  const saveTag = (value:string[]) => {
    setTags(value);
  };
  return <TagContext.Provider value={{ tags, saveTag }}>{children}</TagContext.Provider>;
};

export default TagProvider;