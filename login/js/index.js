// We Use Global Vars (g,gA) available in the init file, make sure it's Being defined before this file
	function openTab(evt, tabName) {
		let x = document.getElementsByClassName( "tab" );
		for (xi of x) {
			xi.style.display = "none";
		}
		let tablinks = document.getElementsByClassName("tablink");
		for (tablink of tablinks) {
			tablink.classList.remove("active_tab");
		}
		ifClass=()=>{
			for(xi of x){
				if(xi.classList.contains(tabName))
					return '.'
				else if(xi.id == tabName)
					return "#"
			}
		};
		g(`${ifClass()}${tabName}`).style.display = "flex";
		evt.currentTarget.classList.add("active_tab") ;
	}
	// Display The Tab Marked as active_tab
	!function(){
		let active = document.querySelector(".active");
		if(!active.click()){
			active.style.display = "flex";
			g(".tablink").classList.add("active_tab") ;
		}
	}();


 
  (small_inputs=()=>{
    for(inputs of gA("input"))
      inputs.classList.add("sm-input") 
    for(lable of gA("label"))
      lable.classList.add("sm-label") 
  })();
// Login submission. 
// Note We use WS, so we prevent the page from reloading, ws request, takes ms
// It's so fast and easy to use, Also the WebSocket is also defined in the init file as socketLog
const forLoginform = g(".for-login");
forLoginform.addEventListener("submit",(e)=>{	
  	e.preventDefault();
  	const emailAddress = g("#username"),pass = g("#pass");
	if (emailAddress.value !=="" && pass.value !=="") {
		socketLog.send(fy({
			type:"login",
			data:{username:emailAddress.value, pass:pass.value}
		}))
	}
});
// Signup submission. 
// In this case, we get two response from the Server 
// One, User Successfully Sign up [Account Created]
// Two User is alrady Registered with the specified Email Address!
const forSignupform = g(".for-signup");
forSignupform.addEventListener("submit",(e)=>{	
	e.preventDefault();
	// username Field
	const username = g("#signup-username"),
	// createPassword Field
			createPassword = g("#signup-pass"),
	// firstname Field
			firstname = g("#firstname"),
	// lastname Field
			lastname = g("#lastname");
	if (username.value !=="" && createPassword.value !=="") {
		socketLog.send(fy({
			type:"signup",
			data:{username:username.value, createPassword:createPassword.value,firstname:firstname.value, lastname:lastname.value}
		}))
	}
});
// Listen For Messages OR [Server Responses],
socketLog.onmessage=(event)=>{
	json = pars(event.data);// Parse The Stringfied Data Sent from the Server To JSON
	if(json.type == "userFound"){
		iDbMethod.init(user_db,"logedIn").putdata(json.data.column);
		displayModal("flex",()=>{
			g("#modal-message").innerHTML = json.data.message;
			callModalButton("1",()=>{
				window.location.href = "/" // Once the User Enteract with the Modal, take Him to the Home Page
			});
		});	
		// Here, the the user is being redirected to the Home Page, after 1.5s , if He doesn't enteract with the
		// Modal [ Automatically ]
		setTimeout(()=>{
			callModalButton("get1").click() 
		},1500);
	}
	// Tell the User that There's No user With the credential he Provided, Either Password OR Email Address
	if(json.type == "nouserFound"){	
		displayModal("flex",()=>{
			g("#modal-message").innerHTML = `${json.data.message},\n${json.data.errorMessage}`;
			callModalButton("1");
		});	
	}
	// Tell The user that the Server Found The User Alrady the With the Specified Email Address
	if(json.type == "userExist"){
		displayModal("flex",()=>{
			g("#modal-message").innerHTML = json.data.message;
			callModalButton("1",()=>{
				// Remove Values on the Input fields
				unval=(...n)=>{
					for(data of n)
						data.value =""
				};
				unval(g("#signup-username"),g("#signup-pass"),g("#firstname"),g("#lastname"))
			});
		});	
	}
	// (The Matter), After All, we want the user to succeed, so here the Account has been created, [Tadaah]
	if(json.type == "accountCreated"){		
		iDbMethod.init(user_db,"logedIn").putdata(json.data.column); // Inesert the Important data to the IDB
																	// To be used for auto login when the user visits the page/Site

		displayModal("flex",()=>{	
			g("#modal-message").innerHTML = json.data.message;
			callModalButton("1",()=>{
				window.location.href = "/"
			});
		});	
	}

}
