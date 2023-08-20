import { useRef,createContext, Context, useState, FC, useMemo, useEffect } from "react";
import React, { ReactNode } from "react";
import portfolio from "../../public/api/portfolio.json";
import {flatten} from "lodash";


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
  const [tags, setTags] = useState<string[]>([]);

  const _tagsRef = useRef<string[]>([]);

  useEffect(() => {
    const init = async () => {
      const pre_tags = await portfolio.projects.map((project: any, i: number) => project.language);
      _tagsRef.current = flatten(pre_tags);
      _tagsRef.current.push("select");
      setTags(_tagsRef.current)
    };
    init();
    console.log(_tagsRef)
  }, []);

  const saveTag = (value: string[]) => {
    setTags(value);
  };

  return <TagContext.Provider value={{ tags, saveTag }}>{children}</TagContext.Provider>;
};

export default TagProvider;
