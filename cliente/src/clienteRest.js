function ClienteRest(){
	this.crearPartida=function(nick,num){
		$.getJSON("/crearPartida/"+nick,function(data){    
    		console.log(data);
    		
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
