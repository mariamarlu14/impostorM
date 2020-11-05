function ClienteWS(){
	this.socket;
	this.nick;
	this.codigo;
	this.crearPartida=function(nick,numero){
		this.nick=nick;
		this.socket.emit("crearPartida",nick,numero);
	}
	this.unirAPartida=function(nick,codigo){
		this.nick=nick;
		this.socket.emit("unirAPartida",nick,codigo);
	}
	this.inicarPartida=function(nick,codigo){
		this.socket.emit("iniciarPartida",nick,codigo);
	}

	this.listaPartidasDisponibles=function(){
		this.socket.emit("listaPartidas");
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
				cli.codigo=data.codigo;
				console.log(data);

			});
			this.socket.on('unidoAPartida',function(data){
				cli.codigo=data.codigo;
				console.log(data);
			});
			this.socket.on('nuevoJugador',function(nick){
				console.log(nick+"se une a la partida");
			});
			this.socket.on('partidaIniciada',function(fase){
				console.log(fase);
			});
			this.socket.on('recibirListaPartidasDisponibles',function(lista){
				console.log(lista);
			});
	}
	this.ini();

}

function pruebasWS(){
	var w2=new ClienteWS();
	var w3=new ClienteWS();
	var w4=new ClienteWS();
	var codigo=ws.codigo();

	w2.unirAPartida("Juani",codigo);
	w3.unirAPartida("Juan",codigo);
	w4.unirAPartida("Juanita",codigo);

}