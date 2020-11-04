function ServidorWS(){
	this.enviarRemitente=function(socket,mens,datos){
        this.enviarRemitente=function(socket,mens,datos){
        	        socket.emit(mens,datos);

        }
        this.enviarATodos=function(io,nombre,mens,datos){
        	        io.socket.in(nombre).emit(mens,datos);

        } 
        this.enviarATodosMenosRemitente=function(socket,nombre,mens,datos){
        	        socket.broadcast.to(nombre).emit(mens,datos);

        }

    }


		this.lanzarSocketSrv=function(io,juego){
		var cli=this;
		io.on('connection',function(socket){		    
		    socket.on('crearPartida', function(nick,numero) {
		        console.log('usuario : '+nick+" crea partida : "+numero);
		        var usr=new modelo.Usuario(nick);
				var codigo=juego.crearPartida(numero,usr);
				socket.join(codigo);		        				
		       	cli.enviarRemitente(socket,"partidaCreada",{"codigo":codigo, "owner":nick});		        		        
		    });
		    socket.on('unirAPartida',function(nick,codigo){
				var res=juego.unirAPartida(codigo,nick);
				socket.join(codigo);
				var owner=juego.partidas[codigo].nickOwner;
				cli.enviarRemitente(socket,"unidoAPartida",{"codigo":codigo,"owner":owner});	
				cli.enviarATodos(socket,codigo,"nuevoJugador",nick);	

		    });
		    socket.on('iniciarPartida',function(nick,codigo){
				//cli.enviarATodosr(socket,codigo,"partidaIniciada",fase);	

		    });
		});

		}
}
module.exports.ServidorWS=ServidorWS;