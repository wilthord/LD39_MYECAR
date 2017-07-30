MapClass = function() {
    // Mapa actual, Json parseado
    this.currMapData = null;

    // Todos los tilesets que hacen parte del mapa actual
    this.tilesets = [];

    // Valores por defecto, se cargan luego con el mapa
    this.numTiles = {
        "x": 100,
        "y": 100
    };

    // Tamaño en pixeles de cada Tile
    this.tileSize = {
        "x": 64,
        "y": 64
    };

    // Tamaño del mapa en pixeles. Es el producto de numTiles * tileSize calculado luego
    this.pixelSize = {
        "x": 64,
        "y": 64
    };

    // Numero de imagenes cargadas
    this.imgLoadCount = 0;

    // Bandera para marcar si ya se cargó el mapa y todos los recursos (Imagenes, tilesets, ...)
    this.fullyLoaded = false;

    //Atributo donde guardaremos los objetos cargados por el mapa
    this.objetos = [];

}

MapClass.prototype.constructor = MapClass;

MapClass.prototype.getTilePacket = function(tileIndex) {

    var pkt = {
        "img": null,
        "px": 0,
        "py": 0
    };

    // Buscamos el tileset, donde se encuentra el tile requerido
    // Lo logramos recorriendo todos los tilesets, si el id del primer tile (Firstgid) es menor o igual al que buscamos, 
    // entonces nuestro tile se encuentra en este tileset. Debido a que los tilesets se organizan de acuerdo a su id, de menor a mayor.
    // Los recorremos en orden inverso, para evitar validaciones extra cuando solo hay un tileset
    var tile = 0;
    for (tile = this.tilesets.length - 1; tile >= 0; tile--) {
        if (this.tilesets[tile].firstgid <= tileIndex) break;
    }

    // Guardamos la imagen del tileset donde se encuentra nuestro tile
    pkt.img = this.tilesets[tile].image;


    // tenemos que restar el indice del tile buscado, menos el firstgid del tileset,
    // para obtener el indice real dentro del tileset, porque el tiled le agrega un valor 
    // para que no se repitan los tileIds entre los diferentes tilesets
    // el localIdx es el indice real, que nos permite encontrar el tile, dentro de el tileset respectivo.
    var localIdx = tileIndex - this.tilesets[tile].firstgid;

    // Calculamos la cordenada X y Y del tile dentro del tilset.
    var lTileX = Math.floor(localIdx % this.tilesets[tile].numXTiles);
    var lTileY = Math.floor(localIdx / this.tilesets[tile].numXTiles);

    // Calculamos la posicion inicial en pixeles, de nuestro tile en la imagen (tileset)
    pkt.px = (lTileX * this.tileSize.x);
    pkt.py = (lTileY * this.tileSize.y);


    return pkt;
}

// pintamos el mapa
MapClass.prototype.draw = function(ctx) {
    // solo pintamos el mapa si todas las imagenes estan cargadas
    if (!this.fullyLoaded) return;

    // recorremos todas las capas en el mapa
    for (var layerIdx = 0; layerIdx < this.currMapData.layers.length; layerIdx++) {

        // solo pintamos las capas de tipo 'tilelayer'
        if (this.currMapData.layers[layerIdx].type != "tilelayer") continue;

        // elemento en el cual se encuentran identificados los tiles en cada posición del mapa.
        var dat = this.currMapData.layers[layerIdx].data;

        for (var tileIDX = 0; tileIDX < dat.length; tileIDX++) {

            // Si el tileIndex es cero no pintamos nada, así que continuamos
            var tID = dat[tileIDX];
            if (tID === 0) continue;

            // Buscamos el tile ( "Sprite" ) correspondiente, en el tileset
            var tPKT = this.getTilePacket(tID);

            // Calculamos la posicion en el mundo, en la cual debemos pintar el tile
            var worldX = Math.floor(tileIDX % this.numTiles.x) * this.tileSize.x;
            var worldY = Math.floor(tileIDX / this.numTiles.x) * this.tileSize.y;

            if((GE.camara.offset.x%this.pixelSize.x)+GE.camara.size.w > this.pixelSize.x){
                if(worldX<(GE.camara.offset.x%this.pixelSize.x)-64){
                    worldX=worldX+(Math.floor((GE.camara.offset.x%this.pixelSize.x+GE.camara.size.w)/this.pixelSize.x)*this.pixelSize.x);
                }
            }

            if (worldX - (GE.camara.offset.x%this.pixelSize.x) < -64 || worldX - (GE.camara.offset.x%this.pixelSize.x) > GE.canvasSize.w) {
                continue;
            }

            if (worldY - GE.camara.offset.y < -64 || worldY - GE.camara.offset.y > GE.canvasSize.h) {
                continue;
            }

            //Pintamos el tile
            ctx.drawImage(tPKT.img, tPKT.px, tPKT.py,
                this.tileSize.x, this.tileSize.y,
                worldX - (GE.camara.offset.x%this.pixelSize.x), worldY - GE.camara.offset.y,
                this.tileSize.x, this.tileSize.y);

        }
    }
}