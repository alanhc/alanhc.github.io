import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'
import { remark } from 'remark';
import html from 'remark-html';
import markdownToc from 'markdown-toc';
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { reporter } from 'vfile-reporter'
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import moment from "moment"
import remarkSlug from 'remark-slug'
import remarkHtml from 'remark-html'
import rehypeSanitize from 'rehype-sanitize'
import rehypeParse from 'rehype-parse'

const postsDirectory = path.join(process.cwd(), 'src/posts');
async function markdownToHtml(markdownContent) {
  const htmlContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(remarkHtml)
    .use(remarkSlug)
    //.use(rehypeDocument, {title: '👋🌍'})
    .use(rehypeFormat)
    .use(rehypeStringify)
    .use(rehypeRaw)
    .use(rehypeParse, {fragment: true})
    .use(rehypeSanitize)
    .use(rehypeDocument, {title: 'Contents'})
    .process(markdownContent)
  return String(htmlContent)
}
export async function getSortedPostsData() {
  // Get file names under /posts
  //const fileNames = fs.readdirSync(postsDirectory);
  let fileNames = await glob(`${postsDirectory}/*.md`)
  fileNames = fileNames.map(f => {
    return f.split("/").pop()
  })

  const allPostsData = await Promise.all(fileNames.map(async (fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    let matterResult = matter(fileContents);
    const htmlContent = await markdownToHtml(matterResult.content);

    matterResult.data.tag = (!matterResult.data.tag) ? matterResult.data.tags : matterResult.data.tag
    if (!matterResult.data.tag) matterResult.data.tag = []
    if ((typeof matterResult.data.date) === "object") {
      matterResult.data.date = moment(String(matterResult.data.date)).format("YYYY-MM-DD");
    }
    if ((typeof matterResult.data.updated) === "object") {
      matterResult.data.updated = moment(String(matterResult.data.updated)).format("YYYY-MM-DD");
    }


    if (id) {
      return {
        id,
        ...matterResult.data,
        content: htmlContent,
        markdownContent: matterResult.content
      };
    }

  }));
  // Sort posts by date
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    };
  });
}
export async function getAllPostIds() {

  let fileNames = await glob(`${postsDirectory}/*.md`)
  fileNames = fileNames.map(f => {
    return f.split("/").pop()
  })
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });



  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]

}

export async function getPostData(id) {

  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
  if (matterResult.data.tag === null) matterResult.data.tag = []
  matterResult.data.tag = (!matterResult.data.tag) ? matterResult.data.tags : matterResult.data.tag
  if ((typeof matterResult.data.date) === "object") {
    matterResult.data.date = await moment(String(matterResult.data.date)).format("YYYY-MM-DD");
  }
  if ((typeof matterResult.data.updated) === "object") {
    matterResult.data.updated = await moment(String(matterResult.data.updated)).format("YYYY-MM-DD");
  }
  const htmlContent = await markdownToHtml(matterResult.content);
  const markdownContent = matterResult.content

  const tocMarkdown = await markdownToc(markdownContent);
  
  return {
    id,
    markdownContent,
    tocMarkdown,
    htmlContent,
    ...matterResult.data,
  };

}