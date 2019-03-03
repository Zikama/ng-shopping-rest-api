;(($)=>{

class openIDB{
	init(dbname,vr,calback){
	  	return idb.open(dbname,vr,calback) 
	}
};

class IDBmethods{
	init(promiseFromDb,_objectStore){
		return {
			deledata(name){  
				const promiseDb = promiseFromDb;
				return promiseDb.then((db)=>{
			     	const tx = db.transaction(_objectStore,"readwrite");
			     	const store = tx.objectStore(_objectStore);

			     	 store.delete(name) ;
			    })
			},

			getdata(name,indexName){ 
				const promiseDb = promiseFromDb;
				return promiseDb.then((db)=>{
			     	const tx = db.transaction(_objectStore);
			     	const store = tx.objectStore(_objectStore);
					let indexOthis;

			     	if(indexName){
				 		return indexOthis = store.index(indexName);
			     	}  	
					if(name){
						if(!indexName){
					     	return store.get(name);
					    }
						return indexOthis.get(name)
					}
					else{
						if(!indexName){
							return store.getAll();
						}
					return indexOthis.getAll();
					}
				 })
			},

			putdata(data={}){    
				const promiseDb = promiseFromDb;
				return promiseDb.then((db)=>{
			     	const tx = db.transaction(_objectStore,"readwrite");
			     	let store = tx.objectStore(_objectStore);
			     	
			     	return store.put(data)
				})
			},

			set(key, val) {    
				const promiseDb = promiseFromDb;
				return promiseDb.then(db => {
			      const tx = db.transaction(_objectStore, 'readwrite');
			      tx.objectStore(_objectStore).put(val, key);
			      return tx.complete;
			    });
			},

			clear() {    
				const promiseDb = promiseFromDb;
				return promiseDb.then(db => {
			      const tx = db.transaction(_objectStore , 'readwrite');
			      tx.objectStore(_objectStore).clear();
			      return tx.complete;
			    });
			},

			keys(promiseFromDb,_objectStore) {    
				const promiseDb = promiseFromDb;
				return promiseDb.then(db => {
			      const tx = db.transaction(_objectStore);
			      const keys = [];
			      const store = tx.objectStore(_objectStore);

			      // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
			      // openKeyCursor isn't supported by Safari, so we fall back
			      (store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
			        if (!cursor) return;
			        keys.push(cursor.key);
			        cursor.continue();
			      });

			      return tx.complete.then(() => keys);
			    });
			},

			logCursor(index,key) {
				const promiseDb = promiseFromDb;
				return promiseDb.then(db => {
			      const tx = db.transaction(_objectStore);
			      const store = tx.objectStore(_objectStore);
			      const storeIndex = store.index(index);

			      return storeIndex.openCursor(/*key, 'prev'*/);
			  })
			.then(logpe=(cursor)=>{
			    if(!cursor) return;
			    return cursor.continue().then(logpe),cursor.value
			  })
			},


			update(index,key,value){
				const promiseDb = promiseFromDb;
				return promiseDb.then(db => {
			      const tx = db.transaction(_objectStore,"readwrite");
			      const store = tx.objectStore(_objectStore);
			      const storeIndex = store.index(index);

			      return storeIndex.openCursor(/*key, 'next'*/);
			  }).then(updateCurs = (cursor) =>{
				  	if(!cursor) return;
				  	let data = cursor.value;
					let _properties = data.__proto__.constructor.getOwnPropertyNames(data);
					for (newDataProperty of _properties){
					     if (newDataProperty == key){

					     	data[key]=value;

					     }
					}
				  	
				  	cursor.update(data);
				  	return cursor.continue();
				})
			},

			updateProperty(/*index,*/key,property,value){
				const promiseDb = promiseFromDb;
				return promiseDb.then(db => {
			      const tx = db.transaction(_objectStore,"readwrite");
			      const store = tx.objectStore(_objectStore);

			      return store.openCursor(/*key, 'next'*/);
			  }).then(updateCurs = (cursor) =>{
				  	if(!cursor) return;
				  	let data = cursor.value;
					let _properties = data.__proto__.constructor.getOwnPropertyNames(data);
					for (newDataProperty of _properties){
					     if (newDataProperty == key){

					     	data[key][property]=value;

					     }
					}
				  	
				  	cursor.update(data);
				  	return cursor.continue();
				})
			}
		}

	}
}


function OpenIDB() {
        return new openIDB()
        
}function IDBMethods() {
        return new IDBmethods()
        
}
    
    if (typeof define === 'function' && define.amd) {
      define(function () {
        return OpenIDB,IDBMethods
      })
    } else if (typeof module === 'object' && module.exports) {
      module.exports = OpenIDB;
      module.exports = IDBMethods;
    } else {
      $.OpenIDB = OpenIDB;
      $.IDBMethods = IDBMethods;
    }

})(this);

/*

 msg_db = idb.open("messages", 4, function( upgradeDB ){
 	switch(upgradeDB.oldVersion) {
 		case 0:
	 		upgradeDB.createObjectStore("Sentmessages",{autoIncrement:true});
	 	case 1:	 
		 	msgStore = upgradeDB.transaction.objectStore("Sentmessages");
		 	msgStore.createIndex("name","name",{unique:false});
		case 2:
	 		upgradeDB.createObjectStore("Receivedmessages", {autoIncrement:true});
	 	case 3:	 
		 	msgStore = upgradeDB.transaction.objectStore("Receivedmessages");
		 	msgStore.createIndex("name","name",{unique:false});
		case 4:
	 		upgradeDB.createObjectStore("MesgTemp", {autoIncrement:true});
	 	case 5:	 
		 	msgStore = upgradeDB.transaction.objectStore("MesgTemp");
		 	msgStore.createIndex("name","name",{unique:false});
		case 4:
	 		upgradeDB.createObjectStore("asideMsg",{keyPath:/*'userID'/'Who'});
	 	case 5:	 
		 	asMsgStore = upgradeDB.transaction.objectStore("asideMsg");
		 	// asMsgStore.createIndex("name","Who",{unique:false});
 	}
 });
*/