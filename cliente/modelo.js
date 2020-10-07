function Juego(){
	this.partidas={};//que coleccion?
	this.crearPartida=function(num,owner){
		let codigo=this.obtenerCodigo();
		if(!this.partidas[codigo]){
			this.partidas[codigo]=new Partida(num,owner);
		}
	}
	this.unirPartida=function(codigo,nick){

		if(this.partidas[codigo] && Object.keys(this.partidas[codigo].usuarios).length<4){
		this.partidas[codigo].agregarUsuario(nick);
		}
	}
	
	this.obtenerCodigo=function(){
		let cadena="ABCDEFGHIJKLMNOPQRSTUVXYZ";
		let letras=cadena.split('');
		let maxCadena=cadena.length;
		let codigo=[];
		for(i=0;i<6;i++){
			codigo.push(letras[randomInt(1,maxCadena)-1]);
		}
		return codigo.join('');
	}
}

function Partida(num,owner){
	this.maximo=num;
	this.nickOwner=owner;
	this.fase=new Inicial();
	this.usuarios={}; //el index 0 será el owner
	this.agregarUsuario=function(nick){
		this.fase.agregarUsuario(nick,this);
	}
	//this.usuario={} //versión array asociativo o diccionario
	this.puedeAgregarUsuario=function(nick){
		let nuevo=nick;
		let contador=1;

		
			//comprobar si maximo
			while(this.usuarios[nuevo]){
				nuevo=nick+contador;
				contador=contador+1;
			}
			this.usuarios[nuevo]= new Usuario(nuevo);
		
	}

	this.agregarUsuario(owner);
}


function Inicial(){
	this.agregarUsuario=(nick,partida){
		partida.puedeAgregarUsuario(nick);
	}
}

function Jugando(){
this.agregarUsuario=(nick,partida){
		//partida.puedeAgregarUsuario(nick);
	}
}

function Final(){
this.agregarUsuario=(nick,partida){
		//partida.puedeAgregarUsuario(nick);
	}
}

function Usuario(nick){
	this.nick=nick;

}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}
