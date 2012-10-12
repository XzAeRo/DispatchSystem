function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

String.prototype.capitalize = function() {
	var pieces = this.split(" ");
    for ( var i = 0; i < pieces.length; i++ )
    {
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1).toLowerCase();
    }
    return pieces.join(" ");
}

function toAutocomplete(dbResult, type){
	var arraySkeleton = {value:"form_value",label:"Visibile text",desc:"Description",icon:"Image"};
	var autocompleteArray = [];
	for (var i=0; i<dbResult.rows.length; i++) {
		var row = dbResult.rows.item(i);
        if(type=="products"){
		  arraySkeleton = {value: row["prod_cod"], label: row["name"] + " [" + row["prod_cod"] + "]" , desc: "", icon: ""};
        }
        else if(type=="batch"){
            arraySkeleton = {value: row["batch_id"], label: row["batch_id"], desc: "", icon: ""};
        }
		autocompleteArray.push(arraySkeleton);
	}
	return autocompleteArray;
}

function dateNow(type){
	var m_names = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
	var d = new Date();
    if(type=="db")
	   return d.getDate() + " " + m_names[d.getMonth()] + " " + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
    else
        return d.getDate().toString() + parseInt(d.getMonth()+1).toString() + d.getFullYear().toString();
}

function validateData(validationType, data, result){
	//
}

function resetDatabase(){
	dropTables(db);
	return initDatabase();
}

function validateProductCode() {
  var re = new RegExp("\w{4}\d{4}");
  if ($("#prod_cod").val().match(re)) {
    alert("Successful match");
  } else {
    alert("No match");
  }
}

$(document).ready(function(){
	$(".wrapperBox").tooltip({
        position: {
                my: "center bottom-5",
                at: "center top+5",
            },
        show: {
                duration: "fast"
            },
        hide: {
                effect: "hide"
            }
    });

	$("#table tbody tr").click( function( e ) {
        if ( $(this).hasClass('row_selected') ) {
            $(this).removeClass('row_selected');
        }
        else {
            $("#table tr.row_selected").removeClass('row_selected');
            $(this).addClass('row_selected');
        }
    });
	oTable = $("#table").dataTable({
		"bJQueryUI": true,
        "sPaginationType": "full_numbers",
        "oLanguage": {
            "sLengthMenu": "Mostrar _MENU_ resultados por página",
            "sZeroRecords": "Nada encontrado - Añada información",
            "sInfo": "Mostrando de _START_ a _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando de 0 a 0 de 0 registros",
            "sInfoFiltered": "(Filtados _MAX_ registros en total)",
			"sSearch": "Buscar:"
        }
	});

	$.datepicker.setDefaults( $.datepicker.regional[ "es" ] );
	$( "#expiration_date" ).datepicker({
            changeMonth: true,
            changeYear: true,
            firstDay: 1,
            dateFormat: "dd MM yy",
            minDate: 0,
            monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ],
            monthNamesShort: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ],
            dayNamesMin: [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa" ]
        });

    $( "#dialog-message-success" ).dialog({
        autoOpen: false,
        modal: true,
        width: 500,
        show: "fade",
        hide: "highlight",
        buttons: {
            Ok: function() {
                $( this ).dialog( "close" );
            }
        }
    });
    $( "#dialog-message-error" ).dialog({
        autoOpen: false,
        modal: true,
        width: 500,
        show: "shake",
        hide: "highlight",
        buttons: {
            Ok: function() {
                $( this ).dialog( "close" );
            }
        }
    });
});