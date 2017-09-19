var carga=0;
var i=1;
var puntos=0;
var move=0;
var cdulcesV=0;
var cdulcesH=0;
var eliminar=0;
var dropped;
var droppedOn;
var prueba;
var agregarFichas;
var maximo=0;
var contador=0;
var newdulces=0;
var bnewd=0;
var lenres=["","","","","","",""];
var lencol=["","","","","","",""];
var tiempo=0;

$(function(){
	/*********************************************************/
	//Cambia de color infinitamente con setInterval(function())
	/*********************************************************/
	setInterval(function(){
		var color = $(".main-titulo").css("color")
		if(color == "rgb(255, 255, 255)"){
			$(".main-titulo").css("color", "rgb(220, 255, 14)")
		}else{
			$(".main-titulo").css("color", "white")
		}
	}, 500);


	/*********************************************************/
	//Evento al hacer click en el boton Iniciar o Reiniciar
	/*********************************************************/
	$(".btn-reinicio").on("click", function(){
		clearInterval(carga)
		clearInterval(cargaFichas)
		clearInterval(eliminar)
		clearInterval(newdulces)
		clearInterval(tiempo)
		borrarTodo()
		if ($(this).text() == "Iniciar"){
			$("h3").remove()
			$("div.score").hide("explode", 1000)
			$("div.moves").hide("explode", 1000)
			$("div.panel-score").css("width","25%")
			$("div.panel-tablero").show("bounce", 1000)
			$("div.score").show("fade", 1000)
			$("div.moves").show("fade", 1000)
			$("div.time").show("fade", 1000)
			$(".btn-reinicio").html("Reiniciar")
		}
		$('#timer').html(02 + ":" + 00)
		tiempo = setInterval(startTimer, 1000)
		i=1
		carga = setInterval(function(){cargaFichas()}, 600)
	});
})

/*************************************************************************/
				/**** Ejecucion de Funciones ****/
/*************************************************************************/
$(".btn-reinicio").html("Reiniciar")
$('#timer').html(02 + ":" + 00);
tiempo = setInterval(startTimer, 1000);
carga = setInterval(function(){cargaFichas()}, 600);
clearInterval(eliminar);
clearInterval(newdulces);


/**************************************************************************/
//Funciones para el contador del tiempo
/**************************************************************************/
function startTimer() {
  var presentTime = $('#timer').html();
  var timeArray = presentTime.split(/[:]+/);
  var m = timeArray[0];
  var s = checkSecond((timeArray[1] - 1));
  if(s==59){m=m-1}
  if(m<0){
  	clearInterval(tiempo)
  	clearInterval(carga)
  	clearInterval(eliminar)
  	clearInterval(newdulces)
  	$(".btn-reinicio").html("Iniciar")
  	$("div.panel-tablero").hide("explode", 1000)
  	$("div.time").hide("drop",{direction: "right"}, 1000)
  	$("div.panel-score").css("width","+=75%")
  	$("div.score").hide("drop",{direction: "right"}, 1000)
  	$("div.moves").hide("drop",{direction: "right"}, 1000)
  	$("div.buttons").hide("drop",{direction: "down"}, 1000)
  	$("<h3 class='main-titulo' style='display:none'>Juego Terminado</h3>").insertAfter("h1")
  	$("div.score").show("bounce", 1000)
  	$("div.moves").show("bounce", 1000)
  	$("div.buttons").show("fade", 1000)
  	$("h3").show("bounce", 1000)
  }

  $("#timer").html(m + ":" + s);
}

function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
  if (sec < 0) {sec = "59"};
  return sec;
}


/**************************************************************************/
//Funcion para eliminar todas las imagenes de los dulces
/**************************************************************************/
function borrarTodo(){
	puntos = 0
	move = 0
	$("div.panel-tablero img").remove()
	$("#score-text").text(puntos)
	$("#movimientos-text").text(move)
}


/**************************************************************************/
//Funcion para generar las fichas aleatorias e incorporarlas a cada columna
/**************************************************************************/
function cargaFichas(){
	if(i<8){
		for(r=1;r<8;r++){
			n = Math.floor(Math.random()* (4-1)) + 1
			col = $(".col-"+r)
			img = "<img src=image/"+n+".png class='elemento'>"
			$(col).css("justify-content", "flex-start")
			$(col).prepend(img)
		}
	}

	if(i==8){
		clearInterval(carga)
		eliminar = setInterval(function(){limpiarDulces()}, 200)
	}

	i++
}


