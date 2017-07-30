PlayerClass = function(playerJson){		//Heredamos de la clase entidad
	EntityClass.call(this);
	
	this.pos.x=playerJson.xIni;
	this.pos.y=playerJson.yIni;
	this.currSpriteName = 'MyECar';

	this.movimiento = 32;				//cantidad de pixeles a desplazar por tick

	this.velocidad = playerJson.velMin;

	this.velocidadMinima = playerJson.velMin;

	this.velocidadMaxima = playerJson.velMax;

	this.aceleracion = playerJson.aceleracion;

	this.isAcelerando = false;

	this.consumoAcelerando = 2;
	this.consumoNormal = 1;

	this.aturdido = false;
	this.tiempoAturdido=0;

	//Vida del jugador
	this.energy = 100000;

	//Tiempo inicial de la animación actual. este valor se cambia cada vez que se requiere cambiar la animacion (Cambio de estado)
	this.animStartTime = (new Date()).getTime();    

	// Create our physics body;
    var entityDef = {
        id: "Player",
        type: 'dynamic',
        x: this.pos.x,
        y: this.pos.y,
        halfHeight: 30 * 0.5,
        halfWidth: 30 * 0.5,
        damping: 0,
        angle: 0,
        filterGroupIndex:1,
        categories: ['player'],
        collidesWith: ['player'],
        userData: {
            "id": "Player",
            "ent": this
        }
    };

	this.physBody = gPhysicsEngine.addBody(entityDef);
	
	var deltaTime = ((new Date()).getTime()-this.animStartTime);			//numero de milisegundos que pasaron desde la ultima actualizacion.
	this.currSpriteName = gAnimController.getFrameSprite('carroAndando', deltaTime);
	
}

PlayerClass.prototype = Object.create(EntityClass.prototype);
PlayerClass.prototype.constructor = PlayerClass;

PlayerClass.prototype.update = function(){

	if(this.energy<1){
		this.isDead=true;
		return;
	}

	if(this.aturdido){

		this.isAcelerando=false;
		this.tiempoAturdido--;

		if(this.tiempoAturdido<=0){
			this.aturdido=false;
			this.animStartTime = (new Date()).getTime();
		}

		//TODO: validar si se deberia afectar la velocidad

	}else{

		//Validamos si hay acciones pendientes por ejecutar
		if(gInputEngine.actions[MOV_ARRIBA]){
			this.pos.y = this.pos.y - this.movimiento;
			gInputEngine.actions[MOV_ARRIBA]=false;
		}
		if(gInputEngine.actions[MOV_ABAJO]){
			this.pos.y = this.pos.y + this.movimiento;
			gInputEngine.actions[MOV_ABAJO]=false;
		}

		// TODO: Controlar la aceleración, para que sea progresiva proporcional a los Ticks
		if(gInputEngine.actions[ACELERAR]){
			if(this.velocidad<this.velocidadMaxima){
					this.velocidad+=this.aceleracion;
				if(this.velocidad>this.velocidadMaxima){
					this.velocidad=this.velocidadMaxima;
				}
			}

			this.isAcelerando = true;
			
		}else{

			this.isAcelerando = false;
			
			if(this.velocidad > this.velocidadMinima){
				this.velocidad-=this.aceleracion;
				if(this.velocidad<this.velocidadMinima){
					this.velocidad=this.velocidadMinima;
				}
			}
		}

	}

	this.pos.x += this.velocidad;

	this.physBody.SetPosition(this.pos);
	this.pos=this.physBody.GetPosition();

	//TODO: controlar el consumo de energia, para que sea proporcional a los Ticks
	if(this.isAcelerando){
		this.energy-=this.consumoAcelerando;
	}else{
		this.energy-=this.consumoNormal;
	}

	/****  OBTENEMOS EL SIGUIENTE FRAME PARA LA ANIMACION ***/
	var deltaTime = ((new Date()).getTime()-this.animStartTime);			//numero de milisegundos que pasaron desde la ultima actualizacion.
	if(this.aturdido){
		this.currSpriteName = gAnimController.getFrameSprite('carroAturdido', deltaTime);
	}else{
		this.currSpriteName = gAnimController.getFrameSprite('carroAndando', deltaTime);
	}

}

PlayerClass.prototype.draw = function(){
	pintarSpriteCustom(this.currSpriteName, this.pos.x, this.pos.y, this.w, this.h, this.angulo);

	this.pintarEnergia();

}

PlayerClass.prototype.pintarEnergia = function() {

    GE.ctx.beginPath();
    GE.ctx.strokeStyle='#000000';
    GE.ctx.lineWidth=9;
    GE.ctx.moveTo((GE.camara.pos.x- GE.camara.offset.x)-60, (GE.camara.pos.y- GE.camara.offset.y)+64);
    GE.ctx.lineTo((GE.camara.pos.x- GE.camara.offset.x)+60, (GE.camara.pos.y- GE.camara.offset.y)+64);
    GE.ctx.stroke();

    GE.ctx.beginPath();
    GE.ctx.strokeStyle='#2397FF';
    GE.ctx.lineWidth=5;
    GE.ctx.moveTo((GE.camara.pos.x- GE.camara.offset.x)-50, (GE.camara.pos.y- GE.camara.offset.y)+64);
    GE.ctx.lineTo((GE.camara.pos.x- GE.camara.offset.x)-50+(this.energy/10), (GE.camara.pos.y- GE.camara.offset.y)+64);
    GE.ctx.stroke();
    
}

PlayerClass.prototype.aturdir = function() {

	this.aturdido=true;

	this.animStartTime = (new Date()).getTime();
	
	//TODO: validar que la posición a transportar sea valida y no exista un enemigo.
	this.pos.y += Math.floor((Math.random() * 5) - 2) * 32;
	this.physBody.SetPosition(this.pos);
	this.pos=this.physBody.GetPosition();
	
	this.tiempoAturdido = 60;
}