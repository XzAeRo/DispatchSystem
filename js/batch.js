function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

function toAutocomplete(dbResult){
	var arraySkeleton = ["id","searchable","labelhtml","sugestionhtml"];
	var autocompleteArray = [];
	for (var i=0; i<dbResult.rows.length; i++) {
		var row = dbResult.rows.item(i);
		arraySkeleton = [row["prod_cod"],row["name"],row["prod_cod"],row["name"] + " (" + row["prod_cod"] + ")"];
		autocompleteArray.push(arraySkeleton);
	}
	return autocompleteArray;
}

$(document).ready(function(){
	/* Initialize variables */
	db = initDatabase();
	var input_autocomplete = new $.TextboxList('#prod_cod', {unique: true, plugins: {autocomplete: {}}});
	$(".textboxlist-bit-editable-input").attr("placeholder",$("#prod_cod").attr("placeholder")); // ui tweak
	/*
	dropTables(db);
	db = initDatabase();
	*/
	
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
	
	/* Load autocomplete */
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM products', [], function (tx, results) {
			data = toAutocomplete(results);
			alert(data);
		  	input_autocomplete.plugins['autocomplete'].setValues(data);
		});
	});
	
	/* Load table */
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM batch', [], function (tx, results) {
			for (var i=0; i<results.rows.length; i++) {
				var row = results.rows.item(i);
				oTable.fnAddData([row["batch_id"],row["prod_cod"],row["initial_ammount"],row["current_ammount"],row["expiration_date"],row["last_update"]]);
		  	}
		});
	});
	
	
	$("#registerNew").click(function(){
		var batch_id = $("#batch_id");
		var prod_cod = $("#prod_cod");
		var name = $("#initial_ammount");
		var
		if(prod_cod != "" || name != ""){
			data = [prod_cod.val(),name.val()];
			insertBatch(db, data);
			oTable.fnAddData(data);
			prod_cod.val("");
			name.val("");
			$("#RegisterUserForm label").inFieldLabels();
		}
		return false;
	}); 
		
});
