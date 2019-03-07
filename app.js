const express = require("express"),
bodyParser = require("body-parser"),
mysql = require("mysql"),
md5 = require("./assets/js/md5"),
dbCon = require("./assets/js/dbHelper/"),
fy = (dara)=>JSON.stringify(dara);
app = express();
// We're currently not using this bodyParser, because we're using ws, We might want switch in future, arcording to chanllenges, or Use both
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// start Express server
app.use(express.static(__dirname));
const server = app.listen(808,()=>console.log('App starting on port:',server.address().port));
// const port = server.address().port;
// const host = server.address().address,
theSocket = require("./websocketServer"),
WebsocketServer = new theSocket(server);// Start the WS server

(function InitialConnectionToTheDB(){
// We  use this to Open && End Connections to the DB
function conn (){
	return mysql.createConnection(dbCon.dbconnection)
}conn.prototype.destroy = function() {
	return mysql.createConnection(dbCon.dbconnection).destroy()
};conn.prototype.end = function() {
	return mysql.createConnection(dbCon.dbconnection).end()
};
		const altnativeConnecton = new Promise(res=>{
			let altnativeConnection = mysql.createConnection(dbCon.init.altConnection);
			res(altnativeConnection);
			return altnativeConnection
		})
		.then((altnativeConnection)=>{
			/**
			/* Because MySql does not allows us to connect and start enteract with the Database we want to use
			/* Unless you create it manually first, then connect with it defined, 
			/* Else an Error is thrown [Error: ER_BAD_DB_ERROR: Unknown database].
			/* In this case, the solution i have found is, we create an Alt Connection, so we can create our DB
			/* then we kill the connection we used to create our DB without going manual,
			/* and then we create another connection with the DB we created. Note : we can also use Generators, 
			/* that is Due to that, there's still issues i have discovered, whereby some mySql Requests can Delay
			/* while others can speed up.
			/* So, it important to wait until one Requestis done, the procced with the other, Which I think
			/* Generator is good at.
			**/
	// Use the connection we opened with altnativeConnecton Promise to create a DB and then close it for good
	const createDb =()=>{
		return new Promise(resolve=>{
			resolve((()=>{
				altnativeConnection.query(dbCon.init.createDB, (err,reslt)=>{
				  if (err) console.log(err);
				altnativeConnection.destroy();
			});
			})())
		});
	};
	const Connect =()=>{
		return new Promise(resolve=>{

			resolve((()=>{
				const con = conn();
				con.connect(error=>{
					if(error) throw error;
				});
				// We can also create the Tables we need|Note, we should not Distroy the connection outside the Query Requests, if we wan to create the needed Tables,
				// That will throw an Error, Because The Con.destroy Outside Queries, is called before the Query's Request, So the Query's Request won't be successful, and throws an Error while on the way
				con.destroy();// Destroy the Connection
			})())
			
		});
	};
	const createTableAfterConnectionEstablished =()=>{
		return new Promise(resolve=>{
				resolve((()=>{
		const con = conn();
				con.query(dbCon.init.createTable, (err,reslt)=>{
				  if (err) throw err;
				con.destroy();
				});
			})())
		});
	};

createDb().then(async function(){
await Connect().then(async function(){
	await createTableAfterConnectionEstablished()
.then(()=>{
	function noop(){}
	function heartBeat(){
		this.isAlive = true
	};

	// start Listening to the WS Messages/Requests
	const socket = WebsocketServer.Server(function(ws,req,Websocket,normSize,HISTORY,CLIENS,clienSize){
		ws.isAlive = true;
		ws.on("pong",heartBeat);
		const Interval = setInterval(function ping(){
			for(client of normSize.clients){
				if(ws.isAlive === false) return ws.terminate();
				ws.isAlive = false;
				ws.ping(noop)
			}

		}, 30000);

		ws.on("message",(message)=>{ 
			message = JSON.parse(message);// Parse the Stringified Frond-End Sent
			HISTORY.push(message);// Stores all messages
			
			// Login Request
			if(message.type == "login"){
				const username = message.data.username,
					  Password = message.data.pass;

				function HandShake(){
					const _Check = ['emailAddress',username,'password',md5(Password)],
					sql = mysql.format(dbCon.selectTosign("users"),_Check);
					let query = con.query(sql);
					 con.query(sql,(err,row)=>{
					 	if(err) console.log(err);
					 	if (row != "" ) {
					 		row = row[0];
						 	ws.send(fy({
								type:"userFound",
								data:{
									message:`Loging in ${row.firstname+" "+row.lastname}...`,
									column:{
									id:row.id,name:`${row.firstname} ${row.lastname}`,password:`${row.password}`,email:`${row.emailAddress}`
									}
								}
							}));
					 	}else{
							ws.send(fy({
								type:"nouserFound",
								data:{message:"No user found",errorMessage:"Your Email or Password are incorrect"}
							}))
					 	}
					 });
				} HandShake();
			}
			// Sign up Request
			if(message.type == "signup"){

				const username       = message.data.username,
					  first          = message.data.firstname,
					  last           = message.data.lastname,
					  createPassword = message.data.createPassword;

				function isAlreadyThere(){
					const inserts = ['emailAddress',username,'password',md5(createPassword)],
					sql = mysql.format(dbCon.selects("users"),inserts);
					con.query(sql,(err,row)=>{
					
						if(row&&row[0]&&row[0] !== undefined  ){

							if(username == row[0].emailAddress){
								ws.send(fy({
									type:"userExist",
									data:{message:`User ${row[0].firstname} ${row[0].lastname} already exists with this Email address.\nUse different Email address or reset your password`,
									 }
								}))
							  }
							  
						}else{
							inserDataUser();
							const sql2 = mysql.format(dbCon.selects("users"),inserts);

							con.query(sql,(err,row)=>{
								if (err) {
									console.log(err);
								}
								if(row[0] !== undefined){
									ws.send(fy({
										type:"accountCreated",
										data:{
											message:`Account Created.`,
											column:{id:row[0].id,name:`${row[0].firstname} ${row[0].lastname}`,password:`${row[0].password}`,email:`${row[0].emailAddress}`}}
									}));
								}
							})
						}				
						
						
					});
				}
				function inserDataUser(){
					const data = {
						emailAddress:username,firstname:first,lastname:last,password:md5(createPassword)
					};
					con.query(dbCon.insert("users"),data,(err)=>{
						if (err) {
							console.log(err) 
						 };
						console.log('data insert');
						con.end();
					});
				}	
			isAlreadyThere();
			}

		});

		ws.on("close",()=>{				
				CLIENS.push(normSize.clients.size--);
				// console.log('Number of clients:',clienSize());
		});
		ws.on("error",function(err){
				console.log(err);
		});

		const con = conn();
		esc = (k)=> con.escape(k);
	});
});
});
});

})})()





