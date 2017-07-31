EnergiaClass = function(energiaJson){
	EntityClass.call(this);

	this.pos = {x:energiaJson.xIni, y:energiaJson.yIni};

    this.currSpriteName = "energia";
    
    this.energiaRecarga = 1000;

    this.contactos = [];
    
	var entityDef = {
        id: "energia",
        type: 'static',
        x: this.pos.x ,
        y: this.pos.y,
        halfHeight: 30 / 2,
        halfWidth: 30 / 2,
        damping: 0,
        angle: this.angulo,
        filterGroupIndex:-1,
        categories: ['projectile'],
        collidesWith: [],
        isSensor:true,
        userData: {
            "id": "energia",
            "ent": this
        }
    };

    this.physBody = gPhysicsEngine.addBody(entityDef);

}

EnergiaClass.prototype = Object.create(EntityClass.prototype);

EnergiaClass.prototype.constructor = EnergiaClass;

EnergiaClass.prototype.onTouch = function(otherBody, point, impulse){

    if(!otherBody.GetUserData()) return false;

    var physOwner = otherBody.GetUserData().ent;    

    if(physOwner !== null && (physOwner instanceof PlayerClass) ) {
            physOwner.energy += this.energiaRecarga;
            gSM.playSound("Energia01", { loop: false, vol: 0.6 });
            this.isDead = true;
    }

    return true;
}


EnergiaClass.prototype.endTouch = function(otherBody, point, impulse){
    
    return true;
}

EnergiaClass.prototype.update = function(){
    //this.physBody.SetPosition(this.pos);
    this.pos=this.physBody.GetPosition();
    
    if(this.pos.x < GE.camara.pos.x-(GE.camara.size.w/2) -64 ){
        this.isDead = true;
    }
}