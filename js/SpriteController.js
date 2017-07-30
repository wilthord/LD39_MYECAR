//Mapa de todas las SpriteSheets
spriteSheetsMap = {};

SpriteSheetClass = function() {

    // We store in the SpriteSheetClass:
    //
    // The Image object that we created for our
    // atlas.
    this.img = null;

    // The URL path that we grabbed our atlas from.
    this.url = "";

    // An array of all the sprites in our atlas.
    this.sprites = [];

}

SpriteSheetClass.prototype.constructor = SpriteSheetClass;

SpriteSheetClass.prototype.defSprite = function(nombre, x, y, w, h) {

    var spt = new Sprite();

    spt.id = nombre;
    spt.x = x;
    spt.y = y;
    spt.w = w;
    spt.h = h;

    this.sprites.push(spt);
}


SpriteSheetClass.prototype.getSprite = function(nombre) {

    for (var i = 0; i < this.sprites.length; i++) {

        if (this.sprites[i].id === nombre) {

            return this.sprites[i];
        }

    }

    return null;
}


function loadSprites(spritesFilesURL, callbackIniciar) {
    xhrGet(spritesFilesURL, function(data) {
        callbackJSONImagenes(data.currentTarget.responseText, callbackIniciar);
    });
}

function callbackJSONImagenes(respuestaText, callbackIniciar) {

    var obj = JSON.parse(respuestaText);

    var mySpriteSheet = {};
    var mySpriteJson = {};

    for (var i = 0; i < obj.sheets.length; i++) {

        mySpriteSheet = new SpriteSheetClass(); //Creamos una nueva instancia de la SpriteSheet
        var img = new Image(); //Creamos una imagen, que será nuestra spriteSheet
        img.src = obj.sheets[i].imgURL; //Cargamos la imagen;
        mySpriteSheet.url = img.src; //Guardamos la URL de la imagen en el objeto Spritesheet
        mySpriteSheet.img = img; //Guardamos la imagen en el objeto SpriteSheet

        for (j = 0; j < obj.sheets[i].sprites.length; j++) { //Recorremos todos los sprites de la SpriteSheet
            mySpriteJson = obj.sheets[i].sprites[j];

            mySpriteSheet.defSprite(mySpriteJson.name, mySpriteJson.x, mySpriteJson.y, mySpriteJson.w, mySpriteJson.h); //Creamos el sprite dentro de la SpriteSheet;

        }

        spriteSheetsMap[obj.sheets[i].sheetName] = mySpriteSheet; //Se guarda el objeto SpriteSheet en el mapa de SpriteSheets
    }

    //Cargamos las animaciones
    for (var i = 0; i < obj.animaciones.length; i++) {

        var spritesAnim = [];

        for (j = 0; j < obj.animaciones[i].sprites.length; j++) { //Recorremos todos los sprites de la SpriteSheet

            spritesAnim[j] = obj.animaciones[i].sprites[j];

        }

        gAnimController.defAnimacion(obj.animaciones[i].name, spritesAnim, obj.animaciones[i].frameDuration);
    }
    callbackIniciar();

}

function findSprite(nombreSprite) {
    var sprite = null;
    var sheet = {};

    for (var sheetName in spriteSheetsMap) {

        sheet = spriteSheetsMap[sheetName]; //Consultamos SpriteSheet por SpriteSheet
        sprite = sheet.getSprite(nombreSprite); //Buscamos el Sprite en la sheet actual

        //Si no se encontró el Sprite, se sigue con el siclo
        if (sprite === null) {
            continue;
        } else {
            break;
        }

    }

    return sprite;
}

//Dibuja el Sprite con nombre "nombreSprite" en la posicion X, Y
function pintarSprite(nombreSprite, x, y) {

    var sprite = {};
    var sheet = {};

    if (x - GE.camara.offset.x < -64 || x - GE.camara.offset.x > GE.canvasSize.w) {
        return;
    }

    if (y - GE.camara.offset.y < -64 || y - GE.camara.offset.y > GE.canvasSize.h) {
        return;
    }

    for (var sheetName in spriteSheetsMap) {

        sheet = spriteSheetsMap[sheetName]; //Consultamos SpriteSheet por SpriteSheet
        sprite = sheet.getSprite(nombreSprite); //Buscamos el Sprite en la sheet actual

        //Si no se encontró el Sprite, se sigue con el siclo
        if (sprite === null) {
            continue;
        } else {
            break;
        }

    }

    if (sprite === null || sheet === null) {
        return;
    }

    GE.ctx.drawImage(sheet.img, sprite.x, sprite.y, sprite.w, sprite.h, x - GE.camara.offset.x, y - GE.camara.offset.y, sprite.w, sprite.h);
}

//Dibuja el Sprite con nombre "nombreSprite" en la posicion X, Y
function pintarSpriteCustom(nombreSprite, x, y, w, h, angulo) {

    var sprite = {};
    var sheet = {};

    if (x - GE.camara.offset.x < 0 - 64 || x - GE.camara.offset.x > GE.canvasSize.w + 64) {
        return;
    }

    if (y - GE.camara.offset.y < 0 - 64 || y - GE.camara.offset.y > GE.canvasSize.h + 64) {
        return;
    }

    for (var sheetName in spriteSheetsMap) {

        sheet = spriteSheetsMap[sheetName]; //Consultamos SpriteSheet por SpriteSheet
        sprite = sheet.getSprite(nombreSprite); //Buscamos el Sprite en la sheet actual

        //Si no se encontró el Sprite, se sigue con el siclo
        if (sprite === null) {
            continue;
        } else {
            break;
        }

    }

    if (sprite === null || sheet === null) {
        return;
    }

    GE.ctx.save();
    GE.ctx.translate(x - GE.camara.offset.x, y - GE.camara.offset.y);
    //GE.ctx.rotate((this.angulo*Math.PI)/180);
    GE.ctx.rotate(angulo);

    GE.ctx.drawImage(sheet.img, sprite.x, sprite.y, sprite.w, sprite.h, -sprite.w / (2 * w), -sprite.h / (2 * h), sprite.w / w, sprite.h / h);
    GE.ctx.restore();
}
/*
//Dibuja el Sprite con nombre "nombreSprite" en la posicion X, Y
function pintarSpriteCenter(nombreSprite, x, y, w, h, angulo, centerAxis){

    var sprite = {};
    var sheet = {};

    for(var sheetName in spriteSheetsMap) {

        sheet = spriteSheetsMap[sheetName];             //Consultamos SpriteSheet por SpriteSheet
        sprite = sheet.getSprite(nombreSprite);         //Buscamos el Sprite en la sheet actual

        //Si no se encontró el Sprite, se sigue con el siclo
        if(sprite === null) {
            continue;
        }else{
            break;
        }

    }

    if (sprite === null || sheet === null) {
        return;
    }

    GE.ctx.save();
    var newX = -sprite.w/(2*w);
    var newY = -sprite.h/(2*h);
    
    GE.ctx.translate(x-sprite.w, y);
    //if(centerAxis==='X') newY/=4;
    //if(centerAxis==='Y') newX/=4;
    //GE.ctx.rotate((this.angulo*Math.PI)/180);
    //GE.ctx.rotate(angulo);
    GE.ctx.drawImage(sheet.img, sprite.x, sprite.y, sprite.w, sprite.h, 0, 0, sprite.w/w, sprite.h/h);
    GE.ctx.restore();
}*/