function actualizaCacheDinamico(nombre_cache_dinamico, solicitud, respuesta){
    //Lo solicitado a la web se guarda dentro de la caché dinámica
    if(respuesta.ok){
        console.log(`%c ${nombre_cache_dinamico}`, 'color: red;');
        console.log(respuesta);
        return caches.open(nombre_cache_dinamico).then(cache =>{
            console.log(`%c Caché abierto`, 'color: orange;');
            return cache.put(solicitud, respuesta.clone()).then(()=> {
                console.log(`%c Put`, 'color: red;');
                return respuesta.clone();
            })
        });
    } else{
        return respuesta;
    }
}