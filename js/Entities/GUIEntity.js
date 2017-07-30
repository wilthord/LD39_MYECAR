GUIEntityClass = function(GUIJson) {
    EntityClass.call(this);

    this.currSpriteName = GUIJson.spriteName;

    this.pos = { x: GUIJson.xIni, y: GUIJson.yIni };

    this.sizeX = GUIJson.sizeX;

    this.sizeY = GUIJson.sizeY;

    this.GUIAction = GUIJson.GUIAction;
}

GUIEntityClass.prototype = Object.create(EntityClass.prototype);

GUIEntityClass.prototype.constructor = GUIEntityClass;

GUIEntityClass.prototype.update = function() {
    if (gInputEngine.actions[CLICK] && this.GUIAction !== "") {
        if (gInputEngine.mouse.x >= this.pos.x && gInputEngine.mouse.y >= this.pos.y && gInputEngine.mouse.x <= (this.pos.x + this.sizeX) && gInputEngine.mouse.y <= (this.pos.y + this.sizeY)) {
            GUIControl.acciones[this.GUIAction]();
        }
    }
}