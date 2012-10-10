/*
Main JS for tutorial: "Getting Started with HTML5 Local Databases"
Written by Ben Lister (darkcrimson.com) revised 12 May 2010
Tutorial: http://blog.darkcrimson.com/2010/05/local-databases/

Licensed under the MIT License:
http://www.opensource.org/licenses/mit-license.php
*/
	
function initDatabase() {
	try {
	    if (!window.openDatabase) {
	        alert('Local Databases are not supported by your browser. Please use a Webkit browser for this demo');
	    } else {
	        var shortName = 'nr';
	        var version = '1.0';
	        var displayName = 'Natural Response';
	        var maxSize = 100000; // in bytes
	        db = openDatabase(shortName, version, displayName, maxSize);
			createTables(db);
			
			return db;
	    }
	} catch(e) {
	    if (e == 2) {
	        // Version mismatch.
	        console.log("Invalid database version.");
	    } else {
	        console.log("Unknown error "+ e +".");
	    }
	    return -1;
	} 
}



/***
**** CREATE TABLE ** 
***/
function createTables(database){
	database.transaction(
        function (transaction) {
        	transaction.executeSql('CREATE TABLE IF NOT EXISTS products(prod_cod TEXT NOT NULL PRIMARY KEY, name TEXT NOT NULL);', [], nullDataHandler, errorHandler);
			transaction.executeSql('CREATE TABLE IF NOT EXISTS batch(batch_id TEXT NOT NULL PRIMARY KEY, prod_cod TEXT NOT NULL, initial_ammount FLOAT NOT NULL, current_ammount FLOAT NOT NULL, entry_date TEXT NOT NULL, last_update TEXT NOT NULL,FOREIGN KEY (prod_cod) REFERENCES products(prod_cod));', [], nullDataHandler, errorHandler);
			transaction.executeSql('CREATE TABLE IF NOT EXISTS item(item_id TEXT NOT NULL PRIMARY KEY, prod_cod TEXT NOT NULL, batch_id TEXT NOT NULL, unitary_ammount INTEGER NOT NULL, unitary_size FLOAT NOT NULL, FOREIGN KEY (prod_cod) REFERENCES products(prod_cod),FOREIGN KEY (batch_id) REFERENCES batch (batch_id));', [], nullDataHandler, errorHandler);
        }
    );
}

/***
**** INSERT INTO TABLE ** 
***/
function insertProduct(database, data){
	database.transaction(
	    function (transaction) {		
		transaction.executeSql("INSERT INTO products(prod_cod, name) VALUES (?, ?)", [data[0], data[1]]);
	    }
	);	
}

function insertBatch(database, data){
	database.transaction(
	    function (transaction) {		
		transaction.executeSql("INSERT INTO batch(batch_id, prod_cod, initial_amount, current_ammount, entry_date, last_update) VALUES (?, ?, ?, ?, ?, ?)", [data[0], data[1], data[2], data[3], data[4], data[5]]);
	    }
	);	
}

function insertItem(database, data){
	database.transaction(
	    function (transaction) {		
		transaction.executeSql("INSERT INTO products(item_id, prod_cod, batch_id, unitary_ammount, unitary_size) VALUES (?, ?, ?, ?, ?)", [data[0], data[1], data[2], data[3], data[4]]);
	    }
	);	
}

/***
**** UPDATE TABLE ** 
***/
function updateSetting(database){
	database.transaction(
	    function (transaction) {
	    	if($('#fname').val() != '') {
	    		var fname = $('#fname').val();
	    	} else {
	    		var fname = 'none';
	    	}
			
			var bg    = $('#bg_color').val();
			var font  = $('#font_selection').val();
			var car   = $('#fav_car').val();
			
	    	
	    	transaction.executeSql("UPDATE page_settings SET fname=?, bgcolor=?, font=?, favcar=? WHERE id = 1", [fname, bg, font, car]);
	    }
	);	
		selectAll();
}
function selectAll(database){ 
	database.transaction(
	    function (transaction) {

	        transaction.executeSql("SELECT * FROM page_settings;", [], dataSelectHandler, errorHandler);
	        
	    }
	);	
}

function dataSelectHandler(transaction, results){

	// Handle the results
    for (var i=0; i<results.rows.length; i++) {
        
    	var row = results.rows.item(i);
    	
        var newFeature = new Object();
    	
    	newFeature.fname   = row['fname'];
        newFeature.bgcolor = row['bgcolor'];
        newFeature.font    = row['font'];
        newFeature.favcar  = row['favcar'];
        
        $('body').css('background-color',newFeature.bgcolor);
        $('body').css('font-family',newFeature.font);
        $('#content').html('<h4 id="your_car">Your Favorite Car is a '+ newFeature.favcar +'</h4>');
        
        if(newFeature.fname != 'none') {
       		$('#greeting').html('Howdy-ho, '+ newFeature.fname+'!');
       		$('#fname').val(newFeature.fname);
        } 
        
       $('select#font_selection').find('option[value='+newFeature.font+']').attr('selected','selected');
       $('select#bg_color').find('option[value='+newFeature.bgcolor+']').attr('selected','selected');  
       $('select#fav_car').find('option[value='+newFeature.favcar+']').attr('selected','selected');

       
    }

}





/***
**** Save 'default' data into DB table **
***/

function saveAll(){
		prePopulate(1);
}


function errorHandler(transaction, error){
 	if (error.code==1){
 		// DB Table already exists
 	} else {
    	// Error is a human-readable string.
	    console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
 	}
    return false;
}


function nullDataHandler(){
	console.log("SQL Query Succeeded");
}

/***
**** SELECT DATA **
***/
function selectAll(database){ 
	database.transaction(
	    function (transaction) {
	        transaction.executeSql("SELECT * FROM page_settings;", [], dataSelectHandler, errorHandler);
	    }
	);	
}

/***
**** DELETE DB TABLE ** 
***/
function dropTables(database){
	database.transaction(
	    function (transaction) {
	    	transaction.executeSql("DROP TABLE page_settings;", [], nullDataHandler, errorHandler);
	    }
	);
	console.log("Table 'page_settings' has been dropped.");
	location.reload();
}

	