function clienteRest(){
	this.crearPartida=function(nick){
		$.getJSON("/crearPartida/"+nick,function(data){    
    		console.log(data);
		});
	}


}