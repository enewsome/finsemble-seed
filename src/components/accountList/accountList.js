var customers=[
["12345678","Sam Smith"],
["23456789","Bill Branson"],
["34567890","Tom Thomson"],
["45678901","Jim Jackson"],
["56789012","Ernie Edmonson"],
];

var customerIndex=0;
function setCustomerIndex(accountNumber){
	for(var i=0;i<customers.length;i++){
		if(customers[i][0]==accountNumber){
			customerIndex=i;
			return;
		}
	}
	customerIndex=0;
}

// STEP 4
function linkComponents(){

}

// STEP 3
function communicateBetweenComponents(){
	// Set up a server to respond to requests from clients. Here, clients will send requests for the next customer in the list.
	// We will respond by traversing through the customer list and sending the response
	FSBL.Clients.RouterClient.addResponder("accountTraversal", function(err, query){
		if(err) return;
		if(query.data.action=="next"){
			customerIndex++;
			if(customerIndex==customers.length) customerIndex=0;
		}else if(query.data.action=="prev"){
			customerIndex--;
			if(customerIndex==-1) customerIndex=customers.length-1;
		}

		// Respond to the accountDetail client with the next customer
		query.sendQueryResponse(null, customers[customerIndex][0]);
	});
}

// STEP 2
function launchAccountDetail(accountNumber){
	setCustomerIndex(accountNumber);
	var xy=getWindowLocation();

	FSBL.Clients.LauncherClient.spawn("accountDetail", {
		options:{ /* specify where we want accountDetail to be positioned */
			"defaultLeft": xy.x,
			"defaultTop": xy.y,
			"defaultWidth": 200,
			"defaultHeight": xy.h,
			customData:{
				component:{ /* provide some initialization data to accountDetail */
					"accountNumber": accountNumber
				}
			}
		}
	}, function(err, response){
		console.log(response);
		communicateBetweenComponents(); // --> Step 3
		linkComponents(); // --> Step 4
	});
}

function getWindowLocation(){
	// Fetch the current coordinates of this component
	// Add the width in order to get the coordinates for where
	// we want to pop up the account detail
	var w=FSBL.Clients.WindowClient.options;
	var xy={
		x: w.defaultLeft + w.defaultWidth,
		y: w.defaultTop,
		h: w.defaultHeight
	};
	return xy;
}

function clickCustomer(event){
	launchAccountDetail(event.data); // --> Step 2
}

function renderPage(){
	/* Very basic code to create a row of data for each customer in our array */
	var template=$("template")[0];
	for(let customer of customers){
		var row=$(document.importNode(template.content, true));
		row.find("account").text(customer[0]);
		row.find("name").text(customer[1]);
		row.find("account").parent().click(customer[0], clickCustomer);
		$("body").append(row);
	}
}

document.addEventListener("DOMContentLoaded", function () {
	FSBL.useAllClients();
	FSBL.initialize(function(){
		//alert(FSBL.Clients.WindowClient.options.customData.component["account-type"]);
		renderPage();
	});
})