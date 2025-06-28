import { useRef,createContext, Context, useState, FC, useMemo, useEffect } from "react";
import React, { ReactNode } from "react";
import t from "@/config/tags.json";
import portfolio from "../../public/api/portfolio.json";


export interface ITags {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TagContext = React.createContext<ITags|null>(null);

const TagProvider = ({children}: { children: React.ReactNode }) => {
  const [tags, setTags] = useState(["select"]);
  const init_tags = async ()=>{
    let pre_tags:any = (await t).tags
    console.log(pre_tags)
 
    pre_tags.push("select")
    pre_tags = Array.from(new Set(pre_tags));
    setTags(pre_tags)
  }
  useEffect(()=>{
    init_tags()
  },[]);

  return (
    <TagContext.Provider value={{tags, setTags}}>
      {children}
    </TagContext.Provider>
  );
};
export default TagProvider;
