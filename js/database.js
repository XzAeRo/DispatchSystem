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

/* Table create if not exists */
function createTables(database){
	database.transaction(
        function (transaction) {
        	transaction.executeSql('CREATE TABLE IF NOT EXISTS products(prod_cod TEXT NOT NULL PRIMARY KEY, name TEXT NOT NULL);', [], nullDataHandler, errorHandler);
			transaction.executeSql('CREATE TABLE IF NOT EXISTS batch(batch_id TEXT NOT NULL PRIMARY KEY, prod_cod TEXT NOT NULL, initial_ammount FLOAT NOT NULL, current_ammount FLOAT NOT NULL, expiration_date TEXT NOT NULL, last_update TEXT NOT NULL,FOREIGN KEY (prod_cod) REFERENCES products(prod_cod));', [], nullDataHandler, errorHandler);
			transaction.executeSql('CREATE TABLE IF NOT EXISTS item(item_id TEXT NOT NULL PRIMARY KEY, prod_cod TEXT NOT NULL, batch_id TEXT NOT NULL, ammount INTEGER NOT NULL, dosification FLOAT NOT NULL, last_updated TEXT NOT NULL, FOREIGN KEY (prod_cod) REFERENCES products(prod_cod),FOREIGN KEY (batch_id) REFERENCES batch (batch_id));', [], nullDataHandler, errorHandler);
        }
    );
}

/* Insert into tables */
function insertProduct(database, data){
	database.transaction(
	    function (transaction) {		
		transaction.executeSql("INSERT INTO products(prod_cod, name) VALUES (?, ?)", [data[0], data[1]], nullDataHandler, errorHandler);
	    }
	);	
}

function insertBatch(database, data){
	database.transaction(
	    function (transaction) {
		transaction.executeSql("INSERT INTO batch(batch_id, prod_cod, initial_ammount, current_ammount, expiration_date, last_update) VALUES (?, ?, ?, ?, ?, ?)", [data[0], data[1], data[2], data[3], data[4], data[5]],nullDataHandler, errorHandler);
	    }
	);	
}

function insertItem(database, data){
	database.transaction(
	    function (transaction) {
		transaction.executeSql("INSERT INTO item(item_id, prod_cod, batch_id, ammount, dosification, last_updated) VALUES (?, ?, ?, ?, ?, ?)", [data[0], data[1], data[2], data[3], data[4], data[5]], nullDataHandler, errorHandler);
	    }
	);	
}

/* Update tables */
function updateSetting(database){
	database.transaction(
	    function (transaction) {
    	
	    	transaction.executeSql("UPDATE page_settings SET fname=?, bgcolor=?, font=?, favcar=? WHERE id = 1", [fname, bg, font, car]);
	    }
	);	
		
}

/* Data and error handlers */
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

/* Drop all tables */
function dropTables(database){
	database.transaction(
	    function (transaction) {
	    	transaction.executeSql("DROP TABLE products;", [], nullDataHandler, errorHandler);
	    	transaction.executeSql("DROP TABLE batch;", [], nullDataHandler, errorHandler);
	    	transaction.executeSql("DROP TABLE item;", [], nullDataHandler, errorHandler);
	    }
	);
	console.log("Tables has been dropped.");
}

	
