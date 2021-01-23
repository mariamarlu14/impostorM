function ClienteWS() {
    this.socket = undefined;
    this.nick = undefined;
    this.codigo = undefined;
    this.owner = false;
    this.numJugador = undefined;
    this.impostor;
    this.estado;
    this.encargo;
    this.ini = function() {
        this.socket = io.connect();
        this.lanzarSocketSrv();
    }
    this.crearPartida = function(nick, numero) {
        this.nick = nick;
        this.socket.emit("crearPartida", nick, numero); //{"nick":nick,"numero":numero}
    }
    this.unirAPartida = function(nick, codigo) {
        //this.nick=nick;
        this.socket.emit("unirAPartida", nick, codigo);
    }
    this.iniciarPartida = function() {
        this.socket.emit("iniciarPartida", this.nick, this.codigo);
    }
    this.listaPartidasDisponibles = function() {
        this.socket.emit("listaPartidasDisponibles");
    }
    this.listaPartidas = function() {
        this.socket.emit("listaPartidas");
    }
    this.estoyDentro = function() {
        this.socket.emit("estoyDentro", this.nick, this.codigo);
    }
    this.lanzarVotacion = function() {
        this.socket.emit("lanzarVotacion", this.nick, this.codigo);
    }
    this.saltarVoto = function() {
        this.socket.emit("saltarVoto", this.nick, this.codigo);
    }
    this.votar = function(sospechoso) {
        this.socket.emit("votar", this.nick, this.codigo, sospechoso);
    }
    this.obtenerEncargo = function() {
        this.socket.emit("obtenerEncargo", this.nick, this.codigo);
    }
    this.atacar = function(inocente) {
        this.socket.emit("atacar", this.nick, this.codigo, inocente);
    }
    this.movimiento = function(direccion, x, y) {
        var datos = { nick: this.nick, codigo: this.codigo, numJugador: this.numJugador, direccion: direccion, x: x, y: y };
        this.socket.emit("movimiento", datos);
    }
    this.realizarTarea = function() {
        this.socket.emit("realizarTarea", this.nick, this.codigo);
    }
    this.abandonarPartida = function() {
        this.socket.emit("abandonarPartida", this.nick, this.codigo);
    }
    this.enviarMensaje = function(mensaje) {
        this.socket.emit("enviarMensaje", this.nick, this.codigo, mensaje);
    }

    //servidor WS dentro del cliente
    this.lanzarSocketSrv = function() {
        var cli = this;
        this.socket.on('connect', function() {
            console.log("conectado al servidor de WS");
        });
        this.socket.on('partidaCreada', function(data) {
            cli.codigo = data.codigo;
            console.log(data);
            if (data.codigo != "fallo") {
                cli.owner = true;
                cli.numJugador = 0;
                cli.estado = "vivo";
                cw.mostrarEsperandoRival();
                cw.mostrarAbandonarPartida();


            }
        });
        this.socket.on('unidoAPartida', function(data) {
            cli.codigo = data.codigo;
            cli.nick = data.nick;
            cli.numJugador = data.numJugador;
            cli.estado = "vivo";
            console.log(data);
            cw.mostrarEsperandoRival();
            cw.mostrarAbandonarPartida();



        });
        this.socket.on('nuevoJugador', function(lista) {
            //console.log(nick+" se une a la partida");
            cw.mostrarListaJugadores(lista);
            //cli.iniciarPartida();
        });
        this.socket.on('partidaIniciada', function(fase) {
            console.log("Partida en fase: " + fase);
            if (fase == "jugando") {
                cli.obtenerEncargo();

                // cw.mostrarChat();

                cw.limpiar();
                lanzarJuego();

            }
        });
        this.socket.on('recibirListaPartidasDisponibles', function(lista) {
            console.log(lista);
            //cw.mostrarUnirAPartida(lista);
            if (!cli.codigo) {
                cw.mostrarListaPartidas(lista);
            }
        });
        this.socket.on('recibirListaPartidas', function(lista) {
            console.log(lista);
        });
        this.socket.on('dibujarRemoto', function(lista) {
            console.log(lista);
            for (var i = 0; i < lista.length; i++) {
                if (lista[i].nick != cli.nick) {
                    lanzarJugadorRemoto(lista[i].nick, lista[i].numJugador);
                }
            }
            crearColision();
        });
        this.socket.on("moverRemoto", function(datos) {
            mover(datos);
        })
        this.socket.on("votacion", function(lista) {
            console.log(lista);
            cw.mostrarModalVotacion(lista);
        });
        this.socket.on("finalVotacion", function(data) {
            console.log(data);
            //cw.cerrarModal()
            $('#modalGeneral').modal('toggle');
            //mostrar otro modal
            cw.mostrarModalSimple(data.elegido);
        });
        this.socket.on("haVotado", function(data) {
            console.log(data);
            //actualizar la lista
        });
        this.socket.on("recibirEncargo", function(data) {
            console.log(data);
            cli.impostor = data.impostor;
            cli.encargo = data.encargo;
            if (data.impostor) {
                //$('#avisarImpostor').modal("show");
                cw.mostrarModalSimple('eres el impostor');
                //crearColision();
            }
        });
        this.socket.on("final", function(data) {
            console.log(data);
            finPartida(data);
        });
        this.socket.on("finTarea", function(data) {
            //console.log("Porcentaje global" + data);
            cw.mostrarBarraTareas(data);
        });
        this.socket.on("realizadaTarea", function(data) {
            //console.log("Porcentaje individual" + data);
            cw.mostrarBarraTareasIndividual(data);
        });
        this.socket.on("finEnvio", function(data) {
            // console.log("asdsasadds" + data.global);
            cw.mostrarEnviar();

            cw.mostrarChat(data);
        });
        this.socket.on("muereInocente", function(inocente) {
            console.log('muere ' + inocente);
            if (cli.nick == inocente) {
                cli.estado = "muerto";
            }
            dibujarMuereInocente(inocente);
        });
        this.socket.on("tareaRealizada", function(data) {
            console.log(data);
            // cw.mostrarBarraTareasIndividual(data);

            //tareasOn=true;
        });
        this.socket.on("hasAtacado", function(fase) {
            if (fase == "jugando") {
                ataquesOn = true;
            }
        });
    }

    this.ini();
}

var ws2, ws3, ws4;

function pruebasWS() {
    ws2 = new ClienteWS();
    ws3 = new ClienteWS();
    ws4 = new ClienteWS();
    var codigo = ws.codigo;

    ws2.unirAPartida("Juani", codigo);
    ws3.unirAPartida("Juana", codigo);
    ws4.unirAPartida("Juanan", codigo);

    //ws.iniciarPartida();
}

function saltarVotos() {
    ws.saltarVoto();
    ws2.saltarVoto();
    ws3.saltarVoto();
    ws4.saltarVoto();
}

function encargos() {
    ws.obtenerEncargo();
    ws2.obtenerEncargo();
    ws3.obtenerEncargo();
    ws4.obtenerEncargo();
}