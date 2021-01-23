function ControlWeb($) {

    this.mostrarCrearPartida = function(min) {
        var cadena = '<div id="mostrarCP"><h3>Crear partida</h3>';
        cadena = cadena + '<div class="form-group">';
        cadena = cadena + '<label for="nick">Nick:</label>';
        cadena = cadena + '<input type="text" class="form-control" id="nick">';
        cadena = cadena + '</div>';
        cadena = cadena + '<div class="form-group">';
        cadena = cadena + '<label for="num">Número:</label>';
        cadena = cadena + '<input type="number" min="' + min + '" max="10" value="' + min + '" class="form-control" id="num">';
        cadena = cadena + '</div>';
        cadena = cadena + '<button type="button" id="btnCrear" class="btn btn-info">Crear partida</button>';
        cadena = cadena + '</div>';



        $('#crearPartida').append(cadena);

        $('#btnCrear').on('click', function() {
            var nick = $('#nick').val();
            var num = $("#num").val();
            $("#mostrarCP").remove();
            ws.crearPartida(nick, num);
        });
    }

    this.mostrarListaPartidas = function(lista) {

        $('#mostrarListaPartidas').remove();
        var cadena = '<div id="mostrarListaPartidas"><h3>Elegir partida</h3>';
        cadena = cadena + '<div class="list-group" id="lista">';
        for (var i = 0; i < lista.length; i++) {
            var maximo = lista[i].maximo;
            var numJugadores = maximo - lista[i].huecos;
            cadena = cadena + '<a href="#" value="' + lista[i].codigo + '" class="list-group-item">' + lista[i].codigo + '<span class="badge">' + numJugadores + '/' + maximo + '</span></a>';
        }
        cadena = cadena + '</div>';
        //cadena=cadena+'</div>';
        cadena = cadena + '<input type="button" class="btn btn-info" id="unirme" value="Unirme">';
        '</div>';

        $('#listaPartidas').append(cadena);
        StoreValue = []; //Declare array
        $(".list-group a").click(function() {
            StoreValue = []; //clear array
            StoreValue.push($(this).attr("value")); // add text to array
        });

        $('#unirme').click(function() {
            var codigo = "";
            codigo = StoreValue[0]; //$("#lista").val();
            console.log(codigo);
            var nick = $('#nick').val();
            if (codigo && nick) {
                $('#mostrarListaPartidas').remove();
                $('#crearPartida').remove();
                ws.unirAPartida(nick, codigo);
            }
        });
    }

    this.mostrarEsperandoRival = function() {
        this.limpiar();
        //$('#mER').remove();
        var cadena = '<div id="mER"><h3>Esperando rival</h3>';
        cadena = cadena + '<img id="gif" src="cliente/img/waiting.jpg"><br>';
        if (ws.owner) {
            cadena = cadena + '<input type="button" class="btn btn-info" id="iniciar" value="Iniciar partida">';
        }
        cadena = cadena + '</div>';
        $('#esperando').append(cadena);
        $('#iniciar').click(function() {
            ws.iniciarPartida();
        });
    }

    this.mostrarUnirAPartida = function(lista) {
        $('#mUAP').remove();
        var cadena = '<div id="mUAP">';
        cadena = cadena + '<div class="list-group">';
        for (var i = 0; i < lista.length; i++) {
            cadena = cadena + '<a href="#" value="' + lista[i].codigo + '" class="list-group-item">' + lista[i].codigo + ' huecos:' + lista[i].huecos + '</a>';
        }
        cadena = cadena + '</div>';
        cadena = cadena + '<button type="button" id="btnUnir" class="btn btn-info">Unir a partida</button>';
        cadena = cadena + '</div>';

        $('#unirAPartida').append(cadena);

        var StoreValue = [];
        $(".list-group a").click(function() {
            StoreValue = []; //clear array
            StoreValue.push($(this).attr("value")); // add text to array
        });

        $('#btnUnir').on('click', function() {
            var nick = $('#nick').val();
            var codigo = StoreValue[0];
            $("#mUAP").remove();
            ws.unirAPartida(nick, codigo);
        });
    }

    this.mostrarListaJugadores = function(lista) {
        $('#mostrarListaEsperando').remove();
        var cadena = '<div id="mostrarListaEsperando"><h3>Lista Jugadores</h3>';
        cadena = cadena + '<ul class="list-group">';
        for (var i = 0; i < lista.length; i++) {
            cadena = cadena + '<li class="list-group-item">' + lista[i].nick + '</li>';
        }
        cadena = cadena + '</ul></div>';
        $('#listaEsperando').append(cadena);
    }
    this.limpiar = function() {
        $('#mUAP').remove();
        $('#mCP').remove();
        $('#mostrarListaPartidas').remove();
        $('#mER').remove();
        $('#mostrarListaEsperando').remove();
    }

    this.mostrarModalSimple = function(msg) {
        this.limpiarModal();
        var cadena = "<p id='avisarImpostor'>" + msg + '</p>';
        $("#contenidoModal").append(cadena);
        $("#pie").append('<button type="button" id="cerrar" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>');
        $('#modalGeneral').modal("show");
    }

    this.mostrarModalTarea = function(tarea) {
        this.limpiarModal();
        var cadena = "<p id='tarea'>" + tarea + '</p>';
        $("#contenidoModal").append(cadena);
        $("#pie").append('<button type="button" id="cerrar" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>');
        $('#modalGeneral').modal("show");
    }

    this.mostrarModalVotacion = function(lista) {
        this.limpiarModal();
        var cadena = '<div id="votacion"><h3>Votación</h3>';
        cadena = cadena + '<div class="input-group">';
        for (var i = 0; i < lista.length; i++) {
            cadena = cadena + '<div><input type="radio" name="optradio" value="' + lista[i].nick + '"> ' + lista[i].nick + '</div>';
        }
        cadena = cadena + '<div><input type="radio" name="optradio" value="-1"> Saltar voto</div>';
        cadena = cadena + '</div>';

        $("#contenidoModal").append(cadena);
        $("#pie").append('<button type="button" id="votar" class="btn btn-secondary" >Votar</button>');
        $('#modalGeneral').modal("show");

        var sospechoso = undefined;
        $('.input-group input').on('change', function() {
            sospechoso = $('input[name=optradio]:checked', '.input-group').val();
        });

        $('#votar').click(function() {
            if (sospechoso != "-1") {
                ws.votar(sospechoso);
            } else {
                ws.saltarVoto();
            }
        });

    }
    this.mostrarAbandonarPartida = function() {
        $('#btnAbandonar').remove();

        var cadena = '<button type="button" class="btn btn-warning" id="btnAbandonar">Abandonar</button>';
        cadena = cadena + '<br>';
        $('#botones').append(cadena);

        $('#btnAbandonar').on('click', function() {
            $('#mER').remove();
            //$('#nuevosJugadores').remove();
            ws.abandonarPartida();
        });
    }
    this.mostrarBarraTareas = function(porcentaje) {
        $('#porcen').remove();

        var cadena = '<div class="progress" id="porcen">';
        cadena = cadena + '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + porcentaje + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + porcentaje + '%">';
        cadena = cadena + '<span class="sr-only">40% completado (éxito)</span>';
        cadena = cadena + '</div>';
        cadena = cadena + '</div>';

        $('#barra').append(cadena);



    }

    this.limpiarModal = function() {
        $('#avisarImpostor').remove();
        $('#tarea').remove();
        $('#cerrar').remove();
        $('#votacion').remove();
        $('#votar').remove();

    }

}