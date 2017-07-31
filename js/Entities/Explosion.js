ExplosionClass = function(posJson){
	EntityClass.call(this);

    this.pos = {x:posJson.xIni, y:posJson.yIni};
    
    this.animStartTime = (new Date()).getTime();    

    var deltaTime = ((new Date()).getTime()-this.animStartTime);			//numero de milisegundos que pasaron desde la ultima actualizacion.
	this.currSpriteName = gAnimController.getFrameSprite('Explosion', deltaTime);

    if(this.pos.x > GE.camara.pos.x-(GE.camara.size.w/2) - 16 ){
        var numExp = Math.floor((Math.random() * 3) + 1);
        gSM.playSound("Explosion0"+numExp, { loop: false, vol: 0.4 });
    }
    
}

ExplosionClass.prototype = Object.create(EntityClass.prototype);

ExplosionClass.prototype.constructor = ExplosionClass;

ExplosionClass.prototype.update = function(){
    
    /****  OBTENEMOS EL SIGUIENTE FRAME PARA LA ANIMACION ***/
	var deltaTime = ((new Date()).getTime()-this.animStartTime);			//numero de milisegundos que pasaron desde la ultima actualizacion.
    this.currSpriteName = gAnimController.getFrameSpriteNoLoop('Explosion', deltaTime);
    
    if(this.pos.x < GE.camara.pos.x-(GE.camara.size.w/2) - 64 ){
        this.isDead = true;
    }

}