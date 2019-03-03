let openDB = new OpenIDB();

const user_db = openDB.init("users", 1, function(upgradeDB){
	switch(upgradeDB.oldVersion) {
		case 0:
			upgradeDB.createObjectStore("logedIn",{keyPath:"name"});
	 	case 1:	 
		 	msgStore = upgradeDB.transaction.objectStore("logedIn");
		 	msgStore.createIndex("name","name");
	}
});
