self.addEventListener('install', (event) => {
    console.log('install event')
})

self.addEventListener('activate', (event) => {
    console.log('activate event')
})

self.addEventListener('fetch', (event) => {
    console.log('fetch event', event)
})

self.addEventListener('message', (event) => {
    console.log('message event')
})