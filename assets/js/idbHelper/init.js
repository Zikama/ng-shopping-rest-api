const iDbMethod = new IDBMethods(),
	  progressbar = new Progresser("#fff"),
	  g         = document.querySelector.bind(document),
	  gA        = document.querySelectorAll.bind(document),
	  fy        = JSON.stringify.bind(Object),
	  pars      = (data)=> JSON.parse(data),
	  listener  = (g,ev,bk)=>g.addEventListener(ev,bk,true);
	 	  // if user is running mozilla then use it's built-in WebSocket
	      window.WebSocket = window.WebSocket || window.MozWebSocket;

	      // if browser doesn't support WebSocket, just show some notification and exit
	      if (!window.WebSocket) {
	          console.error( 'Sorry, but your browser doesn\'t support WebSockets.')
	      }
  // open connection
  const socketLog = new WebSocket(`${window.location.origin.replace("http","ws").replace("https","wss")}`);

function heartBeat(){
	clearTimeout(this.pingTimeout);
	this.pingTimeout = setTimeout(()=>{
		this.close(4999,"Ping");
	},3000+1000);
};

function displayModal(v,calback) {
	const m = g(".modal");
	m.style.display = v;
	if(calback)
		calback()
};

function callModalButton(ev,calback){
	const hideModal = g(".modal button#cansel");
	const okModal = g(".modal button#ok");
	if(ev == "1"){
		okModal.addEventListener("click",()=>{
			if (calback) {
				displayModal("none",calback())
			}
			else{
			 displayModal("none")
			}
		});
		hideModal.setAttribute("disabled","");
		hideModal.style.opacity = "0";
	}
	if (ev == "0") {
		// hideModal.setAttribute("disabled","");
		// hideModal.style.opacity = "0";
		hideModal.addEventListener("click",()=>displayModal("none"));
	}
	if (ev == "get1") {
		return okModal
	}
	if (ev == "get0") {
		return hideModal
	}

}
	iDbMethod.init(user_db,"logedIn").getdata().then((data)=>{
		if(data == ""){
			if(socketLog.readyState == socketLog.OPEN){
				socketLog.send(fy({
					type:"noUser",
					data:"login"
				}));
			}

		    if(window.location.pathname != "/login/"){
			    window.location.href = "/login"
		    }
		}
		else{
			if(socketLog.readyState == socketLog.OPEN){
				socketLog.send(fy({
					type:"User",
					data:"home"
				}));
			}
		    if(window.location.pathname == "/login/"){
			    window.location.href = "/"
			}
		}

	});

window.onload=()=>{	
	socketLog.onopen = heartBeat;
	socketLog.onping = heartBeat;
	socketLog.onclose=function(){
		clearTimeout(this.pingTimeout);
	};
};

// Register SW Future
// const registerSW = new RegisterSW();
// registerSW.init("./_sw.js");


