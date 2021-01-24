var modelo = require("./modelo.js");

describe("El juego del impostor", function() {
    var juego;
    //var usr;
    var nick;

    beforeEach(function() {
        juego = new modelo.Juego(4);
        //usr=new modelo.Usuario("Pepe");
        nick = "Pepe";
    });

    it("comprobar valores iniciales del juego", function() {
        expect(Object.keys(juego.partidas).length).toEqual(0);
        expect(nick).toEqual("Pepe");
        expect(juego).not.toBe(undefined);
    });

    describe("el usr Pepe crea una partida de 4 jugadores", function() {
        var codigo;
        beforeEach(function() {
            codigo = juego.crearPartida(4, nick);
        });
        it("se comprueba la partida", function() {
            //  expect(codigo).not.toBe(undefined);
            expect(4 >= juego.min).toBe(true);
            var codigo = juego.crearPartida(4, nick);
            expect(codigo).not.toEqual("fallo");
            var codigo = juego.crearPartida(10, nick);
            expect(codigo).not.toEqual("fallo");
            expect(juego.partidas[codigo].nickOwner).toEqual(nick);
            expect(juego.partidas[codigo].maximo).toEqual(10);
            expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
            var num = Object.keys(juego.partidas[codigo].usuarios).length;
            expect(num).toEqual(1);
        });

        it("comprobar que no supera los limites <4 >10", function() {
            var codigo = juego.crearPartida(3, nick);
            expect(codigo).toEqual("fallo");
            expect(Object.keys(juego.partidas).length).toEqual(1);

            codigo = juego.crearPartida(11, nick);
            expect(codigo).toEqual("fallo");
            expect(Object.keys(juego.partidas).length).toEqual(1);

        });
        it("No se puede crear partida si no se pone el num o el nick", function() {
            juego = new modelo.Juego();

            // Sin nick
            var codigo = juego.crearPartida(3, );
            expect(codigo).toEqual("fallo");
            expect(Object.keys(juego.partidas).length).toEqual(0);

            // Sin num ni nick
            var codigo = juego.crearPartida();
            expect(codigo).toEqual("fallo");
            expect(Object.keys(juego.partidas).length).toEqual(0);
        });
        it("varios usuarios se unen a la partida", function() {
            juego.unirAPartida(codigo, "ana");
            var num = Object.keys(juego.partidas[codigo].usuarios).length;
            expect(num).toEqual(2);
            expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
            juego.unirAPartida(codigo, "isa");
            var num = Object.keys(juego.partidas[codigo].usuarios).length;
            expect(num).toEqual(3);
            expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
            juego.unirAPartida(codigo, "tomas");
            var num = Object.keys(juego.partidas[codigo].usuarios).length;
            expect(num).toEqual(4);
            expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
        });

        it("Pepe inicia la partida", function() {
            juego.unirAPartida(codigo, "ana");
            var num = Object.keys(juego.partidas[codigo].usuarios).length;
            expect(num).toEqual(2);
            expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
            juego.unirAPartida(codigo, "isa");
            var num = Object.keys(juego.partidas[codigo].usuarios).length;
            expect(num).toEqual(3);
            expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
            juego.unirAPartida(codigo, "tomas");
            var num = Object.keys(juego.partidas[codigo].usuarios).length;
            expect(num).toEqual(4);
            expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
            //usr.iniciarPartida();
            juego.iniciarPartida(nick, codigo);
            expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
            // Comprobar que tienen tareas y el número de impostores
            var nImpostores = 0;
            for (i in juego.partidas[codigo].usuarios) {
                expect(juego.partidas[codigo].usuarios[i].encargo).not.toEqual("ninguno");
                if (juego.partidas[codigo].usuarios[i].impostor == true) {
                    nImpostores++;
                }
            }

            expect(nImpostores == juego.partidas[codigo].numeroImpostores).toBe(true);
        });
        it("abandonar partida", function() {
            juego.unirAPartida(codigo, "ana");
            var num = Object.keys(juego.partidas[codigo].usuarios).length;
            expect(num).toEqual(2);
            expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
            juego.unirAPartida(codigo, "isa");
            var num = Object.keys(juego.partidas[codigo].usuarios).length;
            expect(num).toEqual(3);
            expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
            juego.unirAPartida(codigo, "tomas");
            var num = Object.keys(juego.partidas[codigo].usuarios).length;
            expect(num).toEqual(4);
            expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
            //usr.iniciarPartida();
            //expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");		
            var partida = juego.partidas[codigo];
            partida.usuarios["tomas"].abandonarPartida();
            expect(partida).not.toBe(undefined);
            expect(partida.numeroJugadores()).toEqual(3);

            expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
            partida.usuarios["isa"].abandonarPartida();
            expect(partida).not.toBe(undefined);
            expect(partida.numeroJugadores()).toEqual(2);
            partida.usuarios["ana"].abandonarPartida();
            expect(partida).not.toBe(undefined);
            expect(partida.numeroJugadores()).toEqual(1);
            partida.usuarios["Pepe"].abandonarPartida();
            expect(partida.numeroJugadores()).toEqual(0);
            juego.eliminarPartida(codigo);
            expect(juego.partidas[codigo]).toBe(undefined)
        });

        describe("las votaciones", function() {
            beforeEach(function() {
                juego.unirAPartida(codigo, "ana");
                juego.unirAPartida(codigo, "isa");
                juego.unirAPartida(codigo, "tomas");
                juego.iniciarPartida(nick, codigo);
            });

            it("todos skipean", function() {
                var partida = juego.partidas[codigo];
                juego.lanzarVotacion(nick, codigo);
                expect(partida.fase.nombre).toEqual("votacion");

                juego.saltarVoto(nick, codigo);
                expect(partida.fase.nombre).toEqual("votacion");
                expect(juego.partidas[codigo].usuarios["Pepe"].haVotado).toBe(true);
                expect(juego.partidas[codigo].usuarios["Pepe"].skip).toBe(true);
                juego.saltarVoto("ana", codigo);
                expect(partida.fase.nombre).toEqual("votacion");
                expect(juego.partidas[codigo].usuarios["ana"].haVotado).toBe(true);
                expect(juego.partidas[codigo].usuarios["ana"].skip).toBe(true);
                juego.saltarVoto("isa", codigo);
                expect(partida.fase.nombre).toEqual("votacion");
                expect(juego.partidas[codigo].usuarios["isa"].haVotado).toBe(true);
                expect(juego.partidas[codigo].usuarios["isa"].skip).toBe(true);
                juego.saltarVoto("tomas", codigo);
                expect(partida.fase.nombre).toEqual("jugando");
                expect(juego.partidas[codigo].usuarios["tomas"].haVotado).toBe(true);
                expect(juego.partidas[codigo].usuarios["tomas"].skip).toBe(true);

                expect(juego.partidas[codigo].masVotado()).toBe(undefined);
                juego.partidas[codigo].finalVotacion();
                for (key in juego.partidas[codigo].usuarios) {
                    expect(juego.partidas[codigo].usuarios[key].estadoVivo()).toBe(true);
                }
                expect(juego.partidas[codigo].fase.esJugando()).toBe(true);

            });
            it("se le olvida votar a  uno de los jugadores ", function() {
                var partida = juego.partidas[codigo];
                juego.lanzarVotacion(nick, codigo);
                expect(partida.fase.nombre).toEqual("votacion");
                juego.saltarVoto(nick, codigo);
                expect(juego.partidas[codigo].usuarios["Pepe"].haVotado).toBe(true);
                expect(juego.partidas[codigo].usuarios["Pepe"].skip).toBe(true);
                expect(partida.fase.nombre).toEqual("votacion");
                juego.saltarVoto("ana", codigo);
                expect(juego.partidas[codigo].usuarios["ana"].haVotado).toBe(true);
                expect(juego.partidas[codigo].usuarios["ana"].skip).toBe(true);
                expect(partida.fase.nombre).toEqual("votacion");
                juego.saltarVoto("isa", codigo);
                expect(juego.partidas[codigo].usuarios["isa"].haVotado).toBe(true);
                expect(juego.partidas[codigo].usuarios["isa"].skip).toBe(true);
                expect(partida.fase.nombre).toEqual("votacion");

                expect(juego.partidas[codigo].fase.esVotando()).toBe(true);
                expect(juego.partidas[codigo].masVotado()).toBe(undefined);

                expect(juego.partidas[codigo].usuarios["tomas"].haVotado).not.toBe(true);
                expect(juego.partidas[codigo].usuarios["tomas"].skip).not.toBe(true);
                juego.saltarVoto("tomas", codigo);

                expect(juego.partidas[codigo].masVotado()).toBe(undefined);
                juego.partidas[codigo].finalVotacion();
                for (key in juego.partidas[codigo].usuarios) {
                    expect(juego.partidas[codigo].usuarios[key].estadoVivo()).toBe(true);
                }
                expect(juego.partidas[codigo].fase.esJugando()).toBe(true);

            });

            it("se vota y mata a un inocente", function() {
                var partida = juego.partidas[codigo];
                juego.lanzarVotacion(nick, codigo);

                partida.usuarios[nick].impostor = true;
                partida.usuarios["ana"].impostor = false;
                partida.usuarios["isa"].impostor = false;
                partida.usuarios["tomas"].impostor = false;

                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(nick, codigo, "tomas");
                expect(partida.fase.nombre).toEqual("votacion");
                expect(juego.partidas[codigo].usuarios["Pepe"].haVotado).toBe(true);
                juego.votar("ana", codigo, "tomas");
                expect(partida.fase.nombre).toEqual("votacion");
                expect(juego.partidas[codigo].usuarios["ana"].haVotado).toBe(true);
                juego.votar("isa", codigo, "tomas");
                expect(partida.fase.nombre).toEqual("votacion");
                expect(juego.partidas[codigo].usuarios["isa"].haVotado).toBe(true);
                juego.votar("tomas", codigo, "isa");
                expect(juego.partidas[codigo].usuarios["tomas"].haVotado).toBe(true);
                expect(partida.usuarios["tomas"].estado.nombre).toEqual("muerto");

                expect(juego.partidas[codigo].fase.esJugando()).toBe(true);
            });

            it("se vota y mata al impostor, la partida termina", function() {
                var partida = juego.partidas[codigo];
                juego.lanzarVotacion(nick, codigo);

                partida.usuarios[nick].impostor = true;
                partida.usuarios["ana"].impostor = false;
                partida.usuarios["isa"].impostor = false;
                partida.usuarios["tomas"].impostor = false;

                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(nick, codigo, "tomas");
                expect(partida.fase.nombre).toEqual("votacion");
                expect(juego.partidas[codigo].usuarios["Pepe"].haVotado).toBe(true);
                juego.votar("ana", codigo, nick);
                expect(partida.fase.nombre).toEqual("votacion");
                expect(juego.partidas[codigo].usuarios["ana"].haVotado).toBe(true);
                juego.votar("isa", codigo, nick);
                expect(partida.fase.nombre).toEqual("votacion");
                expect(juego.partidas[codigo].usuarios["isa"].haVotado).toBe(true);
                juego.votar("tomas", codigo, nick);
                expect(juego.partidas[codigo].usuarios["tomas"].haVotado).toBe(true);
                expect(partida.usuarios[nick].estado.nombre).toEqual("muerto");
                expect(partida.fase.nombre).toEqual("final");
            });

            it("impostor ataca a todos y gana", function() {
                //atacar y comprobar
                var partida = juego.partidas[codigo];

                partida.usuarios[nick].impostor = true;
                partida.usuarios["ana"].impostor = false;
                partida.usuarios["isa"].impostor = false;
                partida.usuarios["tomas"].impostor = false;

                juego.atacar(nick, codigo, "ana");
                expect(partida.usuarios["ana"].estado.nombre).toEqual("muerto");
                expect(partida.fase.nombre).toEqual("jugando");
                juego.atacar(nick, codigo, "isa");
                expect(partida.usuarios["isa"].estado.nombre).toEqual("muerto");
                expect(partida.fase.nombre).toEqual("final");
            });

            it("realizar tareas", function() {
                var partida = juego.partidas[codigo];
                expect(partida.obtenerPercentGlobal()).toEqual(0);
                for (var i = 0; i < 9; i++) {
                    for (var key in partida.usuarios) {

                        partida.usuarios[key].realizarTarea();
                    }
                    expect(partida.fase.nombre).toEqual("jugando");
                    expect(partida.obtenerPercentGlobal()).toEqual((i + 1) * 100 / 10);
                }
                for (var key in partida.usuarios) {
                    partida.usuarios[key].realizarTarea();
                }
                expect(partida.obtenerPercentGlobal()).toEqual(100);
                expect(partida.fase.nombre).toEqual("final");
            });
            it("enviar mensaje", function() {
                var partida = juego.partidas[codigo];
                juego.enviarMensaje(codigo, nick, "hola mundo");
                expect(partida.fase.nombre).toEqual("jugando");
                expect(juego.partidas[codigo].mensajes).toEqual(['' + nick + '', 'hola mundo']);
            });
        })
    });
})