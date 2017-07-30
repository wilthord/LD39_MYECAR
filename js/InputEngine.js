//Se declaran las "constantes" para el control de acciones
MOV_ARRIBA = 'move-up';
MOV_IZQUIERDA = 'move-left';
MOV_ABAJO = 'move-down';
MOV_DERECHA = 'move-right';

ACELERAR = 'ACELERAR';

ACT_DISPARA = 'dispara';

CLICK = 'Click';

InputEngineClass = function(){

	// Diccionario con la relación entre las teclas y la acción
	this.bindings = {};

	// Diccionario con las acciones que se han enviado para ejecutar
	this.actions = {};

	// Posición del mouse
	this.mouse = {
		x: 0,
		y: 0
	};

}

InputEngineClass.prototype.constructor = InputEngineClass;

//-----------------------------
InputEngineClass.prototype.setup = function () {
	// Se asocian las teclas W, A, S, D a las acciones respectivas
	gInputEngine.bind(87, MOV_ARRIBA);
	gInputEngine.bind(65, MOV_IZQUIERDA);
	gInputEngine.bind(83, MOV_ABAJO);
	gInputEngine.bind(68, MOV_DERECHA);
	//Barra espaciadora para acelerar
	gInputEngine.bind(32, ACELERAR);
	gInputEngine.bind(CLICK, CLICK);

	// Se agregan los listeners para los eventos de ingreso
	document.getElementById(GE.nombreCanvas).addEventListener('mousemove', gInputEngine.onMouseMove);
	document.getElementById(GE.nombreCanvas).addEventListener("mousedown", gInputEngine.onMouseDown);
	document.getElementById(GE.nombreCanvas).addEventListener("mouseup", gInputEngine.onMouseUP);
	document.addEventListener('keydown', gInputEngine.onKeyDown);
	document.addEventListener('keyup', gInputEngine.onKeyUp);
}

//-----------------------------
InputEngineClass.prototype.onMouseMove = function (event) {
	var rect = GE.canvasObj.getBoundingClientRect();
	gInputEngine.mouse.x = event.clientX-rect.left;
	gInputEngine.mouse.y = event.clientY-rect.top;
}

//-----------------------------
InputEngineClass.prototype.onKeyDown = function (event) {
	// Se obtiene la accion relacionada a la tecla presionada
	//alert(event.keyCode);
	var action = gInputEngine.bindings[event.keyCode];

	//Si la tecla presionada se encuentra mapeada
	if (action) {
		// Se marca la acción como true, mientras esté en true se ejecutará la acción
		gInputEngine.actions[action] = true;
	}
	
}

//-----------------------------
InputEngineClass.prototype.onMouseDown = function () {
	// Se obtiene la accion relacionada a presionar el click
	var action = gInputEngine.bindings[CLICK];

	//Si la acción está mapeada
	if (action) {
		// Se marca la acción como true, mientras esté en true se ejecutará la acción
		gInputEngine.actions[action] = true;
	}
},

InputEngineClass.prototype.onMouseUP = function () {
	// Se obtiene la accion relacionada a liberar el click
	var action = gInputEngine.bindings[CLICK];

	//Si la acción está mapeada
	if (action) {
		// Se marca la acción como false.
		gInputEngine.actions[action] = false;
	}
}

//-----------------------------
InputEngineClass.prototype.onKeyUp= function (event) {
	
	// Se obtiene la accion relacionada a la tecla liberada
	var action = gInputEngine.bindings[event.keyCode];

	//Si la tecla presionada se encuentra mapeada
	if (action) {
		// Se marca la acción como false, no se realizará mas la acción
		gInputEngine.actions[action] = false;
	}
}

// Metodo que permite mapear una tecla con una acción
InputEngineClass.prototype.bind= function (key, action) {
	gInputEngine.bindings[key] = action;
}

gInputEngine = new InputEngineClass();