// STEP 3
function communicateBetweenComponents(){
	$("next").click(function(){
		FSBL.Clients.RouterClient.query("accountTraversal", {action:"next"}, function(err, response){
			if(err){
				alert("Error: " + err);
			}else{
				$("input[name=accountNumber").val(response.data);
			}
		});
	});
}

// STEP 2
function getInitialCustomer(){
	var accountNumber=FSBL.Clients.WindowClient.options.customData.component["accountNumber"];
	$("input[name=accountNumber").val(accountNumber);
	alert(accountNumber);
}

document.addEventListener("DOMContentLoaded", function () {
	FSBL.useAllClients();
	FSBL.initialize(function(){
		getInitialCustomer();
		communicateBetweenComponents();
	});
})