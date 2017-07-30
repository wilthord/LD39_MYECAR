// Version de lector de mapas de tiled, adaptada del curso HTML5 Game Development, encontrado en Udacity

MapLoaderClass = function() {

    //Lista de mapas cargados
    this.listaMapas = {};

    this.mapasPorCargar =0;

}


MapLoaderClass.prototype.constructor = MapLoaderClass;

// Descargamos el Json del mapa
MapLoaderClass.prototype.load = function(nombreMapa) {

    xhrGet(nombreMapa, function(data) {
        gMap.parseMapJSON(data.currentTarget.responseText, nombreMapa);
    });
}


// Hacemos el parseo del mapa
MapLoaderClass.prototype.parseMapJSON = function(mapJSON, nombreMapa) {

    if (this.listaMapas[nombreMapa]) {
        return;
    }

    var nuevoMapa = new MapClass();

    nuevoMapa.currMapData = JSON.parse(mapJSON);

    var map = nuevoMapa.currMapData;

    // Width y Height contiene el numero de tiles del mapa
    nuevoMapa.numTiles.x = map.width;
    nuevoMapa.numTiles.y = map.height;

    // Establecemos el tamaño en pixeles de cada tile
    nuevoMapa.tileSize.x = map.tilewidth;
    nuevoMapa.tileSize.y = map.tileheight;

    // Establecemos el tamaño del mapa en pixeles
    nuevoMapa.pixelSize.x = nuevoMapa.numTiles.x * nuevoMapa.tileSize.x;
    nuevoMapa.pixelSize.y = nuevoMapa.numTiles.y * nuevoMapa.tileSize.y;

    // Loop through 'map.tilesets', an Array...
    for (var i = 0; i < map.tilesets.length; i++) {

        // Cargamos todos los tilesets
        var img = new Image();
        img.onload = function() {

            //Aumentamos la cantidad de imagenes cargadas, cuando finaliza la carga
            nuevoMapa.imgLoadCount++;
            if (nuevoMapa.imgLoadCount === map.tilesets.length) {
                // Marcamos el fin de la carga de los tilesets
                nuevoMapa.fullyLoaded = true;
            }
        };

        img.src = map.tilesets[i].image;

        // Objeto de tipo tileset, para almacenar todos los datos
        var ts = {
            "firstgid": nuevoMapa.currMapData.tilesets[i].firstgid,
            "image": img,
            "imageheight": nuevoMapa.currMapData.tilesets[i].imageheight,
            "imagewidth": nuevoMapa.currMapData.tilesets[i].imagewidth,
            "name": nuevoMapa.currMapData.tilesets[i].name,

            // Calculamos el numero de tiles en el tileset, dividiendo el tamanio de la imagen, entre el tamaño en pixeles de cada tile
            "numXTiles": Math.floor(nuevoMapa.currMapData.tilesets[i].imagewidth / nuevoMapa.tileSize.x),
            "numYTiles": Math.floor(nuevoMapa.currMapData.tilesets[i].imageheight / nuevoMapa.tileSize.y)
        };

        // Guardamos el tileset en el arreglo de tilesets cargados
        nuevoMapa.tilesets.push(ts);
    }

    this.objetos = [];

    for (var layerIdx = 0; layerIdx < map.layers.length; layerIdx++) {

        //Solo recorremos las capas de objetos
        if (map.layers[layerIdx].type != "objectgroup") {
            continue;
        }

        for (var j = 0; j < map.layers[layerIdx].objects.length; j++) {
            nuevoMapa.objetos.push(map.layers[layerIdx].objects[j]);
        }

    }

    this.listaMapas[nombreMapa] = nuevoMapa;

    this.mapasPorCargar--;

}

//-----------------------------------------
// Retorna un objeto con la imagen y la posición en pixeles, donde se encuentra el tile buscado


var gMap = new MapLoaderClass();