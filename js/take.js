$(document).ready(function(){
	db = initDatabase();

	$("#name").keydown(function(){$("#name").val($("#name").val().capitalize());});
	$("#prod_cod").keydown(function(){$("#prod_cod").val($("#prod_cod").val().toUpperCase());});
	/*$("#prod_cod").blur(function(){
		$("#prod_cod").removeClass("valid");$("#prod_cod").removeClass("invalid");
		if(validateProductCode($("#prod_cod").val()))
			$("#prod_cod").addClass("valid");
		else
			$("#prod_cod").addClass("invalid");
	});*/

	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM products', [], function (tx, results) {
		  // Handle the results
			for (var i=0; i<results.rows.length; i++) {
				var row = results.rows.item(i);
				oTable.fnAddData([row["prod_cod"],row["name"]]);
		  }
		});
	});
	
	$("#registerNew").click(function(){
		var prod_cod = $("#prod_cod");
		var name = $("#name");
		if(prod_cod.val().length == 8 && name.val().length != 0){
			data = [prod_cod.val(),name.val()];
			insertProduct(db, data);
			oTable.fnAddData(data);
			prod_cod.val("");
			name.val("");
			$( "#dialog-message-success" ).dialog( "open" );
		}
		else {
			$( "#dialog-message-error" ).dialog( "open" );
		}
		return false;
	});
});