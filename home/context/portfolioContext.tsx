import { createContext, Context, useState, FC } from "react";
import React, { ReactNode } from "react";
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
  const [tags, setTags] = useState<string[]>(["select"]);
  const saveTag = (value:string[]) => {
    setTags(value);
  };
  return <TagContext.Provider value={{ tags, saveTag }}>{children}</TagContext.Provider>;
};

export default TagProvider;