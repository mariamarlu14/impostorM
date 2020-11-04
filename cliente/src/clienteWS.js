function ClienteWS(){
	this.socket;
	this.crearPartida=function(nick,numero){
		this.socket.emit("crearPartida",nick,numero);
	}
	this.unirAPartida=function(nick,codigo){
		this.socket.emit("unirAPartida",nick,codigo);
	}
	this.inicarPartida=function(nick,codigo){
		this.socket.emit("iniciarPartida",nick,codigo);
	}
	this.ini=function(){
		this.socket=io.connect();
		this.lanzarSocketSrv();
	}
	this.lanzarSocketSrv=function(){
			var cli=this;
			this.socket.on('connect', function(){			
			console.log("conectado al servidor de Ws");
			});

			this.socket.on('partidaCreada', function(data){
				console.log(data);

			});
			this.socket.on('unidoAPartida',function(data){
				console.log(data);
			});
			this.socket.on('nuevoJugador',function(nick){
				console.log(nick+"se une a la partida");
			});
			this.socket.on('partidaIniciada',function(fase){
				console.log(fase);
			});
	}
	this.ini();

}