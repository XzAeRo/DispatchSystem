$(document).ready(function(){
	/* Initialize variables */
	db = initDatabase();
	var valid_prod_cod = false;
	var valid_initial_ammount = false;
	var valid_expiration_date = false;
	$("#batch_id").keyup(function(){$("#batch_id").val($("#batch_id").val().toUpperCase());});

	/* Validation */
	$("#prod_cod_label").blur(function(){
		db.transaction(function(tx){
			tx.executeSql('SELECT COUNT(*) FROM products WHERE prod_cod=?', [$("#prod_cod").val()], function (tx, results) {
				var result = results.rows.item(0)["COUNT(*)"];
				valid_prod_cod = (result == "1") ? true : false;
			});
		});
	});
    	
	/* Load autocomplete */
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM products', [], function (tx, results) {
			data = toAutocomplete(results,"products");
		  	$( "#prod_cod_label" ).autocomplete({
	            minLength: 0,
	            source: data,
	            focus: function( event, ui ) {
	                $( "#prod_cod_label" ).val( ui.item.label );
	                return false;
	            },
	            select: function( event, ui ) {
	                $( "#prod_cod_label" ).val( ui.item.label );
	                $( "#prod_cod" ).val( ui.item.value );
	                $("#batch_id").val(ui.item.value + "-" + dateNow("auto") + "-");
	                return false;
	            }
        	}).data( "autocomplete" )._renderItem = function( ul, item ) {
            	return $( "<li>" )
                .data( "item.autocomplete", item )
                .append( "<a>" + item.label + "<br>" + item.desc + "</a>" )
                .appendTo( ul );
        	};
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
		var prod_cod_label = $("#prod_cod_label");
		var initial_ammount = $("#initial_ammount");
		var expiration_date = $("#expiration_date");
		data = [batch_id.val(),prod_cod.val(),initial_ammount.val(),initial_ammount.val(),expiration_date.val(),dateNow("db")];
		if(batch_id.val().length != 0 && valid_prod_cod && initial_ammount.val().length != 0){
			insertBatch(db, data);
			oTable.fnAddData(data);
			prod_cod.val("");
			prod_cod_label.val("");
			batch_id.val("");
			initial_ammount.val("");
			expiration_date.val("");
			$( "#dialog-message-success" ).dialog( "open" );
		}
		else {
			$( "#dialog-message-error" ).dialog( "open" );
		}
		
		return false;
	}); 
		
});
