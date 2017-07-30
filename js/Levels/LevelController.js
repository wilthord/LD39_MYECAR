niveles = {};

function cargarNivelesJSON(nivelesURL, callbackIniciar) {
    xhrGet(nivelesURL, function(data) {
        callbackJSONNiveles(data.currentTarget.responseText, callbackIniciar);
    });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callbackJSONNiveles(respuestaText, callbackIniciar) {

    var obj = JSON.parse(respuestaText);

    var miNivel = {};
    var miEntidad = {};

    for (var i = 0; i < obj.Niveles.length; i++) {

        miNivel = new LevelClass(obj.Niveles[i].id, obj.Niveles[i].nombre); //Creamos una nueva instancia de la SpriteSheet

        miNivel.mapa = obj.Niveles[i].mapa;

        if (miNivel.mapa) {
            gMap.mapasPorCargar++;
            gMap.load(miNivel.mapa);
        }

        for (j = 0; j < obj.Niveles[i].entidades.length; j++) { //Recorremos todas las entidades de los niveles
            miEntidad = obj.Niveles[i].entidades[j];
            miNivel.agregarEntidad(miEntidad);
        }

        niveles[miNivel.id] = miNivel; //Se guarda el objeto Level en el mapa de Niveles
    }

    var tiempo = 0;
    while(gMap.mapasPorCargar>0){
        await sleep(2000);
        tiempo+=2000;
        if(tiempo>8000){
            break;
        }
        // Esperamos maximo 10 segundos
    }

    callbackIniciar();
}