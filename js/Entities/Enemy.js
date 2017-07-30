EnemyClass = function(enemyJson){
	EntityClass.call(this);
	this.currSpriteName = 'carroEnemigo';
	this.energy = 1;
    this.velocidad = enemyJson.velMin;
    this.velocidadMaxima = enemyJson.velMax;
    this.velocidadMinima = enemyJson.velMin;
    this.aceleracion = enemyJson.aceleracion;
	this.absorver = 3;
    this.isDead = false;

    this.acelerando = false;
    this.frenando = false;
    this.esperaCambio = 20;
    this.totalEsperaCambio = 20;

    this.esperaCarril = 15;
    this.totalEsperaCarril = 15;

    this.persiguiendo = true;
    this.agarrado = false;

    this.aturdido = false;
    this.tiempoAturdido=0;
    
    //Tiempo inicial de la animación actual. este valor se cambia cada vez que se requiere cambiar la animacion (Cambio de estado)
	this.animStartTime = (new Date()).getTime();    

    this.pos = {"x":enemyJson.xIni, "y":enemyJson.yIni};

	// Create our physics body;
    var entityDef = {
        id: "Enemy",
        type: 'dynamic',
        x: this.pos.x,
        y: this.pos.y,
        halfHeight: 30 * 0.5,
        halfWidth: 30 * 0.5,
        damping: 0,
        angle: 0,
        filterGroupIndex:1,
        categories: ['projectile'],
        collidesWith: [],
        userData: {
            "id": "Enemy",
            "ent": this
        }
    };

    this.physBody = gPhysicsEngine.addBody(entityDef);

}

EnemyClass.prototype = Object.create(EntityClass.prototype);

EnemyClass.prototype.constructor = EnemyClass;

EnemyClass.prototype.update = function(){

    this.esperaCambio--;
    this.esperaCarril--;
    if(this.aturdido){

		this.acelerando=false;
		this.tiempoAturdido--;

		if(this.tiempoAturdido<=0){
			this.aturdido=false;
        }
        
        //this.velocidad=0.5;
        this.pos.x += this.velocidad;

		//TODO: validar si se deberia afectar la velocidad

	}else{
        
        if(Math.abs(this.pos.y - GE.personaje.pos.y) >=30 && Math.abs(this.pos.y - GE.personaje.pos.y) <=34){
            //Está a una carril de diferencia, se mantiene
            this.esperaCarril = this.totalEsperaCarril;
        }else if(this.esperaCarril<0){
            
            this.esperaCarril = this.totalEsperaCarril;

            if(Math.abs(this.pos.y - GE.personaje.pos.y) >=0 && Math.abs(this.pos.y - GE.personaje.pos.y) <=4){
                //Se encuentra en el mismo carril
                //TODO: generar nueva posición aleatoriamente. validar que no se salga de la pista
                this.pos.y += 32;
            }else if(this.pos.y - GE.personaje.pos.y < 0){

                this.pos.y += 32;

            }else{
                this.pos.y -= 32;
            }
        }

        if(this.persiguiendo){
            if(this.pos.x < GE.personaje.pos.x){

                if(this.frenando){

                    if(this.esperaCambio<=0){
                        this.esperaCambio=this.totalEsperaCambio;
                        this.acelerando=true;
                        this.frenando=false;
                    }
                }else{
                    this.esperaCambio=this.totalEsperaCambio;
                    this.acelerando=true;
                }

                if(this.acelerando){

                    if(this.velocidad<this.velocidadMaxima){
                        this.velocidad+=this.aceleracion;
                        if(this.velocidad>this.velocidadMaxima){
                            this.velocidad=this.velocidadMaxima;
                        }
                    }
                    
                    this.pos.x += this.velocidad;
                    if(this.pos.x > GE.personaje.pos.x){
                        this.pos.x = GE.personaje.pos.x;
                        this.velocidad = GE.personaje.velocidad;
                        this.persiguiendo=false;
                        this.agarrado=true;
                    }
                }else{
                    this.pos.x += this.velocidad;
                }
                
            }else if(this.pos.x > GE.personaje.pos.x){

                if(this.acelerando==true ){

                    if(this.esperaCambio<=0){
                        this.esperaCambio=this.totalEsperaCambio;
                        this.acelerando=false;
                        this.frenando=true;
                    }
                }else{
                    this.esperaCambio=this.totalEsperaCambio;
                    this.frenando=true;
                
                }

                if(this.frenando){

                    if(this.velocidad > this.velocidadMinima){
                        this.velocidad-=this.aceleracion;
                        if(this.velocidad<this.velocidadMinima){
                            this.velocidad=this.velocidadMinima;
                        }
                    }

                    this.pos.x += this.velocidad;
                    if(this.pos.x < GE.personaje.pos.x){
                        this.pos.x = GE.personaje.pos.x;
                        this.velocidad = GE.personaje.velocidad;
                        this.persiguiendo=false;
                        this.agarrado=true;
                    }
                }else{
                    this.pos.x += this.velocidad;
                }
            }else{
                    this.pos.x += this.velocidad;
                }
        }else{
            this.pos.x += this.velocidad;
            if(this.pos.x != GE.personaje.pos.x){
                this.agarrado=false;
                this.persiguiendo=true;
                this.esperaCambio=this.totalEsperaCambio;
            }
        }
        
        if(this.pos.x == GE.personaje.pos.x && GE.personaje.energy>0){
            GE.personaje.energy -= this.absorver;
        }
    }

	this.physBody.SetPosition(this.pos);
    this.pos=this.physBody.GetPosition();
    
    var deltaTime = ((new Date()).getTime()-this.animStartTime);			//numero de milisegundos que pasaron desde la ultima actualizacion.
	if(this.aturdido){
		this.currSpriteName = gAnimController.getFrameSprite('EnemigoAturdido', deltaTime);
	}else{
		this.currSpriteName = "carroEnemigo";
	}
    
}

EnemyClass.prototype.aturdir = function(){

    this.aturdido=true;
	
	//TODO: validar que la posición a transportar sea valida y no exista un enemigo.
	this.pos.y += Math.floor((Math.random() * 5) - 2) * 32;
	this.physBody.SetPosition(this.pos);
	this.pos=this.physBody.GetPosition();
	
    this.tiempoAturdido = 60;

    this.animStartTime = (new Date()).getTime();
    
}