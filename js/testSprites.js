ctx = document.getElementById("myCanvas").getContext("2d");

function callbackIniciar(){
	pintarSprite("Cuadro1", 10, 10);
	pintarSprite("Cuadro2", 60, 50);
	pintarSprite("Cuadro3", 10, 50);
	pintarSprite("Cuadro4", 80, 60);
};

loadSprites("img/spriteSheetMap.json", callbackIniciar);