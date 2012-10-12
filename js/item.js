$(document).ready(function(){
	/* Initialize variables */
	db = initDatabase();
	var valid_prod_cod = false;
	var valid_initial_ammount = false;
	var valid_expiration_date = false;

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
	$("#prod_cod_label").blur(function(){
		db.transaction(function(tx){
			tx.executeSql('SELECT * FROM batch WHERE prod_cod=?', [$("#prod_cod").val()], function (tx, results) {
				data = toAutocomplete(results,"batch");
				$( "#batch_id_label" ).autocomplete({
		            minLength: 0,
		            source: data,
		            focus: function( event, ui ) {
		                $( "#batch_id_label" ).val( ui.item.label );
		                return false;
		            },
		            select: function( event, ui ) {
		                $( "#batch_id_label" ).val( ui.item.label );
		                $( "#batch_id" ).val( ui.item.value );	 
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
	});
	
	/* Load table */
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM item', [], function (tx, results) {
			for (var i=0; i<results.rows.length; i++) {
				var row = results.rows.item(i);
				oTable.fnAddData([row["item_id"],row["prod_cod"],row["batch_id"],row["ammount"],row["dosification"],parseFloat(row["ammount"])*parseFloat(row["dosification"])]);
		  	}
		});
	});
	
	$("#ammount").keydown(function(){
		var ammount = parseFloat(($("#ammount").val()!="")? $("#ammount").val() : 0);
		var dosification = parseFloat(($("#dosification").val()!="")? $("#dosification").val() : 0);
		$("#totalAmmount").html(ammount*dosification);
	});
	$("#dosification").keydown(function(){
		var ammount = parseFloat(($("#ammount").val()!="")? $("#ammount").val() : 0);
		var dosification = parseFloat(($("#dosification").val()!="")? $("#dosification").val() : 0);
		$("#totalAmmount").html(ammount*dosification);
	});


	$("#registerNew").click(function(){
		var item_id = $("#item_id");
		var prod_cod = $("#prod_cod");
		var batch_id = $("#batch_id");
		var prod_cod_label = $("#prod_cod_label");
		var batch_id_label = $("#batch_id_label");
		var ammount = $("#ammount");
		var dosification = $("#dosification");
		data = [item_id.val(),prod_cod.val(),batch_id.val(),ammount.val(),dosification.val(),dateNow("db")];
		if(item_id.val().length == 13 && batch_id.val().length != 0 && valid_prod_cod && ammount.val().length != 0 && dosification.val().length != 0){
			insertItem(db, data);
			data[5] = parseFloat(ammount.val()) * parseFloat(dosification.val());
			oTable.fnAddData(data);
			item_id.val("");
			prod_cod.val("");
			prod_cod_label.val("");
			batch_id.val("");
			batch_id_label.val("");
			ammount.val("");
			dosification.val("");
		}
		return false;
	}); 
		
});
