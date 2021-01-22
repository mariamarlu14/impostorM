var fs = require("fs");
var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require("body-parser");
var io = require('socket.io').listen(server);
var modelo=require("./servidor/modelo.js");
var wss=require("./servidor/servidorWS.js");
var servidorWS=new wss.ServidorWS();

<<<<<<< HEAD
var min = process.argv.slice(2);
var test = process.argv.slice(3);
=======
>>>>>>> parent of 428396f... votaciones

app.set('port', process.env.PORT || 5000);
var juego=new modelo.Juego(min,test);

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

<<<<<<< HEAD
=======

var juego=new modelo.Juego();
>>>>>>> parent of 428396f... votaciones

app.get('/', function (request, response) {
    var contenido = fs.readFileSync(__dirname + "/cliente/index.html"); 
    response.setHeader("Content-type", "text/html");
    response.send(contenido);    
});

app.get('/game', function (request, response) {
    var contenido = fs.readFileSync(__dirname + "/cliente/index-game.html");    
    response.setHeader("Content-type", "text/html");
    response.send(contenido);  
});

<<<<<<< HEAD
/*app.get("/crearPartida/:nick/:num",function(request,response){
=======
app.get('/crearPartida/:nick/:numero', function(request,response){
>>>>>>> parent of 428396f... votaciones
	var nick=request.params.nick;
	//var usr=new modelo.Usuario(nick);
	var num=parseInt(request.params.numero);
	var codigo=juego.crearPartida(num,nick);

	response.send({"codigo":codigo});

});

app.get('/unirAPartida/:nick/:codigo', function(request,response){
	var nick=request.params.nick;
	var codigo=request.params.codigo;
	var res=juego.unirAPartida(codigo,nick);
	response.send({"res":res});
});
*/
app.get("/listaPartidas",function(request,response){
	var lista= juego.listaPartidas();
	response.send(lista);
});

<<<<<<< HEAD
app.get("/partidasCreadas/:admin",function(request,response){
	var admin=request.params.admin;
	juego.partidasCreadas(admin,function(lista){
		response.send(lista);
	});
});
//app.get("/partidasFinalizadas/:admin")
=======
>>>>>>> parent of 428396f... votaciones

server.listen(app.get('port'), function () {
    console.log('Node esta escuchando en el puerto', app.get('port'));
});

// app.listen(app.get('port'), function () {
//      console.log('Node app is running on port', app.get('port'));
// });

servidorWS.lanzarSocketSrv(io,juego);

