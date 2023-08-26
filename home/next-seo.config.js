export default {
    titleTemplate: `%s | ${process.env.config.titleShort}`,
    defaultTitle: process.env.config.title,
    canonical: process.env.config.fdqn,
    openGraph: {
        type: process.env.config.title,
        url: process.env.config.fdqn,
        siteName: process.env.config.title,
    },
    twitter: {
        handle: process.env.config.social.twitterID,
        site: process.env.config.social.twitterID,
        cardType: 'summary_large_image',
    },
    additionalLinkTags: [
        { rel: 'icon', href: process.env.config.image.logo },
        { rel: "alternate", type: "application/rss+xml",href: "/feed.xml"},
        { rel: "alternate", type: "application/atom+xml", href: "/atom.xml"},
    ]

};