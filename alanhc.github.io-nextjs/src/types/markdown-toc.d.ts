declare module "markdown-toc" {
  interface TocItem {
    content: string;
    slug: string;
    lvl: number;
  }

  interface Toc {
    json: TocItem[];
    content: string;
  }

  function markdownToc(markdown: string): Toc;
  export default markdownToc;
}
