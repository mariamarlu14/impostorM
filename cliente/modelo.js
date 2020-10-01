function Juego(){
	this.partidas={};//que coleccion?
	this.crearPartida=function(num,owner){
		let codigo=this.obtenerCodigo();
		if(!this.partidas[codigo]){
			this.partidas[codigo]=new Partida(num,owner);
		}
	}
	this.unirPartida=function(){

	}
	this.obtenerCodigo=function(){
		let cadena="ABCDEFGHIJKLMNOPQRSTUVXYZ";
		let letras=cadena.split('');
		let codigo=[];
		for(i=0;i<6;i++){
			codigo.push(letras[randomInt(1,25)-1]);
		}
		return codigo.join('');
	}
}

function Partida(num,owner){
	this.maximo=num;
	this.owner=owner;
	this.usuarios=[]; //el index 0 será el owner
	//this.usuario={} //versión array asociativo o diccionario
	this.agregarUsuario=function(nick){
		//comprobar nick unico
		//comprobar si maximo
	}

	this.agregarUsuario(owner);
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}
