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
        if (gInputEngine.mouse.x >= this.pos.x-(this.sizeX/2) && gInputEngine.mouse.y >= this.pos.y-(this.sizeY/2) && gInputEngine.mouse.x <= this.pos.x + (this.sizeX/2) && gInputEngine.mouse.y <= this.pos.y + (this.sizeY/2)) {
            GUIControl.acciones[this.GUIAction]();
        }
    }
}