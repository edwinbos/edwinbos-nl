importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');


workbox.routing.registerRoute(
  '/',
  '/about/',
  '/articles/',
  '/front-end/2017/01/07/best-frontend-and-ux-podcasts.html',
  '/jekyll/update/2016/09/12/front-end-ontwikkeling-in-magento-2-deel-2.html',
  '/jekyll/update/2016/08/30/front-end-ontwikkeling-in-magento-2-deel-1.html',
  workbox.strategies.networkFirst({
    cacheName: 'pages-v1',
  })
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images-v1',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'static-resources-v1',
  }),
);