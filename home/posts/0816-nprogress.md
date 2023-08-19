---
title: '新增page loading的進度條'
date: '2023-08-16'
tag: ["blog"]
---
`pnpm add nprogress`
`pnpm add -D @types/nprogress`

在pages/_app.tsx新增
```js
import 'nprogress/nprogress.css';
import { useRouter } from 'next/router'; import NProgress from 'nprogress'; import { useEffect } from 'react';
```
```js
function MyApp({ Component, pageProps }: AppProps) {
const router = useRouter();
// Integrate nprogress
useEffect(() => {
router.events.on('routeChangeStart', () => NProgress.start());
router.events.on('routeChangeComplete', () => NProgress.done());
router.events.on('routeChangeError', () => NProgress.done());
...

// eslint-disable-next-line react-hooks/exhaustive-deps

}, []);
```
這樣就可以在等待的時候看到藍色進度條了🎉
## ref
- https://www.npmjs.com/package/nprogress
- https://learnjsx.com/category/4/posts/nextjs-nprogress#google_vignette