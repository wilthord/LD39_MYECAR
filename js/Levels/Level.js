LevelClass = function(ident, nomLevel){
	this.id = ident;
	this.nombre = nomLevel;

	this.mapa = null;

	this.entidades = [];
}

LevelClass.prototype.constructor = LevelClass;

//Recibe el objeto entidad parseado del Niveles.json
LevelClass.prototype.agregarEntidad = function(entidadJson){
	this.entidades.push(entidadJson);
}