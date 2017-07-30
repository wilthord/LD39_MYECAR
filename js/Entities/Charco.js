CharcoClass = function(posJson){
	EntityClass.call(this);

	this.pos = {x:posJson.xIni, y:posJson.yIni};

	this.currSpriteName = "charco";

	this.contactos = [];

	var entityDef = {
        id: "charco",
        type: 'static',
        x: this.pos.x ,
        y: this.pos.y,
        halfHeight: 30 / 2,
        halfWidth: 30 / 2,
        damping: 0,
        angle: this.angulo,
        filterGroupIndex:-1,
        categories: [],
        collidesWith: [],
        isSensor:true,
        userData: {
            "id": "charco",
            "ent": this
        }
    };

    this.physBody = gPhysicsEngine.addBody(entityDef);

}

CharcoClass.prototype = Object.create(EntityClass.prototype);

CharcoClass.prototype.constructor = CharcoClass;

CharcoClass.prototype.onTouch = function(otherBody, point, impulse){

    if(!otherBody.GetUserData()) return false;

    var physOwner = otherBody.GetUserData().ent;    

    if(physOwner !== null && (physOwner instanceof PlayerClass || physOwner instanceof EnemyClass) ) {
    		physOwner.aturdir();
    }

    return true;
}


CharcoClass.prototype.endTouch = function(otherBody, point, impulse){
    
    return true;
}

CharcoClass.prototype.update = function(){
    //this.physBody.SetPosition(this.pos);
    this.pos=this.physBody.GetPosition();
    
    if(this.pos.x < GE.camara.pos.x-(GE.camara.size.w/2) -64 ){
        this.isDead = true;
    }
}