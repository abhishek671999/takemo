let host = null
let window = null
let pathName = null
let version = 'v4'
self.addEventListener('install', event => {
    console.log('Custom Service Worker installed ' + version, event);
    //self.skipWaiting();
  });
  
self.addEventListener('activate', event => {
  console.log('Custom Service Worker activated' + version);
  event.waitUntil(self.clients.claim());
});


// self.addEventListener('fetch', event => {
//   console.log('Fetch event triggered:: ', event.request.url, host);

//   let cacheURLs = ['/api/v1/inventory/get_admin_menu/', '/api/v1/inventory/get_pos_menu/', '/api/v1/inventory/get_restaurant_counters/', '/api/v1/users/me/'];
//   const url = new URL(event.request.url);

//   if (url.hostname === host && event.request.method == "GET") {
//     event.respondWith(
//       fetch(event.request)
//         .then(response => {
//           if (response && response.status === 200 && cacheURLs.includes(url.pathname)) {
//             const cacheName = getCacheName();  
//             console.log(`${event.request.url} - Response status: ${response.status} - Caching it`);
//             const clonedResponse = response.clone();
//             caches.open(cacheName).then((cache) => {
//               cache.put(event.request, clonedResponse);
//             });
//             return response;
//           } 
//           return response; 
//         })
//         .catch(error => {
//           console.error('Fetch failed, looking for cache:', error);
//           const cacheName = getCacheName(); 

//           return caches.open(cacheName).then((cache) => {
//             return cache.match(event.request).then((cachedResponse) => {
//               if (cachedResponse) {
//                 debugger
//                 console.log('Serving from cache:', event.request.url);
//                 if(event.request.url == '/api/v1/order/create_order/' ){
//                   const clonResponse = response.clone()
//                   clonResponse.json().then((data) => {
//                     localStorage.setItem('order_no', data['order_no'] + localStorage.getItem('order_no') || 0)
//                     data.order_no  = localStorage.getItem('order_no') 
//                     return new Response(data)
//                   })
//                   return response
//               }
//                 return cachedResponse;
//               }

//               if (url.pathname !== '/owner/point-of-sale') {
//                 self.clients.matchAll().then(clients => {
//                   clients.forEach(client => {
//                     client.postMessage({ type: 'redirection', url: './owner/point-of-sale' });
//                   });
//                 });
//               }
//               // Return a fallback response or empty response if no cache
//               return new Response('Network error, and no cache available', { status: 503 });
//             });
//           });
//         })
//     );
//   } else {
//     // If the request is not for the same host, proceed with normal network request
//     console.log('Request not for specified host, fetching normally');
//     event.respondWith(fetch(event.request));
//   }
// });

self.addEventListener('message', (event) => {
    console.log('message event:', event)
    host = event.data.host
    pathName = event.data.pathName
})
  
function getCacheName(){
  return `cache-${version}`
}