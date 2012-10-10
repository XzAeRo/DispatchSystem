function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

$(document).ready(function(){
	db = initDatabase();
	var input_autocomplete = new $.TextboxList('#name', {unique: true, plugins: {autocomplete: {}}});
	$(".textboxlist-bit-editable-input").attr("placeholder",$("#name").attr("placeholder"));
	
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
	
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM products', [], function (tx, results) {
		  // Handle the results
		  	var results_array = [];
			for (var i=0; i<results.rows.length; i++) {
				var row = results.rows.item(i);
				oTable.fnAddData([row["prod_cod"],row["name"]]);
				results_array.push(row);
		  	}
		  	input_autocomplete.plugins['autocomplete'].setValues([[31, 'caca', 'Bit html', 'Suggestion item html'],[32, 'pichi', 'Bit html', 'Suggestion item html 2']]);
		});
	});
	
	$("#registerNew").click(function(){
		var prod_cod = $("#prod_cod");
		var name = $("#name");
		if(prod_cod != "" || name != ""){
			data = [prod_cod.val(),name.val()];
			insertProduct(db, data);
			oTable.fnAddData(data);
			prod_cod.val("");
			name.val("");
			$("#RegisterUserForm label").inFieldLabels();
		}
		return false;
	});
		
});
