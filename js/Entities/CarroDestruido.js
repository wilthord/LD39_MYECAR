CarroDestruidoClass = function(posJson){
	EntityClass.call(this);

	this.pos = {x:posJson.xIni, y:posJson.yIni};

	this.currSpriteName = "carroDestruido";

	this.contactos = [];

	var entityDef = {
        id: "carroDestruido",
        type: 'static',
        x: this.pos.x ,
        y: this.pos.y,
        halfHeight: 30 / 2,
        halfWidth: 30 / 2,
        damping: 0,
        angle: this.angulo,
        filterGroupIndex:-1,
        categories: ['projectile'],
        collidesWith: ['player'],
        isSensor:true,
        userData: {
            "id": "carroDestruido",
            "ent": this
        }
    };

    this.physBody = gPhysicsEngine.addBody(entityDef);

}

CarroDestruidoClass.prototype = Object.create(EntityClass.prototype);

CarroDestruidoClass.prototype.constructor = CarroDestruidoClass;

CarroDestruidoClass.prototype.onTouch = function(otherBody, point, impulse){

    if(!otherBody.GetUserData()) return false;

    var physOwner = otherBody.GetUserData().ent;    

    if(physOwner !== null && (physOwner instanceof PlayerClass || physOwner instanceof EnemyClass) ) {
            //this.contactos.push(physOwner);
            physOwner.isDead=true;
            physOwner.sonidoActual.stop();
            GE.entities.push(new ExplosionClass({"xIni": physOwner.pos.x, "yIni": physOwner.pos.y}));
    }

    return true;
}


CarroDestruidoClass.prototype.endTouch = function(otherBody, point, impulse){
    
    if(!otherBody.GetUserData()) return false;

    var physOwner = otherBody.GetUserData().ent;

    if(physOwner !== null && (physOwner instanceof PlayerClass || physOwner instanceof EnemyClass) ) {
    	this.contactos.removeObj(physOwner);

    }

    return true;
}

CarroDestruidoClass.prototype.update = function(){
    //this.physBody.SetPosition(this.pos);
    this.pos=this.physBody.GetPosition();
    
    if(this.pos.x < GE.camara.pos.x-(GE.camara.size.w/2) -64 ){
        this.isDead = true;
    }
}