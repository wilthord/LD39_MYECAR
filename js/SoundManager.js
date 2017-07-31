SoundManager = function() {

    this.clips = {};
    this.enabled = true;
    this._context = null;
    this._mainNode = null;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    try {
        this._context = new AudioContext();
    } catch (e) {
        this.enabled = false;
        alert(e);
        alert('The Audio API is not supported on your Browser, you can play the game, but without sound');
    }

    this._mainNode = this._context.createGain(0);
    this._mainNode.connect(this._context.destination);

}


SoundManager.prototype.constructor = SoundManager;


/**
Funcion que realiza el cargue asincrono del sonido en el path, 
al finalizar invoca la funcion pasada en callbackFcn
El nuevo clip de sonido es guardado en el arreglo Clips del SounManager
    Con el ID obtenido en el soundName.
**/
SoundManager.prototype.loadAsync = function(path, soundName, callbackFcn) {
    if (gSM.clips)
        if (gSM.clips[soundName]) {
            callbackFcn(gSM.clips[soundName].soundObj);
            return gSM.clips[soundName].soundObj;
        }

    var clip = {
        soundObj: new Sound(soundName),
        buffer: null,
        loop: false
    };

    gSM.clips[soundName] = clip;
    clip.soundObj.path = path;

    var request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        gSM._context.decodeAudioData(request.response,

            function(buffer) {
                gSM.clips[soundName].buffer = buffer;
                gSM.clips[soundName].loop = true;
                callbackFcn(gSM.clips[soundName].soundObj);
            },

            function(data) {});

    };
    request.send();


    return clip.soundObj;

}

//----------------------------
SoundManager.prototype.togglemute = function() {
    if (gSM._mainNode.gain.value > 0) {
        gSM._mainNode.gain.value = 0;
    } else {
        gSM._mainNode.gain.value = 1;
    }
}

//----------------------------
SoundManager.prototype.stopAll = function() {
    gSM._mainNode.disconnect();
    gSM._mainNode = gSM._context.createGain(0);
    gSM._mainNode.connect(gSM._context.destination);
}


SoundManager.prototype.playSound = function(soundName, settings) {

    if (!gSM.enabled) return false;

    var loop = false;
    var vol = 0.2;

    if (settings) {
        if (settings.loop) {
            loop = settings.loop;
        }
        if (settings.vol) {
            vol = settings.vol;
        }
    }


    var sd = this.clips[soundName];
    if (sd === null) return false;
    if (sd.loop === false) return false;

    var currentClip = null;

    currentClip = gSM._context.createBufferSource();

    currentClip.buffer = sd.buffer;
    var gain = gSM._context.createGain();
    currentClip.connect(gain);
    gain.gain.value = vol;
    gain.connect(gSM._context.destination);
    currentClip.loop = loop;

    currentClip.connect(gSM._mainNode);
    currentClip.start(0);

    return currentClip;
}

Sound = function(soundName) {
    name = soundName;
}

Sound.prototype.constructor = Sound;

Sound.prototype.play = function(loopX) {
    // Call the playSound function with the appropriate path and settings.
    gSM.playSound(this.name, { loop: loopX, vol: 1 });
}


var gSM = new SoundManager();

function loadSoundSheet(soundSheetURL, callbackIniciar) {
    xhrGet(soundSheetURL, function(data) {
        parseSoundSheet(data.currentTarget.responseText, callbackIniciar);
    });
}


function parseSoundSheet(respuestaText, callbackIniciar) {

    var obj = JSON.parse(respuestaText);

    for (var i = 0; i < obj.sonidos.length; i++) {

        gSM.loadAsync(obj.sonidos[i].path, obj.sonidos[i].name, function(soundObj) {});

    }

    callbackIniciar();
}