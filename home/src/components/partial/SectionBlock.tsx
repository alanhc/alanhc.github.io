import { useClipboard, Link, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SectionBlock({ node, inline, className, children, id, ...props }: any) {
  const router = useRouter()
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';
  const URL = `${origin}${router.asPath}`;
  const { onCopy, value, setValue, hasCopied } = useClipboard(URL + "#" + children);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Link href={`#${children}`} id={children} onClick={onCopy} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <Heading  {...props}>
        {children} {isHovering && "🔗"}
      </Heading>
    </Link>
  );
}