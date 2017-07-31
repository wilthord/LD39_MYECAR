/** Codigo para presentar estadisticas de rendimiento en tiempo real **/
var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms, 2: mb

pisoSpriteName = "Piso";

//document.getElementById("divStats").appendChild(stats.domElement);
/** Fin del codigo de estadisticas **/

GameEngineClass = function() {

    this.ctx = {};

    this.canvasObj = {};

    this.canvasSize = { h: 600, w: 800 };

    this.camara = new CamaraClass(this.canvasSize);

    this.entities = [];

    this.listaEnemigos = [];

    this.personaje = {};

    this.marcaMouse = {};

    this.nombreCanvas = 'myCanvas';

    this.enemySpawnTime = 400;

    this.nextEnemySpawn = 0;

    this.obstaculoSpawnTime = 60;

    this.nextObstaculoSpawn = 0;

    this.energiaSpawnTime = 200;

    this.nextEnergiaSpawn = 0;

    this.nivelActual = 1;

    this.entidadesFactory = [];

    this.isGUI = true;

    this.mapaActual = null;

    this.distanciaRecorrida = 0;

    this.mostrarDistancia = false;
}

GameEngineClass.prototype.setup = function() {

    // Create physics engine
    gPhysicsEngine.create();

    // Add contact listener
    gPhysicsEngine.addContactListener({

        BeginContact: function(bodyA, bodyB) {
            var uA = bodyA ? bodyA.GetUserData() : null;
            var uB = bodyB ? bodyB.GetUserData() : null;

            if (uA !== null) {
                if (uA.ent !== null && uA.ent.onTouch) {
                    uA.ent.onTouch(bodyB, null);
                }
            }

            if (uB !== null) {
                if (uB.ent !== null && uB.ent.onTouch) {
                    uB.ent.onTouch(bodyA, null);
                }
            }
        },

        EndContact: function(bodyA, bodyB) {
            var uA = bodyA ? bodyA.GetUserData() : null;
            var uB = bodyB ? bodyB.GetUserData() : null;

            if (uA !== null) {
                if (uA.ent !== null && uA.ent.endTouch) {
                    uA.ent.endTouch(bodyB, null);
                }
            }

            if (uB !== null) {
                if (uB.ent !== null && uB.ent.endTouch) {
                    uB.ent.endTouch(bodyA, null);
                }
            }
        },
    });

}

GameEngineClass.prototype.constructor = GameEngineClass;
// Metodo invocado cuando se terminan de cargar los sprites
GameEngineClass.prototype.callbackIniciar = function() {
    if (GE.isGUI) {
        GE.nuevoGUI("InicioGUI");
        //GE.nuevoNivel();
    } else {
        GE.nuevoNivel();
    }
    /** Inicio de la sección para preparar un gameLoop eficiente **/
    var animFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        null;

    if (animFrame !== null) {

        // Metodo recursivo controlado por el navegador, para hacer invocaciones de animaciones eficientemente
        var recursiveLoop = function() {
            //Tick del gameLoop
            GE.tick();
            //Se invoca el siguiente Tick del gameLoop, utilizando requestAnimationFrame o el disponible
            animFrame(recursiveLoop);
        };

        // Iniciamos el Game Loop
        animFrame(recursiveLoop);
    } else {
        // Si no está disponible ninguna versión del requestAnimationFrame, se inicia el gameloop con setInterval
        var ONE_FRAME_TIME = 1000.0 / 60.0;
        setInterval(GE.tick, ONE_FRAME_TIME);
    }

    gInputEngine.setup();

    /** Fin de preparación del gameLoop **/

}

GameEngineClass.prototype.init = function() {
    this.canvasObj = document.getElementById("myCanvas");
    this.canvasObj.width = this.canvasSize.w;
    this.canvasObj.height = this.canvasSize.h;
    GE.ctx = this.canvasObj.getContext("2d");
    loadSprites("img/spriteSheetMap.json", GE.cargarNiveles);

    // Cargamos los sonidos
    loadSoundSheet("js/Sound/SoundSheetMap.json", function() {});

    // Se inicializa el PhysicsEngine
    this.setup();
}

GameEngineClass.prototype.cargarNiveles = function() {
    cargarNivelesJSON("js/Levels/Niveles.json", GE.callbackIniciar);
}

GameEngineClass.prototype.nivelSuperado = function() {
    //alert("Level Cleared");
    this.nivelActual++;
    this.nuevoGUI("SuperadoGUI");
    this.isGUI = true;
}

GameEngineClass.prototype.nivelPerdido = function() {
    //gSM.stopAll();
    gSM.playSound("Perdiste", { loop: false, vol: 0.4 });
    //alert("GameOver try again...");
    this.mostrarDistancia = true;
    this.nuevoGUI("PerdisteGUI");
    this.isGUI = true;
}

