function clienteRest(){
	this.crearPartida=function(nick,num,callback){
		$.getJSON("/crearPartida/"+nick,function(data){    
    		console.log(data);
    		callback(data);
		});
	}
	this.unirAPartida=function(nick,codigo){
		$.getJSON("/unirAPartida/"+nick+"/"+codigo,function(data){    
    		console.log(data);
		});
	}
	this.listaPartidas=function(){
		$.getJSON("/listaPartidas",function(lista){
			console.log(lista);
		})
	}
	this.iniciarPartida=function(nick,codigo){
		$.getJSON("/iniciarPartida/"+nick+"/"+codigo,function(data){    
    		console.log(data);
		});
	}


}
function pruebas(){
	var codigo=undefined;
	rest.crearPartida("pepe",3,function(data){
		codigo=data.codigo;
	});
	rest.crearPartida("pepe",4,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juanita",codigo);
	});
	rest.crearPartida("pepe",5,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juanita",codigo);
		rest.unirAPartida("juanita2",codigo);

	});
		rest.crearPartida("pepe",10,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juanita",codigo);
		rest.unirAPartida("juanita2",codigo);
		rest.unirAPartida("ana",codigo);
		rest.unirAPartida("anita",codigo);
		rest.unirAPartida("pepe",codigo);
		rest.unirAPartida("maria",codigo);
		rest.unirAPartida("carlos",codigo);

	});
}