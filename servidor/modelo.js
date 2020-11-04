
function Juego(){
	this.partidas={};
	this.crearPartida=function(num,owner){	
		//comprobar los limites de num
		let codigo=this.obtenerCodigo();
		if (!this.partidas[codigo]){
			this.partidas[codigo]=new Partida(num,owner.nick);
			owner.partida=this.partidas[codigo];
		}
		return codigo;
	}
	this.unirAPartida=function(codigo,nick){
		if (this.partidas[codigo]){
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
	this.usuarios={};
	this.encargos=["jardin","mobiliario","calles","basuras"];
	this.agregarUsuario=function(nick){
		this.fase.agregarUsuario(nick,this)
	}
	this.puedeAgregarUsuario=function(nick){
		let nuevo=nick;
		let contador=1;
		while(this.usuarios[nuevo]){
			nuevo=nick+contador;
			contador=contador+1;
		}
		this.usuarios[nuevo]=new Usuario(nuevo);
		this.usuarios[nuevo].partida=this;
		//this.comprobarMinimo();
	}

	this.puedeIniciarPartida=function(nick){

	}
	this.comprobarMinimo=function(){
		return Object.keys(this.usuarios).length>=4
	}
	this.comprobarMaximo=function(){
		return Object.keys(this.usuarios).length<this.maximo
	}
	this.iniciarPartida=function(){
		this.fase.iniciarPartida(this);
	}
	this.abandonarPartida=function(nick){
		this.fase.abandonarPartida(nick,this);
	}
	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];
	}
	this.asignarTareas=function(nick){

	}
	this.asignarImpostor=function(nick){
		this.juego.partidas[codigo].usuarios[nick].impostor==true;
	}
	this.agregarUsuario(owner);
}

function Inicial(){
	this.nombre="inicial";
	this.agregarUsuario=function(nick,partida){
		partida.puedeAgregarUsuario(nick);
		if (partida.comprobarMinimo()){
			partida.fase=new Completado();
		}		
	}
	this.iniciarPartida=function(partida){
		console.log("Faltan jugadores");
	}
	this.abandonarPartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		//comprobar si no quedan usr
	}
}

function Completado(){
	this.nombre="completado";
	this.iniciarPartida=function(partida){
		
		partida.puedeIniciarPartida();
		//partida.asignarImpostor(nick);
		//partida.iniciarPartida();
		//partida.usuarios.
		//llame a puede iniciar partida();
		//partida.fase=new Jugando();
		//
		//juego.partidas[codigo].usuarios;
		//asignar encargos: se define un array de cadenas
		//se asginan de manera aleaorio mod 4 y se asigna
		//de manera secuencial
		//asignar impostor: true o false
		//de menera aleatoria dado el array(Object.keys)

	}
	this.agregarUsuario=function(nick,partida){
		if (partida.comprobarMaximo()){
			partida.puedeAgregarUsuario(nick);
		}
		else{
			console.log("Lo siento, numero máximo")
		}
	}
	this.abandonarPartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		if (!partida.comprobarMinimo()){
			partida.fase=new Inicial();
		}
	}
}

function Jugando(){
	this.nombre="jugando";
	this.agregarUsuario=function(nick,partida){
		console.log("La partida ya ha comenzado");
	}
	this.iniciarPartida=function(partida){
	}
	this.abandonarPartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		//comprobar si termina la partida
	}
}

function Final(){
	this.final="final";
	this.agregarUsuario=function(nick,partida){
		console.log("La partida ha terminado");
	}
	this.iniciarPartida=function(partida){
	}
	this.abandonarPartida=function(nick,partida){
		//esto es absurdo
	}
}

function Usuario(nick,juego){
	this.nick=nick;
	this.juego=juego;
	this.partida;
	this.impostor=false;
	this.encargo={};
	this.crearPartida=function(num){
		return this.juego.crearPartida(num,this);
	}
	this.iniciarPartida=function(){
		this.partida.iniciarPartida();
	}
	this.abandonarPartida=function(){
		this.partida.abandonarPartida(this.nick);
	}
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

function inicio(){
	juego=new Juego();
	var usr=new Usuario("pepe",juego);
	var codigo=usr.crearPartida(4);

	juego.unirAPartida(codigo,"luis");
	juego.unirAPartida(codigo,"luisa");
	juego.unirAPartida(codigo,"luisito");
	juego.unirAPartida(codigo,"pepe2");
	usr.iniciarPartida();

}



module.exports.Juego=Juego;
module.exports.Usuario=Usuario;