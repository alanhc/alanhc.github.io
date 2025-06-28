
import fs from 'fs';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'
import matter from 'gray-matter';

export async function getFolderMarkdownData(name) {
    let fileNames = await glob(`src/${name}/*.md`)
    
    fileNames = fileNames.map(f => {
        return f.split("/").pop()
    })
    
    const projects_data = await Promise.all(fileNames.map(async (fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = `src/${name}/${id}.md`
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        let matterResult = matter(fileContents)

        return {
            id,
            ...matterResult.data,
            content: matterResult.content
        }
    }))
   

    return projects_data
}
export async function getMarkdownData(folder, fileName) {
    let fileNames = await glob(`src/${folder}/${fileName}.md`)
    
    fileNames = fileNames.map(f => {
        return f.split("/").pop()
    })
    
    const projects_data = await Promise.all(fileNames.map(async (fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = `src/${folder}/${id}.md`
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        let matterResult = matter(fileContents)

        return {
            id,
            ...matterResult.data,
            content: matterResult.content
        }
    }))
   

    return projects_data
}