let host = null
let window = null
let pathName = null
let version = 'v6'
self.addEventListener('install', event => {
    console.log('Custom Service Worker installed ' + version, event);
    //self.skipWaiting();
  });
  
self.addEventListener('activate', event => {
  console.log('Custom Service Worker activated' + version);
  event.waitUntil(self.clients.claim());
});
  
self.addEventListener('fetch', event => { 
    console.log('Fetch event triggered:: ', host, event)
    let cacheURLs = ['/api/v1/inventory/get_admin_menu/', '/api/v1/inventory/get_pos_menu/']
    const url = new URL(event.request.url);
    if (url.hostname === host) {
      event.respondWith(
        fetch(event.request)
          .then(response => {          
            if(cacheURLs.includes(url.pathname)){
              let cacheName = getCacheName()
                if (response && response.status === 200) {
                  console.log(event.request.url, 'cached')
                  const clonedResponse = response.clone();
                  caches.open(cacheName).then((cache) => {
                    cache.put(event.request, clonedResponse); // Cache the network response
                  });
                }
              }
            return response;
          })
          .catch(error => {            
            console.log('This is error: ',error, pathName)
            if(pathName != '/owner/point-of-sale'){
              self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                  client.postMessage({ type: 'redirection', url: './owner/point-of-sale' });
                });
              })
            } else{
              caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                  return cachedResponse;
                }},
              (error) => {
                console.log(error)
              })
            }
            // Fallback to cache if network fails
          })
      );
    } else {
      console.log('In else block')
      event.respondWith(fetch(event.request));
    }
  });

self.addEventListener('message', (event) => {
    console.log('message event:', event)
    host = event.data.host
    pathName = event.data.pathName
})
  
function getCacheName(){
  return `cache-${version}`
}