GameEngineClass.prototype.nuevoNivel = function() {
    var nivelCargar = niveles[this.nivelActual];

    this.distanciaRecorrida = 0;

    //Limpiamos todo lo del nivel anterior
    for (var j = 0; j < this.entities.length; j++) {
        if (this.entities[j].physBody) gPhysicsEngine.removeBody(this.entities[j].physBody);
        this.entities.removeObj(this.entities[j]);
    }

    gPhysicsEngine = null;
    gPhysicsEngine = new PhysicsEngineClass();
    this.setup();

    this.entities = [];
    this.personaje = {};

    if (nivelCargar.mapa) {
        this.mapaActual = gMap.listaMapas[nivelCargar.mapa];
    } else {
        alert("Map not found for this level/stage !!!");
        //VALIDAR: ¿generar fondo automaticamente?
    }

    //Instanciamos los objetos cargados por el mapa
    for (var j = 0; j < this.mapaActual.objetos.length; j++) {
        var objetoMapa = new GE.entidadesFactory[this.mapaActual.objetos[j].type](this.mapaActual.objetos[j]);
        this.entities.push(objetoMapa);
    }

    for (var i = 0; i < nivelCargar.entidades.length; i++) {

        var entidadNueva = new GE.entidadesFactory[nivelCargar.entidades[i].type](nivelCargar.entidades[i]);
        if (entidadNueva instanceof PlayerClass) {
            this.personaje = entidadNueva;
            //Le indicamos a la camara que siga al personaje
            this.camara.seguir(this.personaje);
        }
        this.entities.push(entidadNueva);
    }

}

GameEngineClass.prototype.nuevoGUI = function(nombreGUI) {
    var nivelCargar = niveles[nombreGUI];

    this.camara.noSeguir({ x: this.camara.size.h / 2, y: this.camara.size.y / 2 });

    if (nivelCargar.mapa) {
        //TODO: Corregir, la lista de mapas llega vacia a este punto.
        this.mapaActual = gMap.listaMapas[nivelCargar.mapa];
    } else {
        alert("Map not found for this level/stage !!!");
        //VALIDAR: ¿generar fondo automaticamente?
    }

    //Limpiamos todo lo del nivel anterior
    for (var k = 0; k < this.listaEnemigos.length; k++) {

        if(this.listaEnemigos[k] instanceof EnemyClass && this.listaEnemigos[k].isDead==false){
            this.listaEnemigos[k].sonidoActual.stop();
        }

    }
    this.listaEnemigos = [];
    for (var j = 0; j < this.entities.length; j++) {
        /*
        if(this.entities[j] instanceof EnemyClass && this.entities[j].isDead==false){
            this.entities[j].sonidoActual.stop();
        }*/
        if (this.entities[j].physBody) gPhysicsEngine.removeBody(this.entities[j].physBody);
        this.entities.removeObj(this.entities[j]);
    }

    this.entities = [];
    this.personaje = {};

    for (var i = 0; i < nivelCargar.entidades.length; i++) {
        var entidadNueva = new GUIEntityClass(nivelCargar.entidades[i]);
        this.entities.push(entidadNueva);
    }

}

GameEngineClass.prototype.tick = function() {

    // Iniciamos el monitoreo
    stats.begin();

    if (!this.isGUI) {

        //Spawn enemy
        this.nextEnemySpawn--;
        if(this.nextEnemySpawn<0){
            this.spawnEnemy();
        }

        //Spawn Obstaculo
        this.nextObstaculoSpawn--;
        if(this.nextObstaculoSpawn<0){
            this.spawnObstaculo();
        }

        //Spawn Energia
        this.nextEnergiaSpawn--;
        if(this.nextEnergiaSpawn<0){
            this.spawnEnergia();
        }        

        if (this.personaje && this.personaje != null && this.personaje instanceof PlayerClass && this.personaje.isDead == false) {
            //Si existe un personaje y este está vivo, sigue la ejecución del nivel
        } else{
            this.nivelPerdido();
        }
    }

    GE.updateGame();
    GE.camara.update();
    GE.drawGame();

    //Finalizamos el monitoreo
    stats.end();
}

GameEngineClass.prototype.updateGame = function() {

    var entidadesEliminar = [];
    GE.entities.forEach(function(entidad) {
        if (entidad.isDead == true) {
            entidadesEliminar.push(entidad);
        } else {
            entidad.update();
        }
    });

    for (var j = 0; j < entidadesEliminar.length; j++) {
        if (entidadesEliminar[j].physBody) gPhysicsEngine.removeBody(entidadesEliminar[j].physBody);
        if(entidadesEliminar[j] instanceof EnemyClass){
            this.listaEnemigos.removeObj(entidadesEliminar[j]);
        }
        this.entities.removeObj(entidadesEliminar[j]);
    }

    gPhysicsEngine.update();

    //Validamos si es momento de generar un nuevo enemigo
    //if(this.nextEnemySpawn===0) this.spawnEnemy();
}

