// login.js - 330885096

window.onload = function() {
	getToken();
	checkIfLoggedIn();
;}

function getToken() {
	var thisdate = new Date();
	var serverPage = "token";

	var xmlhttp1 = getxmlhttp();
	xmlhttp1.open("GET", serverPage);
	xmlhttp1.onreadystatechange = function() {
		getTokenAjaxHandler(xmlhttp1);
	}
	xmlhttp1.send(null);
}

function getTokenAjaxHandler(xmlhttp1) {
	if (xmlhttp1.readyState == 4 && xmlhttp1.status == 200) {
		var response = xmlhttp1.responseText;
		token = response;
		document.getElementById('_csrf').value = token;
	}
}

function checkIfLoggedIn() {
	var workspaceParams = window.location.search.substr(1);
	if (workspaceParams.indexOf("=error") > 0) {
		alert("Please ensure that username and password are correct and try again");
	}
}