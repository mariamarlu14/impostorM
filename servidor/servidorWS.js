var modelo = require("./modelo.js");

function ServidorWS() {
    this.enviarRemitente = function(socket, mens, datos) {
        socket.emit(mens, datos);
    }
    this.enviarATodos = function(io, nombre, mens, datos) {
        io.sockets.in(nombre).emit(mens, datos);
    }
    this.enviarATodosMenosRemitente = function(socket, nombre, mens, datos) {
        socket.broadcast.to(nombre).emit(mens, datos)
    };
    this.enviarGlobal = function(socket, mens, data) {
        socket.broadcast.emit(mens, data);
    }
    this.lanzarSocketSrv = function(io, juego) {
        var cli = this;
        io.on('connection', function(socket) {
            socket.on('crearPartida', function(nick, numero) {
                //var usr=new modelo.Usuario(nick);
                var codigo = juego.crearPartida(numero, nick);
                socket.join(codigo);
                console.log('usuario: ' + nick + " crea partida codigo: " + codigo);
                cli.enviarRemitente(socket, "partidaCreada", { "codigo": codigo, "owner": nick });
                var lista = juego.listaPartidasDisponibles();
                cli.enviarGlobal(socket, "recibirListaPartidasDisponibles", lista);
            });
            socket.on('unirAPartida', function(nick, codigo) {
                //nick o codigo nulo
                var res = juego.unirAPartida(codigo, nick);
                socket.join(codigo);
                var owner = juego.partidas[codigo].nickOwner;
                console.log("Usuario " + res.nick + " se une a partida " + res.codigo);
                cli.enviarRemitente(socket, "unidoAPartida", res);
                var lista = juego.obtenerListaJugadores(codigo);
                //cli.enviarATodosMenosRemitente(socket,codigo,"nuevoJugador",res.nick);
                cli.enviarATodos(io, codigo, "nuevoJugador", lista);
            });

            socket.on('iniciarPartida', function(nick, codigo) {
                juego.iniciarPartida(nick, codigo);
                var fase = juego.partidas[codigo].fase.nombre;
                if (fase == "jugando") {
                    cli.enviarATodos(io, codigo, "partidaIniciada", fase);
                }
            });

            socket.on('listaPartidasDisponibles', function() {
                var lista = juego.listaPartidasDisponibles();
                cli.enviarRemitente(socket, "recibirListaPartidasDisponibles", lista);
            });

            socket.on('listaPartidas', function() {
                var lista = juego.listaPartidas();
                cli.enviarRemitente(socket, "recibirListaPartidas", lista);
            });

            socket.on('estoyDentro', function(nick, codigo) {
                //var usr=juego.obtenerJugador(nick,codigo);
                //   	var numero=juego.partidas[codigo].usuarios[nick].numJugador;
                //   	var datos={nick:nick,numJugador:numero};
                // cli.enviarATodosMenosRemitente(socket,codigo,"dibujarRemoto",datos)
                var lista = juego.obtenerListaJugadores(codigo);
                cli.enviarRemitente(socket, "dibujarRemoto", lista);
            });

            socket.on('movimiento', function(datos) {
                cli.enviarATodosMenosRemitente(socket, datos.codigo, "moverRemoto", datos);
            });

            socket.on("lanzarVotacion", function(nick, codigo) {
                juego.lanzarVotacion(nick, codigo);
                var partida = juego.partidas[codigo];
                var lista = partida.obtenerListaJugadoresVivos();
                cli.enviarATodos(io, codigo, "votacion", lista);
            });

            socket.on("saltarVoto", function(nick, codigo) {
                var partida = juego.partidas[codigo];
                juego.saltarVoto(nick, codigo);
                if (partida.todosHanVotado()) {
                    var data = { "elegido": partida.elegido, "fase": partida.fase.nombre };
                    cli.enviarATodos(io, codigo, "finalVotacion", data);
                } else {
                    cli.enviarATodos(io, codigo, "haVotado", partida.listaHanVotado());
                }
            });

            socket.on("votar", function(nick, codigo, sospechoso) {
                var partida = juego.partidas[codigo];
                juego.votar(nick, codigo, sospechoso);
                if (partida.todosHanVotado()) {
                    var data = { "elegido": partida.elegido, "fase": partida.fase.nombre };
                    cli.enviarATodos(io, codigo, "finalVotacion", data);
                } else {
                    cli.enviarATodos(io, codigo, "haVotado", partida.listaHanVotado());
                }
            });

            socket.on("obtenerEncargo", function(nick, codigo) {
                var encargo = juego.partidas[codigo].usuarios[nick].encargo;
                var impostor = juego.partidas[codigo].usuarios[nick].impostor;
                cli.enviarRemitente(socket, "recibirEncargo", { "encargo": encargo, "impostor": impostor });
            });

            socket.on("atacar", function(nick, codigo, inocente) {
                juego.atacar(nick, codigo, inocente);
                var partida = juego.partidas[codigo];
                var fase = partida.fase.nombre;
                cli.enviarATodos(io, codigo, "muereInocente", inocente);
                cli.enviarRemitente(socket, "hasAtacado", fase);
                if (fase == "final") {
                    cli.enviarATodos(io, codigo, "final", "ganan impostores");
                }
            });

            socket.on("realizarTarea", function(nick, codigo) {
                var partida = juego.partidas[codigo];
                juego.realizarTarea(nick, codigo);
                var percent = partida.obtenerPercentTarea(nick);
                var global = partida.obtenerPercentGlobal();
                cli.enviarRemitente(socket, "tareaRealizada", { "percent": percent, "goblal": global });
                cli.enviarATodos(io, codigo, "finTarea", global);

                var fase = partida.fase.nombre;
                if (fase == "final") {
                    cli.enviarATodos(io, codigo, "final", "ganan ciudadanos");
                }
            });
            socket.on("abandonarPartida", function(nick, codigo) {
                var partida = juego.partidas[codigo];
                juego.abandonarPartida(nick, codigo);
                var fase = partida.fase.nombre;
                cli.enviarATodos(io, codigo, "jugadorAbandona", nick);
                if (fase != "jugando") {
                    cli.enviarATodos(io, codigo, "final", "abandono");
                } else {
                    socket.leave(codigo);
                }
            });
            socket.on('enviarMensaje', function(nick, codigo, mensaje) {
                var partida = juego.partidas[codigo];
                var mensaje = juego.enviarMensaje(codigo, nick, mensaje);
                console.log(mensaje)
                cli.enviarATodos(io, codigo, "finEnvio", mensaje);

                //socket.join(codigo);
                //console.log('usuario: ' + nick + " envia mensaje al grupo " + codigo + " el mensaje " + mensaje);
                //     cli.enviarATo(socket, "partidaCreada", { "codigo": codigo, "owner": nick });
                // var lista = juego.listaMensajes();
                //  cli.enviarGlobal(socket, "recibirListaPartidasDisponibles", lista);
            });
        });
    }

}

module.exports.ServidorWS = ServidorWS;