GameEngineClass.prototype.drawGame = function() {

    //Limpiamos el canvas
    this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);

    if (this.mapaActual) {
        this.mapaActual.draw(GE.ctx);
    }

    GE.entities.forEach(function(entidad) {
        entidad.draw();
    });

    this.drawGameUI();

    if (this.camara.debug) {
        this.camara.drawDebugCamara();
    }
}

GameEngineClass.prototype.drawGameUI = function() {

    if (!this.isGUI) {

        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "#3632C2";
        this.ctx.fillText("Power ",125, 355);

        this.ctx.beginPath();
        this.ctx.strokeStyle='#000000';
        this.ctx.lineWidth=9;
        this.ctx.moveTo(200, 350);
        this.ctx.lineTo(320, 350);
        this.ctx.stroke();

        this.ctx.beginPath();
        if(this.personaje.energy < this.personaje.maxEnergy * 0.2){
            this.ctx.strokeStyle='#FF0004';
        }else{
            this.ctx.strokeStyle='#2397FF';
        }
        this.ctx.lineWidth=5;
        this.ctx.moveTo(210, 350);
        this.ctx.lineTo(210+(this.personaje.energy/50), 350);
        this.ctx.stroke();

        this.ctx.font = "bold 20px Arial";
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText("Distance ",400, 355);

        this.ctx.font = "26px Arial";
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(Math.floor(this.distanciaRecorrida/32)+"'  ", 490, 358);

    }else{

        this.ctx.font = "18px Arial";
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(" * You drive en electric car, Your goal is to travel a long distance",20, 400);

        this.ctx.font = "18px Arial";
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(" * The other cars will try to stand next to you to steal your energy",20, 430);

        this.ctx.font = "18px Arial";
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(" * They will focus on stealing your energy and will not be aware of the obstacles",20, 460);

        this.ctx.font = "18px Arial";
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(" * Take the batteries to avoid running out of power",20, 490);

        this.ctx.font = "bold 20px Arial";
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(" Controls:  W -> Up,  S -> Down,  SpaceBar -> SpeedUp",20, 540);

        if(this.mostrarDistancia){

            this.ctx.font = "bold 36px Arial";
            this.ctx.fillStyle = "#002F68";
            this.ctx.fillText("Distance ",290, 221);

            this.ctx.font = "bold 36px Arial";
            this.ctx.fillStyle = "#002F68";
            this.ctx.fillText(Math.floor(this.distanciaRecorrida/32)+"'  ", 460, 224);

        }
    } 
}


GameEngineClass.prototype.spawnEnemy = function() {
    
    this.nextEnemySpawn=this.enemySpawnTime;
    var posY = (Math.floor(Math.random() * 5)*32) + 144;
    var posX = GE.camara.pos.x - (GE.camara.size.w/2) - 32;
    var tempEnemyData = {"xIni": posX, "yIni": posY, "velMin":1, "velMax":6, "aceleracion":1};
    var nuevoEnemigo = new EnemyClass(tempEnemyData);
    GE.entities.push(nuevoEnemigo);
    GE.listaEnemigos.push(nuevoEnemigo);
    
}

//TODO: Mejorar el spawn de enemigos
GameEngineClass.prototype.spawnObstaculo = function() {

    this.nextObstaculoSpawn = this.obstaculoSpawnTime;

    var numObs =(Math.floor(Math.random() * 3));

    for(var i = 0; i<numObs; i++){
        var posY = (Math.floor(Math.random() * 5)*32) + 144;
        var posX = GE.camara.pos.x + (GE.camara.size.w/2) + 32;

        if(Math.floor(Math.random() * 4 ) % 2 == 0){
            this.entities.push(new CharcoClass({"xIni": posX+(i*16), "yIni": posY}));
        }else{
            this.entities.push(new CarroDestruidoClass({"xIni": posX+(i*16), "yIni": posY}));
        }
    }

}


GameEngineClass.prototype.spawnEnergia = function() {

    this.nextEnergiaSpawn = this.energiaSpawnTime;

    var posY = (Math.floor(Math.random() * 5)*32) + 144;
    var posX = GE.camara.pos.x + (GE.camara.size.w/2) + 32;

    this.entities.push(new EnergiaClass({"xIni": posX, "yIni": posY}));

}

GE = new GameEngineClass();
GE.entidadesFactory["PlayerClass"] = PlayerClass;
GE.entidadesFactory["EnemyClass"] = EnemyClass;
GE.entidadesFactory["CarroDestruidoClass"] = CarroDestruidoClass;
GE.entidadesFactory["CharcoClass"] = CharcoClass;
GE.entidadesFactory["EnergiaClass"] = EnergiaClass;


GE.init();

/*
var nuevoEnemigo = new GuardianClass({x:100, y:100}, {x:200, y:100});
GE.entities.push(nuevoEnemigo);
*/