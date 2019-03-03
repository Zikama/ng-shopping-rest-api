
module.exports = {
/**
/* This the Module we use for Opening and Killing Connections to the DB
/* Note that some Functions are not yet fixed for being used!. 
/* Some of them, will be fixed once nedded, [That's my way]
**/
	insert :(table)=> {
		const CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };// Msql's Timestamp
		const MD5 =  { toSqlString: function(data) { return `MD5(${data})`; } };// Msql's MD5
		return`INSERT INTO ${table}  SET ? `},
	selects : (table)=> `SELECT * FROM ${table} WHERE ??=? AND ??=?`,
	selectForgot : (table)=> `SELECT * FROM ${table} WHERE ??=?`,
	selectTosign : (table)=> `SELECT * FROM ${table} WHERE ??=? AND ??=? `,
	selectsAll : (table)=> ` SELECT * FROM ${table} `,
	seach : (table,holder,...sort)=>`SELECT * FROM ${table} WHERE ${holder} LIKE'%${sort}%'`,
	selectWhere : (table,...sort )=> `SELECT ${sort} FROM ${table} `,
	selector : (table,...sort )=> `SELECT ${sort} FROM ${table} WHERE ??=?  `,
	alter : (database,username)=> `ALTER 'TABLE' users CHANGE 'password' 'password' VARCHAR(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL`,
	addRow : (table,row,configs)=> `ALTER TABLE ${table} ADD ${row}  ${configs} `,
	updateForgot : (table)=> `UPDATE ${table} SET ??=? WHERE ??= ?`,
	update : (database,username)=> `UPDATE users SET foo = ?, bar = ?, baz = ? WHERE id = ?', ['a', 'b', 'c', userId]`,
	createDB :(base) =>`CREATE DATABASE IF NOT EXISTS ${base}`,
	createTable : (table,...n) =>`CREATE TABLE IF NOT EXISTS ${table}(${n.join(",")})`,
	dbconnections :class {
		constructor(initDB){this.initDB()}
		initDB(){
		  return {
			host:"localhost",//Use your prefered
			user: "root",//Use your prefered
			password:"made",//Use your prefered
			database:"NGshop"//Use your prefered
		}
	  }
	  altDB(h,u,p,d){
	  	return{
	  		host:this.h,
	  		user:this.u,
	  		password:this.p,
	  		database:this.d 
	  	}
	  }
	},

	dbconnection : {
		host:"localhost",//Use your prefered
		user: "root",//Use your prefered
		password:"made",//Use your prefered
		database:"NGshop"//Use your prefered
	},
	con:(db)=>{
		return{
			host:"localhost",//Use your prefered
			user: "root",//Use your prefered
			password:"made",//Use your prefered
			database:db
		}

	},
	init:{
		altConnection:{
			host:"localhost",//Use your prefered
			user: "root",//Use your prefered
			password:"made"//Use your prefered
		},
		createDBs :(db)=> `CREATE DATABASE IF NOT EXISTS ${db.replace('"',"")}`,
		createTables :  (table,...n) =>`CREATE TABLE IF NOT EXISTS ${table}(${n})`,
		createTablesCCID :  (table,...n) =>`CREATE TABLE IF NOT EXISTS ${table}(id INT AUTO_INCREMENT PRIMARY KEY,${n})`,
		createDB : `CREATE DATABASE IF NOT EXISTS NGshop`,
		createTable : `CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT PRIMARY KEY,firstname VARCHAR(255),lastname VARCHAR(255),emailAddress VARCHAR(255),password VARCHAR(25),member INT(22))`
	}
};

class Connections{
	constructor(init){this.init()}
		init(host,user,password){
			const initialize=()=>{
				this.host=host,
				this.user=user,
				this.password=password

			};
			return initialize;
		}
	altConnection(){
		return{
			host:"localhost",
			user: "root",
			password:"made"
		}
	}
	connect(db){
		return{
			host:"localhost",
			user: "root",
			password:"made",
			database:db
		}
	}
	connector(host,user,password,database){
		const connectorInitialize = () =>{
			this.host=host,
			this.user=user,
			this.password=password,
			this.database=database

		};
		return connectorInitialize
	}
}
connections = new Connections;
exports = connections;