/**************************************************************************/
//Funcion que verifica si hay igualdades entre dulces y los elimina
/**************************************************************************/
function limpiarDulces(){
	cdulcesH=verifHorizontal()
	cdulcesV=verifVertical()

	if(cdulcesH == 0 && cdulcesV == 0){
		$("#score-text").text(puntos)
		clearInterval(eliminar)
		bnewd=0
		newdulces = setInterval(function(){nuevosdulces()}, 600)
	}

	$("div[class*='col-'").css("justify-content", "flex-end")
	$(".borrar").hide("pulsate", 1000, function(){
		puntos = puntos + ($(".borrar").length * 10)
		$(".borrar").remove("img")
	})

	$(".elemento").draggable({
		containment: ".panel-tablero",
		revert: true,
		reverDuration: 0,
		snap: true,
		snapMode: "inner",
		snapTolerance: 40,
	})

	$(".elemento").droppable({
		drop: function(event, ui){
			var dropped = ui.draggable;
			var droppedOn = this;
			prueba=0;
			do{
				prueba = dropped.swap($(droppedOn));
			}while(prueba==0)
			cdulcesH=verifHorizontal()
			cdulcesV=verifVertical()
			move++
			$("#movimientos-text").text(move)
			if(cdulcesV==0 && cdulcesH==0){
				dropped.swap($(droppedOn));
			}
		}
	})
}


/************************************************************/
//Funcion para agregar nuevos dulces una vez eliminados
/************************************************************/
function nuevosdulces()
{
  $("div[class^='col']").css("justify-content","flex-start")
  for(var j=1;j<8;j++)
  {
      lencol[j-1]=$(".col-"+j).children().length;
  }

  if(bnewd==0)
  {
    for(var j=0;j<7;j++)
    {
      lenres[j]=(7-lencol[j]);
    }

    maximo=Math.max.apply(null,lenres);
    contador=maximo;
		if(contador==0 && maximo == 0){
			clearInterval(newdulces)
		}
  }
  if(maximo!=0)
  {
    if(bnewd==1)
    {
      for(var j=1;j<8;j++)
      {
        if(contador>(maximo-lenres[j-1]))
        {
          $(".col-"+j).children("img:nth-child("+(lenres[j-1])+")").remove("img")
        }
      }
    }
    if(bnewd==0)
    {
      bnewd=1;
      for(var k=1;k<8;k++)
      {
        for(var j=0;j<(lenres[k-1]-1);j++)
        {
            $(".col-"+k).prepend("<img src='' class='elemento' style='visibility:hidden'/>")
        }
      }
    }
    for(var j=1;j<8;j++)
    {
      if(contador>(maximo-lenres[j-1]))
      {
        numero=Math.floor(Math.random() * 4) + 1 ;
        imagen="image/"+numero+".png";
        $(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>")
      }
    }
  }
  if(contador==1)
  {
    clearInterval(newdulces);
    eliminar=setInterval(function(){limpiarDulces()},150)
  }
  contador=contador-1;
}


/************************************************************/
//Funcion para el intercambio de drag and drop
/************************************************************/
jQuery.fn.swap = function(b){
	b = jQuery(b)[0];
	var a  = this[0];
	var t = a.parentNode.insertBefore(document.createTextNode(''), a);
	b.parentNode.insertBefore(a, b);
	t.parentNode.insertBefore(b, t);
	t.parentNode.removeChild(t);
	eliminar=setInterval(function(){limpiarDulces()}, 150);
    return this;
}


/************************************************************/
//Con esta funcion se verifica las coincidencias horizontales
/************************************************************/
function verifHorizontal(){
	var contH = 0;
	for(var x=1;x<8;x++){
		for(var y=1;y<6;y++){
			var q = $(".col-"+y).children("img:nth-last-child("+x+")").attr("src")
			var w = $(".col-"+(y+1)).children("img:nth-last-child("+x+")").attr("src")
			var e = $(".col-"+(y+2)).children("img:nth-last-child("+x+")").attr("src")
			if((q==w) && (w==e) && (q!=null) && (w!=null) && (e!=null)){
				$(".col-"+y).children("img:nth-last-child("+(x)+")").attr("class", "elemento borrar")
				$(".col-"+(y+1)).children("img:nth-last-child("+(x)+")").attr("class", "elemento borrar")
				$(".col-"+(y+2)).children("img:nth-last-child("+(x)+")").attr("class", "elemento borrar")
				contH = 1;
			}
		}
	}
	return contH;
}


/************************************************************/
//Con esta funcion se verifica las coincidencias verticales
/************************************************************/
function verifVertical(){
	var contV = 0
	for(x=1;x<8;x++){
		var q = $(".col-"+x+" > img.elemento")
		for(y=0;y<5;y++){
			if(($(q[y]).attr("src") == $(q[y+1]).attr("src")) &&
			   ($(q[y+1]).attr("src") == $(q[y+2]).attr("src")) &&
			    $(q[y]).attr("src") != null && $(q[y+1]).attr("src") != null
			    && $(q[y+2]).attr("src") != null){
				$(q[y]).addClass("borrar")
				$(q[y+1]).addClass("borrar")
				$(q[y+2]).addClass("borrar")
				contV = 1;
			}
		}
	}
	return contV;
}
