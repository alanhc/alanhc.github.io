
const filesDirectory = path.join(process.cwd(), 'src/files');

export async function getFileData(fileName) {
  const fullPath = path.join(filesDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  
  return {
    id,
    markdownContent,
    tocMarkdown,
    htmlContent,
    ...matterResult.data,
  };
}
