importScripts('/twittor/js/sw-utils.js');
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    '/twittor/',
    '/twittor/index.html',
    '/twittor/css/style.css',
    '/twittor/img/favicon.ico',
    '/twittor/img/avatars/hulk.jpg',
    '/twittor/img/avatars/ironman.jpg',
    '/twittor/img/avatars/spiderman.jpg',
    '/twittor/img/avatars/thor.jpg',
    '/twittor/img/avatars/wolverine.jpg',
    '/twittor/js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    '/twittor/css/animate.css',
    '/twittor/js/libs/jquery.js'
];

self.addEventListener('install', e => {
    const cache_static = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL));
    const cache_inmutable = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE));
    e.waitUntil(Promise.all([cache_static, cache_inmutable]));
});

self.addEventListener('activate', e => {
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if(key !== STATIC_CACHE && key.includes('static')){ //Cuando cambiamos la versión de la caché estática, comprobamos para borrar la versión antigua
                return caches.delete(key);
            }

            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
});

self.addEventListener('fetch', e => {
    const respuesta = caches.match(e.request) //Buscamos en caché primero
        .then(res => {
            if(res) return res;

            //SiNo existe el archivo solicitado
            //Hay que pedirlo a la web
            //debugger;
            return fetch(e.request).then(new_resp => {
                console.log(`%c fetch for request`, 'color: blue;');
                console.log(e.request);
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, new_resp);
            });
        });
    
    e.respondWith(respuesta);
});