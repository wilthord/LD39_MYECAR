GUIActionsClass = function() {
    this.acciones = {};
}

GUIActionsClass.prototype.constructor = GUIActionsClass;

GUIActionsClass.prototype.aumentarNivel = function() {
    GE.nivelActual++;
    gInputEngine.actions[CLICK] = false;
    //GE.isGUI = false;
}

GUIActionsClass.prototype.disminuirNivel = function() {
    GE.nivelActual--;
    gInputEngine.actions[CLICK] = false;
    //GE.isGUI = false;
}

GUIActionsClass.prototype.iniciarNivel = function() {
    gInputEngine.actions[CLICK] = false;
    //gSM.playSound("jump", { loop: true, vol: 1 });
    GE.isGUI = false;
    GE.nuevoNivel();
}

GUIControl = new GUIActionsClass();
GUIControl.acciones["aumentarNivel"] = GUIControl.aumentarNivel;
GUIControl.acciones["disminuirNivel"] = GUIControl.disminuirNivel;
GUIControl.acciones["iniciarNivel"] = GUIControl.iniciarNivel;