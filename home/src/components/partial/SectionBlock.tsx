import { useClipboard, Link, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import GithubSlugger, {slug} from 'github-slugger'

export default function SectionBlock({ node, inline, className, children, id, ...props }: any) {
  const router = useRouter()
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';
  const URL = `${origin}${router.asPath}`;
  const _id = slug(String(children))
  const { onCopy, value, setValue, hasCopied } = useClipboard(`${URL}#${_id}`);
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <Link href={`#${_id}`} id={_id} onClick={onCopy} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <Heading  {...props}>
      {isHovering && "#"} {children} 
      </Heading>
    </Link>
  );
}