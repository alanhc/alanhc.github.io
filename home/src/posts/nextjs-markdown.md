---
title: "統整markdown的使用方法"
date: "2023-08-26"
tag: ["nextjs"]
---

## 資料在本地
### 使用unified
```js
export async function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, "");

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);
      const htmlContent = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        //.use(rehypeDocument, {title: '👋🌍'})
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(matterResult.content);
      return {
        id,
        ...matterResult.data,
        content: String(htmlContent),
        markdownContent: matterResult.content,
      };
    })
  );
  // Sort posts by date
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}
```

## 資料在雲端
### 使用 MDX
```js
export async function getStaticProps({ params }: any) {
  const postData = await getPostData(params.id);
  const all_markdonw = postData.tocMarkdown.content+"\n"+postData.postMarkdown
  const mdxSource = await serialize(all_markdonw,
    {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeRaw],
        format: 'mdx',
      }
    }
  )
  return {
    props: {
      postData,
      mdxSource: mdxSource
    },
  };
}
```
render
```jsx
 <MDXRemote {...mdxSource} components={components} />
```
