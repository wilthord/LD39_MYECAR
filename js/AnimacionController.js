//Mapa de todas las Animaciones
animacionesMap={};

AnimacionesController = function(){


}

AnimacionesController.prototype.constructor = AnimacionesController;

AnimacionesController.prototype.defAnimacion = function (nombreAnim, spritesAnim, frameDuration) {

    var anim = new Animacion();
    
    anim.id=nombreAnim;
    anim.numFrames=spritesAnim.length;
    anim.sprites=spritesAnim;
    anim.frameDuration=frameDuration;

    animacionesMap[nombreAnim]=anim;

}


AnimacionesController.prototype.getAnimacion = function (nombreAnim) {

    return animacionesMap[nombreAnim];

}

/*
AnimacionesController.prototype.getFrameSprite = function (nombreAnim, numFrame) {

    var animacion = animacionesMap[nombreAnim];

    var sprites = animacion.sprites;

    return sprites[numFrame%sprites.numFrames];

}
*/

AnimacionesController.prototype.getFrameSprite = function (nombreAnim, deltaTime) {

    var animacion = animacionesMap[nombreAnim];

    var sprites = animacion.sprites;

    var actualFrame = Math.floor((deltaTime / animacion.frameDuration)) % animacion.numFrames;

    //console.log(actualFrame + ' = ' + deltaTime + ' / ' + animacion.frameDuration+ ' % ' +animacion.numFrames);

    return sprites[actualFrame];

}

AnimacionesController.prototype.getFrameSpriteNoLoop = function (nombreAnim, deltaTime) {

    var animacion = animacionesMap[nombreAnim];

    var sprites = animacion.sprites;

    var actualFrame = Math.floor((deltaTime / animacion.frameDuration)) % animacion.numFrames;

    if((deltaTime / animacion.frameDuration)>=animacion.numFrames){
        actualFrame = animacion.numFrames-1;
    }
    
    //console.log(actualFrame + ' = ' + deltaTime + ' / ' + animacion.frameDuration+ ' % ' +animacion.numFrames);

    return sprites[actualFrame];

}

gAnimController = new AnimacionesController();