CamaraClass = function(camSize, target) {

    // Tamanio de la camara, deberia ser siempre del mismo tamanio que el canvas
    this.size = { h: camSize.h, w: camSize.w };

    //la posición de la camara la ubicamos por defecto en el centro del mundo
    this.pos = { x: this.size.w / 2, y: this.size.h / 2 };

    //Valor calculado que se deben desplazar los sprites, para ajustarse a la porción visible de la camara
    this.offset = { "x": 0, "y": 0 };

    //Booleano que indica si la camara sigue un objetivo
    this.perseguir = false;

    // Objeto de tipo entity, que seguirá la camara si el atributo perseguir es true
    this.objetivo = null;

    // Pixeles de libertad que se le permiten al objetivo sobre la camara, 
    // La camara solo se mueve si la diferencia entre las posiciones es mayor a este valor, para cada componente.
    this.libertadObjetivo = { "x": 0, "y": 64 };

    //Limite de movimiento de la camara, permite indicar la maxima distancia en X y Y a la que se puede mover la camara
    //Actualmente no soporta valores inferiores a 0. 
    this.limite = { "x": 320000, "y": 1100 };

    //Parametro que indica si se deben pintar los margenes de la camara
    this.debug = false;

    if (target != null) {
        this.perseguir = true;
        this.objetivo = target;
    }

    //this.limite = { x: this.size.h / 2, y: this.size.w / 2 };

}

CamaraClass.prototype.constructor = CamaraClass;


CamaraClass.prototype.update = function() {

    if (this.perseguir == true) {

        if (Math.abs(this.objetivo.pos.x - this.pos.x) > this.libertadObjetivo.x) {

            if (this.objetivo.pos.x - this.pos.x > 0) {
                this.pos.x += (this.objetivo.pos.x - this.pos.x - this.libertadObjetivo.x);
            } else {
                this.pos.x += (this.objetivo.pos.x - this.pos.x + this.libertadObjetivo.x);
            }

        }

        if (this.pos.x < this.size.w / 2) {
            this.pos.x = this.size.w / 2;
        }
        if (this.pos.x > this.limite.x) {
            this.pos.x = this.limite.x;
        }

        if (Math.abs(this.objetivo.pos.y - this.pos.y) > this.libertadObjetivo.y) {

            if (this.objetivo.pos.y - this.pos.y > 0) {
                this.pos.y += (this.objetivo.pos.y - this.pos.y - this.libertadObjetivo.y);
            } else {
                this.pos.y += (this.objetivo.pos.y - this.pos.y + this.libertadObjetivo.y);
            }

        }

        if (this.pos.y < this.size.h / 2) {
            this.pos.y = this.size.h / 2;
        }
        if (this.pos.y > this.limite.y) {
            this.pos.y = this.limite.y;
        }

        this.offset = { "x": (this.pos.x - (this.size.w / 2)), "y": (this.pos.y - (this.size.h / 2)) };

    }

}

CamaraClass.prototype.seguir = function(target) {

    this.perseguir = true;
    this.objetivo = target;
    this.pos = { "x": this.objetivo.pos.x, "y": this.objetivo.pos.y };

    this.update();

}

// Deja de seguir al objetivo actual, se debe posicionar la camara
CamaraClass.prototype.noSeguir = function(nuevaPos) {

    this.perseguir = false;
    this.objetivo = null;

    this.pos.x = nuevaPos.x;
    this.pos.y = nuevaPos.y;

    //Actualizamos el offset con la nueva posicion estatica
    this.offset = { "x": 0, "y": 0 };
    //this.update();

}

CamaraClass.prototype.drawDebugCamara = function() {

    GE.ctx.strokeStyle = "#00FF00";
    GE.ctx.beginPath();
    //Centro de la camara
    GE.ctx.arc(this.pos.x - this.offset.x, this.pos.y - this.offset.y, 10, 0, 2 * Math.PI);
    GE.ctx.stroke();

    //Pintamos el recuadro de vision de la camara
    GE.ctx.beginPath();
    GE.ctx.moveTo(this.pos.x - this.offset.x, this.pos.y - this.offset.y);
    GE.ctx.lineTo(this.pos.x - this.offset.x - (this.size.w / 2), this.pos.y - this.offset.y - (this.size.h / 2));
    GE.ctx.lineTo(this.pos.x - this.offset.x + (this.size.w / 2), this.pos.y - this.offset.y - (this.size.h / 2));
    GE.ctx.moveTo(this.pos.x - this.offset.x, this.pos.y - this.offset.y);
    GE.ctx.lineTo(this.pos.x - this.offset.x + (this.size.w / 2), this.pos.y - this.offset.y - (this.size.h / 2));
    GE.ctx.lineTo(this.pos.x - this.offset.x + (this.size.w / 2), this.pos.y - this.offset.y + (this.size.h / 2));
    GE.ctx.moveTo(this.pos.x - this.offset.x, this.pos.y - this.offset.y);
    GE.ctx.lineTo(this.pos.x - this.offset.x + (this.size.w / 2), this.pos.y - this.offset.y + (this.size.h / 2));
    GE.ctx.lineTo(this.pos.x - this.offset.x - (this.size.w / 2), this.pos.y - this.offset.y + (this.size.h / 2));
    GE.ctx.moveTo(this.pos.x - this.offset.x, this.pos.y - this.offset.y);
    GE.ctx.lineTo(this.pos.x - this.offset.x - (this.size.w / 2), this.pos.y - this.offset.y + (this.size.h / 2));
    GE.ctx.lineTo(this.pos.x - this.offset.x - (this.size.w / 2), this.pos.y - this.offset.y - (this.size.h / 2));

    //Pintamos el recuadro de libertad del objetivo
    GE.ctx.moveTo(this.pos.x - this.offset.x - this.libertadObjetivo.x, this.pos.y - this.offset.y - this.libertadObjetivo.y);
    GE.ctx.lineTo(this.pos.x - this.offset.x + this.libertadObjetivo.x, this.pos.y - this.offset.y - this.libertadObjetivo.y);
    GE.ctx.lineTo(this.pos.x - this.offset.x + this.libertadObjetivo.x, this.pos.y - this.offset.y + this.libertadObjetivo.y);
    GE.ctx.lineTo(this.pos.x - this.offset.x - this.libertadObjetivo.x, this.pos.y - this.offset.y + this.libertadObjetivo.y);
    GE.ctx.lineTo(this.pos.x - this.offset.x - this.libertadObjetivo.x, this.pos.y - this.offset.y - this.libertadObjetivo.y);

    //.arc(this.pos.x - this.offset.x, this.pos.y - this.offset.y, 10, 0, 2 * Math.PI);
    GE.ctx.stroke();

}