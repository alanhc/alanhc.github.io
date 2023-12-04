import { Feed } from "feed";
import { writeFileSync } from "fs";
import { getSortedPostsData } from "./posts"

export default async function generateRSS() {
    const feed = new Feed({
        title: "Alan Tseng",
        description: "This is my personal feed!",
        id: process.env.baseUrl,
        link: process.env.baseUrl,
        //language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        image: `${process.env.baseUrl}/image/me.jpeg`,
        favicon: `${process.env.baseUrl}/favicon.ico`,
        copyright: `All rights reserved ${new Date().getFullYear()}, alanhc`,
        //updated: new Date(2013, 6, 14), // optional, default = today
        generator: "awesome", // optional, default = 'Feed for Node.js'
        feedLinks: {
            json: `${process.env.baseUrl}/json`,
            atom: `${process.env.baseUrl}/atom`
        },
        author: {
            name: "alanhc",
            email: "alanhc.tseng1999@gmail.com",
            link: `${process.env.baseUrl}`
        }
    });
    const Blog_URL = `${process.env.baseUrl}/logA/posts`
    const posts = await getSortedPostsData()
    posts.forEach((post) => {
        
        if (post.date) {
            feed.addItem({
                title: post.title,
                id: post.id,
                link: `${Blog_URL}/${post.id}`,
                description: post.content.slice(0,250),
                //content: post.content,
                author: [{ name: "alanhc", email: "alanhc.tseng1999@gmail.com", link: process.env.baseUrl }],
                date: new Date(post.date),
                //image: ""
            })
            
            writeFileSync("./public/feed.xml", feed.rss2());
            writeFileSync("./public/atom.xml", feed.atom1());
            writeFileSync("./public/feed.json", feed.json1());
        }
        
    })
}