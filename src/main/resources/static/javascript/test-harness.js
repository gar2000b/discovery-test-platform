var timeout;
var sessionTimeout;
var tabsCounter = 1;
var token = "";
var zIndex = 10;
var currentProjectId = 0;
var tabId = 0;
var workspaceName = "primary-workspace";

window.onload = function() {
	// TODO: add back to re-enable security
	// getToken();
	getSessionTimeout();
	openPrimaryWorkspace();
}

function openPrimaryWorkspace() {
	emptyTestSuite();
	openWorkspaceByName(workspaceName);
}

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
		document.getElementById('_csrf_logout').value = token;
	}
}

function getSessionTimeout() {
	var thisdate = new Date();
	var serverPage = "session-timeout";

	var xmlhttp1 = getxmlhttp();
	xmlhttp1.open("GET", serverPage);
	xmlhttp1.onreadystatechange = function() {
		getSessionTimeoutAjaxHandler(xmlhttp1);
	}
	xmlhttp1.send(null);
}

function getSessionTimeoutAjaxHandler(xmlhttp1) {
	if (xmlhttp1.readyState == 4 && xmlhttp1.status == 200) {
		var response = xmlhttp1.responseText;
		sessionTimeout = response;
	}
}

function logout() {
	document.getElementById('logout').submit();
}

function addNewView() {
	var testSuiteName = prompt("Please enter name of View: ");
	if (testSuiteName == null) {
		return;
	}
	
	tabsCounter++;
	console.log("tabsCounter = " + tabsCounter);
	$("div#tabs ul").append(
			"<li class='dynamicli' id='li-" + tabsCounter + "'><a href='#tabs-" + tabsCounter + "' onclick='tabId = " + tabsCounter + ";'>"
					+ testSuiteName + "</a></li>");
	/*
	 * Using the spring cron expressions:
	 * https://riptutorial.com/spring/example/21209/cron-expression
	 */
	$("div#tabs")
			.append(
					"<div class='dynamicdiv' id='tabs-"
							+ tabsCounter
							+ "'><p>"
							+ `<table width="100%">
	   <tr>
	       <th>Status</th>
	       <th>Type</th>
	       <th>Name</th>
	       <th>Topology</th>
	       <th>Last Success</th>
	       <th>Last Failure</th>
	       <th>Last Duration</th>
	       <th>Cron</th>
	       <th>Console</th>
	       <th>Delete</th>
	       <th>Execute</th>
	   </tr>
	   <tr align="center" id='test-` + tabsCounter + `-1'>
		   <td><img alt="status" src="images/pass.png"></td>
		   <td>IT</td>
		   <td><a id='test-name-test-` + tabsCounter + `-1' href='#' onclick='openModal("modal-test-` + tabsCounter + `-1");'>New Integration Test</a></td>
		   <td><a id='topology-test-` + tabsCounter + `-1' href='https://www.google.co.uk' target='_blank'>topology-link</a></td>
		   <td>01-01-2019 @ 00:00:00</td>
		   <td>01-01-2019 @ 00:00:00</td>
		   <td>0 ms</td>
		   <td id='cron-test-` + tabsCounter + `-1'>N/A</td>
		   <td><img alt="status" src="images/console.png" onclick="alert('Yet to be implemented');"></td>
		   <td><input type='button' value='Delete' onclick='deleteTest("test-` + tabsCounter + `-1");' /></td>
		   <td><input type="button" value="Execute" onclick='executeTest("test-` + tabsCounter + `-1", this);' /></td>
	   </tr>
	</table>`
							+ "</p><br/><p><input type='button' value='Rename this View?' onclick='renameView("
							+ tabsCounter + ");'/>&nbsp;&nbsp;<input type='button' value='Delete this View?' onclick='deleteView("
							+ tabsCounter + ");'/></p></div>");

	$("div#tabs").tabs("refresh");
	injectTestEntry("modal-test-" + tabsCounter + "-1", "tabs-" + tabsCounter);
	save();
}

function injectTestEntry(id, tabId) {
	var testEntry = `<input id="` + id + `" type="hidden" value="">`;
	document.getElementById(tabId).innerHTML += testEntry;
}

function addTestSuite(testSuiteName, html) {	
	tabsCounter++;
	var start = html.indexOf("renameView(") + 16;
	var end = html.indexOf(")", start);
	var id = html.substring(start, end);
	html = html.replace("(" + id + ")", "(" + tabsCounter + ")");
	html = html.replace("(" + id + ")", "(" + tabsCounter + ")");
	
	console.log("tabsCounter = " + tabsCounter);

	$("div#tabs ul").append(
			"<li class='dynamicli' id='li-" + tabsCounter + "'><a href='#tabs-" + tabsCounter + "' onclick='tabId = " + tabsCounter + ";'>"
					+ testSuiteName + "</a></li>");

	$("div#tabs")
			.append(
					"<div class='dynamicdiv' id='tabs-"
							+ tabsCounter
							+ "'>" 
							+ html
							+ "</div>");
}

function deleteView(id) {
	var result = confirm("Are you sure you wish to remove this View? If so, click OK.");

	if (result) {
		$("#tabs-" + id).remove();
		document.getElementById("li-" + id).remove();
		save();
	}
}

function emptyTestSuite() {
	$(".dynamicli").remove();
	$(".dynamicdiv").remove();
}

function wait(ms) {
	var d = new Date();
	var d2 = null;
	do { d2 = new Date(); }
	while(d2-d < ms);
}

function renameView(id) {
	var name = prompt("Please enter new name:");
	var hrefStr = "a[href='#tabs-" + id + "']";
	$(hrefStr).closest("a").text(name);
	save();
}

function testRedis() {
	emptyTestSuite();
	openWorkspaceByName("test-project-test");
}

function openWorkspaceByName(workspaceName) {
	var thisdate = new Date();
	var serverPage = "projects/name/" + workspaceName;

	var xmlhttp1 = getxmlhttp();
	xmlhttp1.open("GET", serverPage);
	xmlhttp1.onreadystatechange = function() {
		openWorkspaceAjaxHandler(xmlhttp1, true, workspaceName);
	}
	xmlhttp1.setRequestHeader("_csrf", token);
	xmlhttp1.send(null);
}

function openWorkspaceAjaxHandler(xmlhttp1, workspaceFlag, workspaceName) {
	try {
		if (xmlhttp1.readyState == 4 && xmlhttp1.status == 200) {
			var response = xmlhttp1.responseText;
			var project = JSON.parse(response);
			currentProjectId = project.projectId;
			tabsCounter = 1;
			for(var i = 0; i < project.workspaceState.length; i++) {
				addTestSuite(project.workspaceState[i].name, atob(project.workspaceState[i].tab));
			}
			$("div#tabs").tabs("refresh");
			zIndex = project.workspaceState.zIndex;
			$("tabs").tabs("refresh");
			var tag = document.getElementById("ui-id-2");
			if (tag != null) {
				tag.click();
			}
		} else if (xmlhttp1.status == 403) {
			alert("403 error");
		} else if (xmlhttp1.readyState == 4 && xmlhttp1.status == 404) {
			create(workspaceName);
		}
	}
	catch(error) {
		return;
	}
}

function create(workspaceName) {
	var project = {};
	project["projectId"] = 0;
	project["name"] = workspaceName;
	
	var tabs = [];
	var num_tabs = $("div#tabs ul li").length + 1;
	
	for(var i = 0; i < $(".dynamicli").length; i++) {
		var id = $(".dynamicli")[i].id;
		id = id.substr(id.indexOf("-") + 1, id.length);
		var tab = {};
		tab["name"] = document.getElementById("ui-id-" + id).innerHTML;
		tab["tab"] = btoa(document.getElementById("tabs-" + id).innerHTML);
		tabs.push(tab);
	}
	
	project["workspaceState"] = tabs;
	
	var thisdate = new Date();
	var serverPage = "projects";

	var xmlhttp1 = getxmlhttp();
	xmlhttp1.open("POST", serverPage);
	xmlhttp1.onreadystatechange = function() {
		createAjaxHandler(xmlhttp1, true, workspaceName);
	}
	xmlhttp1.setRequestHeader("_csrf", token);
	xmlhttp1.send(JSON.stringify(project));
}

function createAjaxHandler(xmlhttp1, workspaceFlag, workspaceName) {
	try {
		if (xmlhttp1.readyState == 4 && xmlhttp1.status == 201) {
			var response = xmlhttp1.responseText;
			var project = JSON.parse(response);
			currentProjectId = response;
		}
	}
	catch(error) {
		return;
	}
}

function testCreate() {
	var project = {};
	project["projectId"] = 0;
	project["name"] = "primary-workspace";
	
	var tabs = [];
	var num_tabs = $("div#tabs ul li").length + 1;
	
	for(var i = 0; i < $(".dynamicli").length; i++) {
		var id = $(".dynamicli")[i].id;
		id = id.substr(id.indexOf("-") + 1, id.length);
		var tab = {};
		tab["name"] = document.getElementById("ui-id-" + id).innerHTML;
		tab["tab"] = btoa(document.getElementById("tabs-" + id).innerHTML);
		tabs.push(tab);
	}
	
	project["workspaceState"] = tabs;
	
	var thisdate = new Date();
	var serverPage = "projects";

	var xmlhttp1 = getxmlhttp();
	xmlhttp1.open("POST", serverPage);
	xmlhttp1.onreadystatechange = function() {
		testCreateAjaxHandler(xmlhttp1, true);
	}
	xmlhttp1.setRequestHeader("_csrf", token);
	xmlhttp1.send(JSON.stringify(project));
}

function testCreateAjaxHandler(xmlhttp1, workspaceFlag) {
	try {
		if (xmlhttp1.readyState == 4 && xmlhttp1.status == 201) {
			var response = xmlhttp1.responseText;
			var project = JSON.parse(response);
			alert(response);
		} else {
			alert(xmlhttp1.status);
		}
	}
	catch(error) {
		return;
	}
}

function save() {
	var project = {};
	project["projectId"] = currentProjectId;
	if (currentProjectId <= 0) {
		alert("There seems to be a problem with the currentProjectId: " + currentProjectId);
	}
	project["name"] = "primary-workspace";
	
	var tabs = [];
	var num_tabs = $("div#tabs ul li").length + 1;
	
	for(var i = 0; i < $(".dynamicli").length; i++) {
		var id = $(".dynamicli")[i].id;
		id = id.substr(id.indexOf("-") + 1, id.length);
		var tab = {};
		tab["name"] = document.getElementById("ui-id-" + id).innerHTML;
		tab["tab"] = btoa(document.getElementById("tabs-" + id).innerHTML);
		tabs.push(tab);
	}
	
	project["workspaceState"] = tabs;
	
	var thisdate = new Date();
	var serverPage = "projects/" + currentProjectId;

	var xmlhttp1 = getxmlhttp();
	xmlhttp1.open("POST", serverPage);
	xmlhttp1.onreadystatechange = function() {
		saveAjaxHandler(xmlhttp1, true);
	}
	xmlhttp1.setRequestHeader("_csrf", token);
	xmlhttp1.send(JSON.stringify(project));
}

function saveAjaxHandler(xmlhttp1, workspaceFlag) {
	try {
		if (xmlhttp1.readyState == 4 && xmlhttp1.status == 200) {
			var response = xmlhttp1.responseText;
			var project = JSON.parse(response);
			// alert(response);
		} else if (xmlhttp1.status != 200) {
			alert(xmlhttp1.status);
		}
	}
	catch(error) {
		return;
	}
}

function addNewIntegrationTest() {
	if (tabId == 0) {
		alert('Please select a Test Suite Tab before adding a new test');
	} else {
		var table = document.getElementById("tabs-" + tabId).getElementsByTagName("table");
		var rowLength = table[0].getElementsByTagName("tr").length;
		var row = table[0].insertRow(rowLength);
		row.align = "center";
		
		var cell0 = row.insertCell(0);
		var cell1 = row.insertCell(1);
		var cell2 = row.insertCell(2);
		var cell3 = row.insertCell(3);
		var cell4 = row.insertCell(4);
		var cell5 = row.insertCell(5);
		var cell6 = row.insertCell(6);
		var cell7 = row.insertCell(7);
		var cell8 = row.insertCell(8);
		var cell9 = row.insertCell(9);
		var cell10 = row.insertCell(10);
		
		var largestNumber = 1;
		var rows = table[0].getElementsByTagName("tr");
		for(var i = 1; i < rows.length; i++) {
			id = rows[i].id;
			var startPos = id.indexOf("-", id.indexOf("-") + 1) + 1;
			var number = parseInt(id.substring(startPos), 10);
			if (number > largestNumber) {
				largestNumber = number;
			}
		}
		largestNumber++;
		row.id = "test-" + tabId + "-" + largestNumber;
		
		cell0.innerHTML = "<img alt='status' src='images/pass.png'>";
		cell1.innerHTML = "IT";
		cell2.innerHTML = "<a id='test-name-" + row.id + "' href='#' onclick='openModal(\"modal-" + row.id + "\");'>New Integration Test</a>";
		cell3.innerHTML = "<a id='topology-" + row.id + "' href='https://www.google.co.uk' target='_blank'>topology-link</a>";
		cell4.innerHTML = "01-01-2019 @ 00:00:00";
		cell5.innerHTML = "01-01-2019 @ 00:00:00";
		cell6.innerHTML = "0 ms";
		cell7.id = "cron-" + row.id;
		cell7.innerHTML = "N/A";
		cell8.innerHTML = "<img alt=\"status\" src=\"images/console.png\" onclick=\"alert('Yet to be implemented');\">";
		cell9.innerHTML = "<input type='button' value='Delete' onclick='deleteTest(\"" + row.id + "\");' />";
		cell10.innerHTML = "<input type='button' value='Execute' onclick='executeTest(\"" + row.id + "\", this);' />";
		
		injectTestEntry("modal-" + row.id, "tabs-" + tabId);
		save();
	}
}

function addNewEndToEndTest() {
	if (tabId == 0) {
		alert('Please select a Test Suite Tab before adding a new test');
	} else {
		var table = document.getElementById("tabs-" + tabId).getElementsByTagName("table");
		var rowLength = table[0].getElementsByTagName("tr").length;
		var row = table[0].insertRow(rowLength);
		row.align = "center";
		row.id = "test-" + tabId + "-" + rowLength;
		
		var cell0 = row.insertCell(0);
		var cell1 = row.insertCell(1);
		var cell2 = row.insertCell(2);
		var cell3 = row.insertCell(3);
		var cell4 = row.insertCell(4);
		var cell5 = row.insertCell(5);
		var cell6 = row.insertCell(6);
		var cell7 = row.insertCell(7);
		var cell8 = row.insertCell(8);
		var cell9 = row.insertCell(9);
		var cell10 = row.insertCell(10);
		
		cell0.innerHTML = "<img alt='status' src='images/pass.png'>";
		cell1.innerHTML = "ETE";
		cell2.innerHTML = "<a href='#' onclick='openModal(\"itModal\");'>New End-to-End Test</a>";
		cell3.innerHTML = "<a href='https://www.google.co.uk' target='_blank'>topology-link</a>";
		cell4.innerHTML = "01-01-2019 @ 00:00:00";
		cell5.innerHTML = "01-01-2019 @ 00:00:00";
		cell6.innerHTML = "0 ms";		
		cell7.innerHTML = "N/A";
		cell8.innerHTML = "<img alt=\"status\" src=\"images/console.png\" onclick=\"alert('Yet to be implemented');\">";
		cell9.innerHTML = "<input type='button' value='Delete' onclick='deleteTest(\"" + row.id + "\");' />";
		cell10.innerHTML = "<input type='button' value='Execute' />";
		
		save();
	}
}

function addNewPerformanceTest() {
	if (tabId == 0) {
		alert('Please select a Test Suite Tab before adding a new test');
	} else {
		var table = document.getElementById("tabs-" + tabId).getElementsByTagName("table");
		var rowLength = table[0].getElementsByTagName("tr").length;
		var row = table[0].insertRow(rowLength);
		row.align = "center";
		row.id = "test-" + tabId + "-" + rowLength;
		
		var cell0 = row.insertCell(0);
		var cell1 = row.insertCell(1);
		var cell2 = row.insertCell(2);
		var cell3 = row.insertCell(3);
		var cell4 = row.insertCell(4);
		var cell5 = row.insertCell(5);
		var cell6 = row.insertCell(6);
		var cell7 = row.insertCell(7);
		var cell8 = row.insertCell(8);
		var cell9 = row.insertCell(9);
		var cell10 = row.insertCell(10);
		
		cell0.innerHTML = "<img alt='status' src='images/pass.png'>";
		cell1.innerHTML = "PERF";
		cell2.innerHTML = "<a href='#' onclick='openModal(\"itModal\");'>New Performance Test</a>";
		cell3.innerHTML = "<a href='https://www.google.co.uk' target='_blank'>topology-link</a>";
		cell4.innerHTML = "01-01-2019 @ 00:00:00";
		cell5.innerHTML = "01-01-2019 @ 00:00:00";
		cell6.innerHTML = "0 ms";		
		cell7.innerHTML = "N/A";
		cell8.innerHTML = "<img alt=\"status\" src=\"images/console.png\" onclick=\"alert('Yet to be implemented');\">";
		cell9.innerHTML = "<input type='button' value='Delete' onclick='deleteTest(\"" + row.id + "\");' />";
		cell10.innerHTML = "<input type='button' value='Execute' />";
		
		save();
	}
}

function deleteTest(rowId) {
	document.getElementById(rowId).remove();
	document.getElementById("modal-" + rowId).remove();
	save();
}

function openModal(entry) {
	var modal = document.getElementById('itModal');
	modal.style.display = "block";
	document.getElementById('update').setAttribute( "onClick", "javascript: updateTestEntry('" + entry + "');" );

	// TODO - read hidden input value json and convert to type.
//	alert(document.getElementById(entry).value);
	if (document.getElementById(entry).value) {
		var testSuite = JSON.parse(document.getElementById(entry).value);
		document.getElementById('name-input').value = testSuite.name;
		document.getElementById('topology-input').value = testSuite.topology;
		if (testSuite["cron-schedule"]) {
			document.getElementById("scheduledYes").click();
			document.getElementById('cron-schedule').value = testSuite["cron-schedule"];
		}
		if (testSuite["git-repo"]) {
			document.getElementById("runningNo").click();
			document.getElementById('git-repo').value = testSuite["git-repo"];
			document.getElementById('app-port-no').value = testSuite["app-port-no"];
			if (testSuite["config-overrides"] && testSuite["config-overrides"].length > 0) {
				document.getElementById("overridesNo").click();
				document.getElementById("overridesYes").click();
				for (var i = 0; i < testSuite["config-overrides"].length - 1; i++) {
					document.getElementById("addConfigButton").click(this);
				}
				var table = document.getElementById('config-table');
				var rows = table.children[0].children;
				for (var i = 1; i < rows.length - 1; i++) {
					var row = rows[i];
					row.children[0].children[0].value = testSuite["config-overrides"][i-1].key;
					row.children[1].children[0].value = testSuite["config-overrides"][i-1].value;
				}
			}
		}
		if (testSuite["tests"] && testSuite["tests"].length > 0) {
			for (var i = 0; i < testSuite["tests"].length; i++) {
				addTest();
			}
			var table = document.getElementById('itTestTable');
			var rows = table.getElementsByClassName("test-level");
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				var testTable = row.children[0].children[1];
//				alert("i: " + i);
				var test = testSuite["tests"][i];
				var injectionRows = testTable.getElementsByClassName("test-injection-row");
				var assertionRows = testTable.getElementsByClassName("test-assertion-row");
				openInjectionRows(injectionRows, test);
				openAssertionRows(assertionRows, test);
			}
		}
	}
}

function openInjectionRows(injectionRows, test) {
	test = test["test-pair"][0];
	var injectionType = test["injection-type"];
	if (injectionType == 'http') {
		openInjectionHttp(injectionRows, test);
	}
	if (injectionType == 'kafka') {
		openInjectionKafka(injectionRows, test);
	}
	if (injectionType == 'ftp') {
		openInjectionFtp(injectionRows, test);
	}
	if (injectionType == 'rdbms') {
		openInjectionRdbms(injectionRows, test);
	}
}

function openInjectionHttp(injectionRows, test) {
	injectionRows[0].getElementsByTagName('select')[0].value = "http";
	updateTestInjectionType(injectionRows[0].getElementsByTagName('select')[0]);
//	alert(test["endpoint"]);
	injectionRows[2].getElementsByTagName('input')[0].value = test["endpoint"];
	injectionRows[4].getElementsByTagName('select')[0].value = test["verb"];
	injectionRows[8].getElementsByTagName('textarea')[0].value = test["body"];
	
	for(var i = 0; i < test["headers"].length; i++) {
		if (i > 0) {
			addHttpHeader(document.getElementById('http-header-button'), test["headers"][i]["key"], test["headers"][i]["value"]);
		} else {
			updateFirstHeader(document.getElementById('http-header-button'), test["headers"][i]["key"], test["headers"][i]["value"]);
		}
//		alert(test["headers"][i]["key"]);
//		alert(test["headers"][i]["value"]);
	}
	
//	addHttpHeader(document.getElementById('http-header-button'));
//	addHttpHeader(document.getElementById('http-header-button'));
//	addHttpHeader(document.getElementById('http-header-button'));
	
	// var testInjection = {};
	// testInjection["type"] = "injection";
	// testInjection["injection-type"] = injectionRows[0].getElementsByTagName('select')[0].value;
	// testInjection["endpoint"] = injectionRows[2].getElementsByTagName('input')[0].value;
	// testInjection["verb"] = injectionRows[4].getElementsByTagName('select')[0].value;
	// testInjection["body"] = injectionRows[8].getElementsByTagName('textarea')[0].value;

	// if (document.getElementById('header-table') != null) {
	// 	var table = document.getElementById('header-table');
	// 	var rows = table.children[0].children;
	// 	testInjection["headers"] = [];
	// 	for (var i = 1; i < rows.length - 1; i++) {
	// 		var row = rows[i];
	// 		var key = row.children[0].children[0].value;
	// 		var value = row.children[1].children[0].value;
	// 		var header = {}
	// 		header["key"] = key;
	// 		header["value"] = value;
	// 		testInjection["headers"].push(header);
	// 	}
	// }

	// // alert(testInjection["verb"]);
	// test["test-pair"].push(testInjection);
}

function openInjectionKafka(injectionRows, test) {
	// TODO
}

function openInjectionFtp(injectionRows, test) {
	// TODO
}

function openInjectionRdbms(injectionRows, test) {
	// TODO
}

function openAssertionRows(assertionRows, test) {
	
//	var injectionType = test["injection-type"];
//	if (injectionType == 'http') {
//		openInjectionHttp(injectionRows, test);
//	}
	
	test = test["test-pair"][1];
//	alert('here1');
	var assertionType = test["assertion-type"];
	if (assertionType == 'http') {
//		alert('here2');
		openAssertionHttp(assertionRows, test);
	}
	if (assertionType == 'http-downstream') {
		openAssertionHttpDownstream(assertionRows, test);
	}
	if (assertionType == 'kafka') {
		openAssertionKafka(assertionRows, test);
	}
	if (assertionType == 'ftp') {
		openAssertionFtp(assertionRows, test);
	}
	if (assertionType == 'rdbms') {
		openAssertionRdbms(assertionRows, test);
	}
}

function openAssertionHttp(assertionRows, test) {
	
	assertionRows[0].getElementsByTagName('select')[0].value = "http";
	updateTestAssertionType(assertionRows[0].getElementsByTagName('select')[0]);
//	alert(test["endpoint"]);
	assertionRows[2].getElementsByTagName('select')[0].value = test["http-status"];
	assertionRows[4].getElementsByTagName('select')[0].value = test["response-type"];
	assertionRows[6].getElementsByTagName('textarea')[0].value = test["expected-payload"];
	
//	alert('here3')
//	var testAssertion = {};
//	testAssertion["type"] = "assertion";
//	testAssertion["assertion-type"] = assertionRows[0].getElementsByTagName('select')[0].value;
//	testAssertion["http-status"] = assertionRows[2].getElementsByTagName('select')[0].value;
//	testAssertion["response-type"] = assertionRows[4].getElementsByTagName('select')[0].value;
//	testAssertion["expected-payload"] = assertionRows[6].getElementsByTagName('textarea')[0].value;
//
//	alert(testAssertion["expected-payload"]);
//	test["test-pair"].push(testAssertion);
}

function openAssertionHttpDownstream(assertionRows, test) {
	// TODO
}

function openAssertionKafka(assertionRows, test) {
	// TODO
}

function openAssertionFtp(assertionRows, test) {
	// TODO
}

function openAssertionRdbms(assertionRows, test) {
	// TODO
}

function updateTestEntry(entry) {
	var testSuite = {};
	testSuite["id"] = entry;
	testSuite["name"] = document.getElementById('name-input').value;
	testSuite["topology"] = document.getElementById('topology-input').value;
	if (document.getElementById('cron-schedule') != null) {
		testSuite["cron-schedule"] = document.getElementById('cron-schedule').value;
	}
	if (document.getElementById('git-repo') != null) {
		testSuite["git-repo"] = document.getElementById('git-repo').value;
	}
	if (document.getElementById('app-port-no') != null) {
		testSuite["app-port-no"] = document.getElementById('app-port-no').value;
	}
	if (document.getElementById('config-table') != null) {
		var table = document.getElementById('config-table');
		var rows = table.children[0].children;
		testSuite["config-overrides"] = [];
		for (var i = 1; i < rows.length - 1; i++) {
			var row = rows[i];
			var key = row.children[0].children[0].value;
			var value = row.children[1].children[0].value;
			var configEntry = {}
			configEntry["key"] = key;
			configEntry["value"] = value;
			testSuite["config-overrides"].push(configEntry);
		}
	}
	
	var table = document.getElementById('itTestTable');
	var rows = table.getElementsByClassName("test-level");
	testSuite["tests"] = [];
	for (var i = 0; i < rows.length; i++) {
		var test = {}
		test["test-pair"] = [];
		var row = rows[i];
		var testTable = row.children[0].children[1];
		var injectionRows = testTable.getElementsByClassName("test-injection-row");
		var assertionRows = testTable.getElementsByClassName("test-assertion-row");
		processInjectionRows(injectionRows, test);
		processAssertionRows(assertionRows, test);
		testSuite["tests"].push(test);
	}
	
	document.getElementById(entry).value = JSON.stringify(testSuite);
//	alert("entry is: " + entry);
//	alert(document.getElementById(entry).value);
	
	testId = entry.replace('modal-test', 'test-name-test');
//	alert(testId);
//	alert(document.getElementById('name-input').value);
	document.getElementById(testId).innerHTML = document.getElementById('name-input').value;
	
	topologyId = entry.replace('modal-test', 'topology-test');
	document.getElementById(topologyId).href = document.getElementById('topology-input').value;
	
	if(document.getElementById('cron-schedule') != null) {
		cronId = entry.replace('modal-test', 'cron-test');
		document.getElementById(cronId).innerHTML = document.getElementById('cron-schedule').value;	
	}
	
	save();
	resetServiceModal();
	closeServiceModel();
}

function resetServiceModal() {
	document.getElementById('name-input').value = "";
	document.getElementById('topology-input').value = "";
	if (document.getElementById("overridesNo")) {
		document.getElementById("overridesNo").click();
	}
	document.getElementById("scheduledNo").click();
	document.getElementById("runningYes").click();
	var table = document.getElementById('itTestTable');
	var rows = table.getElementsByClassName("test-level");
	for (var i = 0; i < rows.length; i++) {
		rows[i].remove();
	}
}

function processInjectionRows(injectionRows, test) {
	var injectionType = injectionRows[0].children[1].children[0].value;
	if (injectionType == 'http') {
		processInjectionHttp(injectionRows, test);
	}
	if (injectionType == 'kafka') {
		processInjectionKafka(injectionRows, test);
	}
	if (injectionType == 'ftp') {
		processInjectionFtp(injectionRows, test);
	}
	if (injectionType == 'rdbms') {
		processInjectionRdbms(injectionRows, test);
	}
}

function processInjectionHttp(injectionRows, test) {
	var testInjection = {};
	testInjection["type"] = "injection";
	testInjection["injection-type"] = injectionRows[0].getElementsByTagName('select')[0].value;
	testInjection["endpoint"] = injectionRows[2].getElementsByTagName('input')[0].value;
	testInjection["verb"] = injectionRows[4].getElementsByTagName('select')[0].value;
	testInjection["body"] = injectionRows[8].getElementsByTagName('textarea')[0].value;

	if (document.getElementById('header-table') != null) {
		var table = document.getElementById('header-table');
		var rows = table.children[0].children;
		testInjection["headers"] = [];
		for (var i = 1; i < rows.length - 1; i++) {
			var row = rows[i];
			var key = row.children[0].children[0].value;
			var value = row.children[1].children[0].value;
			var header = {}
			header["key"] = key;
			header["value"] = value;
			testInjection["headers"].push(header);
		}
	}

	// alert(testInjection["verb"]);
	test["test-pair"].push(testInjection);
}

function processInjectionKafka(injectionRows, test) {
	// TODO
}

function processInjectionFtp(injectionRows, test) {
	// TODO
}

function processInjectionRdbms(injectionRows, test) {
	// TODO
}

function processAssertionRows(assertionRows, test) {
	var assertionType = assertionRows[0].children[1].children[0].value;
	if (assertionType == 'http') {
		processAssertionHttp(assertionRows, test);
	}
	if (assertionType == 'http-downstream') {
		processAssertionHttpDownstream(assertionRows, test);
	}
	if (assertionType == 'kafka') {
		processAssertionKafka(assertionRows, test);
	}
	if (assertionType == 'ftp') {
		processAssertionFtp(assertionRows, test);
	}
	if (assertionType == 'rdbms') {
		processAssertionRdbms(assertionRows, test);
	}
}

function processAssertionHttp(assertionRows, test) {
	var testAssertion = {};
	testAssertion["type"] = "assertion";
	testAssertion["assertion-type"] = assertionRows[0].getElementsByTagName('select')[0].value;
	testAssertion["http-status"] = assertionRows[2].getElementsByTagName('select')[0].value;
	testAssertion["response-type"] = assertionRows[4].getElementsByTagName('select')[0].value;
	testAssertion["expected-payload"] = assertionRows[6].getElementsByTagName('textarea')[0].value;

	// alert(testAssertion["expected-payload"]);
	test["test-pair"].push(testAssertion);
}

function processAssertionHttpDownstream(assertionRows, test) {
	// TODO
}

function processAssertionKafka(assertionRows, test) {
	// TODO
}

function processAssertionFtp(assertionRows, test) {
	// TODO
}

function processAssertionRdbms(assertionRows, test) {
	// TODO
}

function closeServiceModel() {
	resetServiceModal();
	var modal = document.getElementById('itModal');
	modal.style.display = "none";
}

function addScheduledRows() {
	var table = document.getElementById('itTestTable');
	var rows = table.getElementsByTagName("tr");
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].id == "scheduled-row") {
			var row = table.insertRow(i + 1);
			row.className = "top-level color-grouping-2";
			var cell0 = row.insertCell(0);
			cell0.innerHTML = "Cron Schedule - e.g: 0 0 6 * * *";
			cell0.colSpan = "2";
			
			var row = table.insertRow(i + 2);
			row.className = "top-level color-grouping-2";
			var cell0 = row.insertCell(0);
			cell0.colSpan = "2";
			cell0.innerHTML = "<input type='text' id='cron-schedule' value='' />";
			break;
		}
	}
}

function removeScheduledRows() {
	var table = document.getElementById('itTestTable');
	var rows = table.getElementsByTagName("tr");
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].id == "scheduled-row") {
			rows[i + 1].remove();
			rows[i + 1].remove();
		}
	}
}

function addNotRunningRows() {
	var table = document.getElementById('itTestTable');
	var rows = table.getElementsByTagName("tr");
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].id == "not-running-row") {
			var row = table.insertRow(i + 1);
			row.className = "top-level color-grouping-3";
			var cell0 = row.insertCell(0);
			cell0.innerHTML = "Git Repo Location";
			cell0.colSpan = "2";
			
			var row = table.insertRow(i + 2);
			row.className = "top-level color-grouping-3";
			var cell0 = row.insertCell(0);
			cell0.colSpan = "2";
			cell0.innerHTML = "<input type='text' id='git-repo' value='' size='60' />";
			
			var row = table.insertRow(i + 3);
			row.className = "top-level color-grouping-3";
			var cell0 = row.insertCell(0);
			cell0.innerHTML = "App Port Number";
			cell0.colSpan = "2";
			
			var row = table.insertRow(i + 4);
			row.className = "top-level color-grouping-3";
			var cell0 = row.insertCell(0);
			cell0.colSpan = "2";
			cell0.innerHTML = "<input type='text' id='app-port-no' value='' />";
			
			var row = table.insertRow(i + 5);
			row.className = "top-level color-grouping-4";
			row.id = "config-row";
			var cell0 = row.insertCell(0);
			cell0.colSpan = "2";
			cell0.innerHTML = "<b>Will there be app config overrides? - <input type='radio' name='overrides' id='overridesYes' value='yes' onchange='addConfigRows();'> Yes <input type='radio' name='overrides' id='overridesNo' value='no' checked='checked' onchange='removeConfigRows();'> No</b>";
			break;
		}
	}
}

function removeNotRunningRows() {
	var table = document.getElementById('itTestTable');
	var rows = table.getElementsByTagName("tr");
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].id == "not-running-row") {
			var overrides = document.getElementsByName('overrides');
			if (overrides[0].checked == true) {
				removeConfigRows();
			}
			
			rows[i + 1].remove();
			rows[i + 1].remove();
			rows[i + 1].remove();
			rows[i + 1].remove();
			rows[i + 1].remove();
		}
	}
}

function addConfigRows() {
	var table = document.getElementById('itTestTable');
	var rows = table.getElementsByTagName("tr");
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].id == "config-row") {
			var row = table.insertRow(i + 1);
			row.className = "top-level color-grouping-4";
			var cell0 = row.insertCell(0);
			cell0.colSpan = "2";
			cell0.innerHTML =
				`<table id='config-table' class=''color-grouping-4'>
					<tr id='config-entry-row' align='left'>
						<th>Key</th>
						<th>Value</th>
						<th>Remove</th>
					</tr>
					<tr>
						<td><input type='text' /></td>
						<td><input type='text' /></td>
						<td><input type='button' value=' - ' onclick='removeConfigEntry(this);' /></td>
					</tr>
					<tr>
						<td colspan='3'><input type='button' id='addConfigButton' value=' + ' onclick='addConfigEntry(this);' /> <b>Add Config Entry</b></td>
					</tr>
				</table>`;
			break;
		}
	}
}

function removeConfigRows() {
	var table = document.getElementById('itTestTable');
	var rows = table.getElementsByTagName("tr");
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].id == "config-row") {
			rows[i + 1].remove();
		}
	}
}

function addConfigEntry(button) {
	var table = button.parentNode.parentNode.parentNode;
	// alert(table);
	var rows = table.getElementsByTagName("tr");
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].id == "config-entry-row") {
			var row = table.insertRow(rows.length - 1);
			var cell0 = row.insertCell(0);
			cell0.innerHTML = "<input type='text' />";
			var cell1 = row.insertCell(1);
			cell1.innerHTML = "<input type='text' />";
			var cell2 = row.insertCell(2);
			cell2.innerHTML = "<input type='button' value=' - ' onclick='removeConfigEntry(this);' />";
			break;
		}
	}
}

function removeConfigEntry(button) {
	button.parentNode.parentNode.remove();
}

function addTest() {
	var table = document.getElementById('itTestTable');
	var rows = table.getElementsByClassName("top-level");
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].id == "add-test-row") {
			var row = table.insertRow(i);
			row.className = "test-level";
			var cell0 = row.insertCell(0);
			cell0.colSpan = "2";
			cell0.innerHTML =
				`<hr><table>
					<tr>
						<td><b>Test:</b> <input type='button' value=' - ' onclick='removeTestInjectionEntry(this);' /></td>
					</tr>
					<tr class='test-injection-row'>
						<td>
							<b>Test Injection Type: </b> 
						</td>
						<td colspan='2'>
							<select onchange='updateTestInjectionType(this);'>
								<option value=''>Please select</option>
								<option value='http'>HTTP</option>
								<option value='kafka'>KAFKA</option>
								<option value='ftp'>FTP</option>
								<option value='rdbms'>RDBMS</option>
							</select>
						</td>
					</tr> 
					<tr class='test-assertion-row' id='test-assertion-type'>
						<td>
							<b>Test Assertion Type: </b> 
						</td>
						<td colspan='2'>
							<select onchange='updateTestAssertionType(this);'>
								<option value=''>Please select</option>
								<option value='http'>HTTP - (on injection response)</option>
								<option value='http-downstream'>HTTP - (downstream call intercept)</option>
								<option value='kafka'>KAFKA</option>
								<option value='ftp'>FTP</option>
								<option value='rdbms'>RDBMS</option>
							</select>
						</td>
					</tr>
				</table>`;
			break;
		}
	}
}

function updateTestInjectionType(select) {
	if (select.value == 'http') {
		populateHttpInjectionEntry(select);
	}
	if (select.value == 'kafka') {
		populateKafkaInjectionEntry(select);
	}
	if (select.value == 'ftp') {
		populateFtpInjectionEntry(select);
	}
	if (select.value == 'rdbms') {
		populateRdbmsInjectionEntry(select);
	}
	if (select.value == '') {
		resetTestInjection(select);
	}
}

function updateTestAssertionType(select) {
	if (select.value == 'http') {
		populateHttpAssertionEntry(select);
	}
	if (select.value == 'kafka') {
		populateKafkaAssertionEntry(select);
	}
	if (select.value == 'ftp') {
		populateFtpAssertionEntry(select);
	}
	if (select.value == 'rdbms') {
		populateRdbmsAssertionEntry(select);
	}
	if (select.value == '') {
		resetTestAssertion(select);
	}
}

function populateHttpInjectionEntry(select) {
	var table = select.parentNode.parentNode.parentNode;
	var rows = table.getElementsByClassName("test-injection-row");
	if (rows.length > 1) {
		for (var i = rows.length - 1; i > 0; i--) {
			rows[i].remove();
		}
	}
	
	var row = table.insertRow(2);
	row.className = 'test-injection-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "3";
	cell0.innerHTML = "<b>Endpoint:</b>";
	
	var row = table.insertRow(3);
	row.className = 'test-injection-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "3";
	cell0.innerHTML = "<input type='text' value='' size='60' />";
	
	var row = table.insertRow(4);
	row.className = 'test-injection-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "3";
	cell0.innerHTML = "<b>Verb:</b>";
	
	var row = table.insertRow(5);
	row.className = 'test-injection-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "3";
	cell0.innerHTML = `
		<select onchange=''>
			<option value='post'>POST</option>
			<option value='put'>PUT</option>
			<option value='get'>GET</option>
			<option value='delete'>DELETE</option>
		</select>
	`;
	
	var row = table.insertRow(6);
	row.className = 'test-injection-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "3";
	cell0.innerHTML = "<b>Headers:</b>";
	
	var row = table.insertRow(7);
	row.className = 'test-injection-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "3";
	cell0.innerHTML =
		`<table id='header-table'>
			<tr id='header-entry-row' align='left'>
				<th>Key</th>
				<th>Value</th>
				<th>Remove</th>
			</tr>
			<tr>
				<td><input type='text' /></td>
				<td><input type='text' /></td>
				<td><input type='button' value=' - ' onclick='removeHttpHeader(this);' /></td>
			</tr>
			<tr>
				<td colspan='3'><input id='http-header-button' type='button' value=' + ' onclick='addHttpHeader(this);' /> <b>Add Header</b></td>
			</tr>
		</table>`;
	
	var row = table.insertRow(8);
	row.className = 'test-injection-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "3";
	cell0.innerHTML = "<b>Request Body:</b>";
	
	var row = table.insertRow(9);
	row.className = 'test-injection-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "3";
	cell0.innerHTML = "<textarea rows='4' cols='80' style='border: 1px solid black;'>";
}

function populateHttpAssertionEntry(select) {
	var table = select.parentNode.parentNode.parentNode;
	var rows = table.getElementsByClassName("test-assertion-row");
	if (rows.length > 1) {
		for (var i = rows.length - 1; i > 0; i--) {
			rows[i].remove();
		}
	}
	
	var position = table.children.length - 1;
	
	var row = table.insertRow(++position);
	row.className = 'test-assertion-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "3";
	cell0.innerHTML = "<b>HTTP Status:</b>";
	
	var row = table.insertRow(++position);
	row.className = 'test-assertion-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "3";
	cell0.innerHTML = `
						<select onchange=''>
							<option value=''>Please select</option>
							<option value='200'>200 OK</option>
							<option value='201'>201 Created</option>
							<option value='202'>202 Accepted</option>
							<option value='203'>203 Non-Authoritative Information</option>
							<option value='204'>204 No Content</option>
							<option value='205'>205 Reset Content</option>
							<option value='206'>206 Partial Content</option>
							<option value='207'>207 Multi-Status</option>
							<option value='208'>208 Already Reported</option>
							<option value='226'>226 IM Used</option>
							<option value='300'>300 Multiple Choices</option>
							<option value='301'>301 Moved Permanently</option>
							<option value='302'>302 Found</option>
							<option value='303'>303 See Other</option>
							<option value='304'>304 Not Modified</option>
							<option value='305'>305 Use Proxy</option>
							<option value='306'>306 Switch Proxy</option>
							<option value='307'>307 Temporary Redirect</option>
							<option value='308'>308 Permanent Redirect</option>
							<option value='400'>400 Bad Request</option>
							<option value='401'>401 Unauthorized</option>
							<option value='402'>402 Payment Required</option>
							<option value='403'>403 Forbidden</option>
							<option value='404'>404 Not Found</option>
							<option value='405'>405 Method Not Allowed</option>
							<option value='406'>406 Not Acceptable</option>
							<option value='407'>407 Proxy Authentication Required</option>
							<option value='408'>408 Request Timeout</option>
							<option value='409'>409 Conflict</option>
							<option value='410'>410 Gone</option>
							<option value='411'>411 Length Required</option>
							<option value='412'>412 Precondition Failed</option>
							<option value='413'>413 Payload Too Large</option>
							<option value='414'>414 URI Too Long</option>
							<option value='415'>415 Unsupported Media Type</option>
							<option value='416'>416 Range Not Satisfiable</option>
							<option value='417'>417 Expectation Failed</option>
							<option value='418'>418 I'm a teapot</option>
							<option value='421'>421 Misdirected Request</option>
							<option value='422'>422 Unprocessable Entity</option>
							<option value='423'>423 Locked</option>
							<option value='424'>424 Failed Dependency</option>
							<option value='425'>425 Too Early</option>
							<option value='426'>426 Upgrade Required</option>
							<option value='428'>428 Precondition Required</option>
							<option value='429'>429 Too Many Requests</option>
							<option value='431'>431 Request Header Fields Too Large</option>
							<option value='451'>451 Unavailable For Legal Reasons</option>
							<option value='500'>500 Internal Server Error</option>
							<option value='501'>501 Not Implemented</option>
							<option value='502'>502 Bad Gateway</option>
							<option value='503'>503 Service Unavailable</option>
							<option value='504'>504 Gateway Timeout</option>
							<option value='505'>505 HTTP Version Not Supported</option>
							<option value='506'>506 Variant Also Negotiates</option>
							<option value='507'>507 Insufficient Storage</option>
							<option value='508'>508 Loop Detected</option>
							<option value='510'>510 Not Extended</option>
							<option value='511'>511 Network Authentication Required</option>
						</select>
						`;
	
	var row = table.insertRow(++position);
	row.className = 'test-assertion-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "3";
	cell0.innerHTML = "<b>Response Type:</b>";
	
	var row = table.insertRow(++position);
	row.className = 'test-assertion-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "3";
	cell0.innerHTML = `
						<select onchange=''>
							<option value=''>Please select</option>
							<option value='json'>JSON</option>
							<option value='text'>TEXT</option>
							<option value='ignore'>Ignore</option>
						</select>
						`;
	
	var row = table.insertRow(++position);
	row.className = 'test-assertion-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "3";
	cell0.innerHTML = "<b>Expected Payload:</b>";
	
	var row = table.insertRow(++position);
	row.className = 'test-assertion-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "3";
	cell0.innerHTML = `<textarea rows='4' cols='80' style='border: 1px solid black;' />`;
}

function populateRdbmsAssertionEntry(select) {
	var table = select.parentNode.parentNode.parentNode;
	var rows = table.getElementsByClassName("test-assertion-row");
	if (rows.length > 1) {
		for (var i = rows.length - 1; i > 0; i--) {
			rows[i].remove();
		}
	}
	
	var position = table.children.length - 1;
	
	var row = table.insertRow(++position);
	row.className = 'test-assertion-row rdbms-statement-field-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>SELECT Statement:<b>";

	var row = table.insertRow(++position);
	row.className = 'test-assertion-row rdbms-statement-field-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Columns:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "4";
	cell1.innerHTML = "<input class='rdbmsTableColumnsTextBox' type='text' placeholder='Enter comma delimited column names' size='60' />";

	var row = table.insertRow(++position);
	row.className = 'test-assertion-row rdbms-statement-field-row';
	row.id = 'condition-entry-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Conditions:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "1";
	cell1.innerHTML = "<input type='button' value=' + ' onclick='addRdbmsSelectCondition(this);' /> <b>Add Condition<b>";
	
	var row = table.insertRow(++position);
	row.className = 'test-assertion-row rdbms-statement-field-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Table:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "1";
	cell1.innerHTML = "<input type='text' placeholder='Enter table name' size='60' />";
	
	var row = table.insertRow(++position);
	row.className = 'test-assertion-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Expected Row Count:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "1";
	cell1.innerHTML = "<input type='text' placeholder='Enter expected row count' />";
}

function populateKafkaInjectionEntry(select) {
	var table = select.parentNode.parentNode.parentNode;
	var rows = table.getElementsByClassName("test-injection-row");
	if (rows.length > 1) {
		for (var i = rows.length - 1; i > 0; i--) {
			rows[i].remove();
		}
	}
	alert('TODO: populateKafkaInjectionEntry() to be implemented');
}
function populateFtpInjectionEntry(select) {
	var table = select.parentNode.parentNode.parentNode;
	var rows = table.getElementsByClassName("test-injection-row");
	if (rows.length > 1) {
		for (var i = rows.length - 1; i > 0; i--) {
			rows[i].remove();
		}
	}
	alert('TODO: populateFtpInjectionEntry() to be implemented');
}
function populateRdbmsInjectionEntry(select) {
	var table = select.parentNode.parentNode.parentNode;
	var rows = table.getElementsByClassName("test-injection-row");
	if (rows.length > 1) {
		for (var i = rows.length - 1; i > 0; i--) {
			rows[i].remove();
		}
	}
	
	var row = table.insertRow(2);
	row.className = 'test-injection-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>SQL Statement:<b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "4";
	cell1.innerHTML = `
	<select onchange='adjustRdbmsStatementFields(this)'>
		<option value='select'>SELECT</option>
		<option value='insert'>INSERT</option>
		<option value='update'>UPDATE</option>
		<option value='delete'>DELETE</option>
		<option value='advanced'>ADVANCED</option>		
	</select>
	`;

	var row = table.insertRow(3);
	row.className = 'test-injection-row rdbms-statement-field-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Columns:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "4";
	cell1.innerHTML = "<input class='rdbmsTableColumnsTextBox' type='text' placeholder='Enter comma delimited column names' size='60' />";

	var row = table.insertRow(4);
	row.className = 'test-injection-row rdbms-statement-field-row';
	row.id = 'condition-entry-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Conditions:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "1";
	cell1.innerHTML = "<input type='button' value=' + ' onclick='addRdbmsSelectCondition(this);' /> <b>Add Condition<b>";
	
	var row = table.insertRow(5);
	row.className = 'test-injection-row rdbms-statement-field-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Table:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "1";
	cell1.innerHTML = "<input type='text' placeholder='Enter table name' size='60' />";
}

function addRdbmsSelectCondition(button) {
	var table = button.parentNode.parentNode.parentNode;
	var rows = table.getElementsByTagName("tr");
	var rdbmsTableColumnsTextBox = table.getElementsByClassName("rdbmsTableColumnsTextBox")[0];
	var rdbmsTableColumns = rdbmsTableColumnsTextBox.value;
	if (rdbmsTableColumns.length != 0) {
		rdbmsTableColumnsTextBox.disabled = true;
		rdbmsTableColumnsTextBox.title = "Disabled if conditions are added. Delete conditions to re-enable.";
		for (var i = 0; i < rows.length; i++) {
			if (rows[i].id == "condition-entry-row") {
				if (table.getElementsByClassName("condition-row").length > 0) {
					var row = table.insertRow(i+1);
					row.className = "condition-row";
					var cell0 = row.insertCell(0);
					cell0.innerHTML = "";
					var cell1 = row.insertCell(1);
					cell1.innerHTML = `
					<select class='sqlConditionAndOrSelect' onchange=''>
						<option value='and'>AND</option>
						<option value='or'>OR</option>
					</select>
					`;			
				}
				
				var row = table.insertRow(i+1);
				row.className = "condition-row";
				var cell0 = row.insertCell(0);
				cell0.innerHTML = "";
				var cell1 = row.insertCell(1);	
				if (rdbmsTableColumns[0] != '*') {
					rdbmsTableColumns = rdbmsTableColumns.replace(/ /g, "");
					var columns = rdbmsTableColumns.split(",");
					var conditionInnerHtml = "<input type='text' name='conditionColumnName' list='columnList'/><datalist id='columnList'>";
					columns.forEach(col => {
						conditionInnerHtml += "<option value='" + col + "'>" + col + "</option>";
					});			
					conditionInnerHtml += "</datalist>";	
				} else {
					var conditionInnerHtml = "<input type='text' placeholder='Enter column name' size='16'/>";
				}		
				conditionInnerHtml +=  `
				<select class="sqlStatementSelect" onchange='adjustConditionTextBox(this)'>
					<option value='equal'>=</option>
					<option value='greater'>></option>
					<option value='greater-equal'>>=</option>
					<option value='less'><</option>
					<option value='less-equal'><=</option>
					<option value='not-equal'>!=</option>
					<option value='between'>IS BETWEEN</option>
					<option value='not-between'>IS NOT BETWEEN</option>
					<option value='like'>IS LIKE</option>
					<option value='in'>IS IN</option>
				</select>
				`;			
				conditionInnerHtml += "<span><input type='text' placeholder='' size='13' /></span>";
				conditionInnerHtml += "<input type='button' value=' - ' onclick='removeRdbmsCondition(this);' />";
				cell1.innerHTML = conditionInnerHtml;			
				break;
			}
		}
	} else {
		alert("Please fill out the RDBMS columns field.");
	}
}

function addRdbmsDataEntry(button) {
	var table = button.parentNode.parentNode.parentNode;
	var rows = table.getElementsByTagName("tr");	

	for (var i = 0; i < rows.length; i++) {
		if (rows[i].id == "data-fields-entry-row") {
			var row = table.insertRow(i+1);
			row.className = "data-fields-row";
			var cell0 = row.insertCell(0);
			cell0.innerHTML = "";			
				
			var cell1 = row.insertCell(1);	
			var conditionInnerHtml = "<input type='text' placeholder='Enter column name' size='15' />";
				
			conditionInnerHtml +=  " = ";
			conditionInnerHtml += "<input type='text' placeholder='Enter value' size='13' />";
			conditionInnerHtml += "<input type='button' value=' - ' onclick='removeRdbmsUpdate(this);' />";
			cell1.innerHTML = conditionInnerHtml;			
			break;
		}
	}	
}

function addRdbmsCondition(button) {
	var table = button.parentNode.parentNode.parentNode;
	var rows = table.getElementsByTagName("tr");

	for (var i = 0; i < rows.length; i++) {
		if (rows[i].id == "condition-entry-row") {
			if (table.getElementsByClassName("condition-row").length > 0) {
				var row = table.insertRow(i+1);
				row.className = "condition-row";
				var cell0 = row.insertCell(0);
				cell0.innerHTML = "";
				var cell1 = row.insertCell(1);
				cell1.innerHTML = `
				<select class='sqlConditionAndOrSelect' onchange=''>
					<option value='and'>AND</option>
					<option value='or'>OR</option>
				</select>
				`;			
			}
			
			var row = table.insertRow(i+1);
			row.className = "condition-row";
			var cell0 = row.insertCell(0);
			cell0.innerHTML = "";			
				
			var cell1 = row.insertCell(1);	
			var conditionInnerHtml = "<input type='text' placeholder='Enter column name' size='15' />";
			conditionInnerHtml +=  `
			<select class="sqlStatementSelect" onchange='adjustConditionTextBox(this)'>
				<option value='equal'>=</option>
				<option value='greater'>></option>
				<option value='greater-equal'>>=</option>
				<option value='less'><</option>
				<option value='less-equal'><=</option>
				<option value='not-equal'>!=</option>
				<option value='between'>IS BETWEEN</option>
				<option value='not-between'>IS NOT BETWEEN</option>
				<option value='like'>IS LIKE</option>
				<option value='in'>IS IN</option>
			</select>
			`;			
			conditionInnerHtml += "<span><input type='text' placeholder='Enter value' size='13' /></span>";
			conditionInnerHtml += "<input type='button' value=' - ' onclick='removeRdbmsCondition(this);' />";
			
			cell1.innerHTML = conditionInnerHtml;			
			break;
		}
	}
}

function resetTestInjection(select) {
	var table = select.parentNode.parentNode.parentNode;
	var rows = table.getElementsByClassName("test-injection-row");
	if (rows.length > 1) {
		for (var i = rows.length - 1; i > 0; i--) {
			rows[i].remove();
		}
	}
}

function resetTestAssertion(select) {
	var table = select.parentNode.parentNode.parentNode;
	var rows = table.getElementsByClassName("test-assertion-row");
	if (rows.length > 1) {
		for (var i = rows.length - 1; i > 0; i--) {
			rows[i].remove();
		}
	}
}

function removeTestInjectionEntry(button) {
	button.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
}

function addHttpHeader(button) {
	var table = button.parentNode.parentNode.parentNode;
	var rows = table.getElementsByTagName("tr");
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].id == "header-entry-row") {
			var row = table.insertRow(rows.length - 1);
			var cell0 = row.insertCell(0);
			cell0.innerHTML = "<input type='text' />";
			var cell1 = row.insertCell(1);
			cell1.innerHTML = "<input type='text' />";
			var cell2 = row.insertCell(2);
			cell2.innerHTML = "<input type='button' value=' - ' onclick='removeHttpHeader(this);' />";
			break;
		}
	}
}

function addHttpHeader(button, key, value) {
	var table = button.parentNode.parentNode.parentNode;
	var rows = table.getElementsByTagName("tr");
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].id == "header-entry-row") {
			var row = table.insertRow(rows.length - 1);
			var cell0 = row.insertCell(0);
			cell0.innerHTML = "<input type='text' value='" + key + "' />";
			var cell1 = row.insertCell(1);
			cell1.innerHTML = "<input type='text' value='" + value + "' />";
			var cell2 = row.insertCell(2);
			cell2.innerHTML = "<input type='button' value=' - ' onclick='removeHttpHeader(this);' />";
			break;
		}
	}
}

function updateFirstHeader(button, key, value) {
	var table = button.parentNode.parentNode.parentNode;
	var rows = table.getElementsByTagName("tr");
	var cells = rows[1].getElementsByTagName("td");
	cells[0].getElementsByTagName("input")[0].value = key;
	cells[1].getElementsByTagName("input")[0].value = value;
}

function addRdbmsColumn(button) {
	var table = button.parentNode.parentNode.parentNode;
	var rows = table.getElementsByTagName("tr");
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].id == "header-entry-row") {
			var row = table.insertRow(rows.length - 1);
			row.className = "rdbms-statement-field-row";
			var cell0 = row.insertCell(0);
			cell0.innerHTML = "<input type='text' />";
			var cell1 = row.insertCell(1);
			cell1.innerHTML = "<input type='button' value=' - ' onclick='removeHttpHeader(this);' />";
			break;
		}
	}
}

function removeHttpHeader(button) {
	button.parentNode.parentNode.remove();
}

function removeRdbmsCondition(button) {		
	var table = button.parentNode.parentNode.parentNode;
	var conditionRows = table.getElementsByClassName("condition-row");
	button.parentNode.parentNode.remove();

	if (conditionRows.length == 0) {
		var rdbmsTableColumnsTextBox = table.getElementsByClassName("rdbmsTableColumnsTextBox")[0];
		rdbmsTableColumnsTextBox.disabled = false;
	}
}

function removeRdbmsUpdate(button) {		
	button.parentNode.parentNode.remove();
}

function adjustConditionTextBox(select) {
	if (select.value == "between" || select.value == "not-between") {
		var conditionRowInput = select.parentNode.getElementsByTagName("span")[0];
		var conditionRowInputInnerHTML = "<input type='text' placeholder='' size='8' />";
		conditionRowInputInnerHTML += " AND ";
		conditionRowInputInnerHTML += "<input type='text' placeholder='' size='8' />";	
		conditionRowInput.innerHTML = conditionRowInputInnerHTML;
	} else {
		var conditionRowInput = select.parentNode.getElementsByTagName("span")[0];
		conditionRowInput.innerHTML = "<input type='text' placeholder='' size='13' />";	
	}	
}

function adjustRdbmsStatementFields(select) {
	var table = select.parentNode.parentNode.parentNode;
	var rdbmsStatementFieldRows = table.getElementsByClassName("rdbms-statement-field-row");
	rdbmsStatementFieldRows[0].innerHTML = "";
	rdbmsStatementFieldRows[1].innerHTML = "";
	rdbmsStatementFieldRows[2].innerHTML = "";
	deleteArray(table.getElementsByClassName("condition-row"));
	deleteArray(table.getElementsByClassName("data-fields-row"));

	switch (select.value) {
		case "select":
			addSelectFields(rdbmsStatementFieldRows);
			break;
		case "insert":
			addInsertFields(rdbmsStatementFieldRows);
			break;
		case "update":
			addUpdateFields(rdbmsStatementFieldRows);
			break;
		case "delete":
			addDeleteFields(rdbmsStatementFieldRows);
			break;	
		case "advanced":
			addAdvancedFields(rdbmsStatementFieldRows);
			break;
		default:
			break;
	}
}

function addSelectFields(rows) {
	var row = rows[0];
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Columns:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "4";
	cell1.innerHTML = "<input class='rdbmsTableColumnsTextBox' type='text' placeholder='Enter comma delimited column names' size='60' />";

	var row = rows[1];
	row.id = 'condition-entry-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Conditions:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "1";
	cell1.innerHTML = "<input type='button' value=' + ' onclick='addRdbmsSelectCondition(this);' /> <b>Add Condition<b>";
	
	var row = rows[2];
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Table:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "1";
	cell1.innerHTML = "<input type='text' placeholder='Enter table name' size='60' />";
}

function addUpdateFields(rows) {
	var row = rows[0];
	row.id = 'data-fields-entry-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Updates:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "1";
	cell1.innerHTML = "<input type='button' value=' + ' onclick='addRdbmsDataEntry(this);' /> <b>Add Field<b>";

	var row = rows[1];
	row.id = 'condition-entry-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Conditions:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "1";
	cell1.innerHTML = "<input type='button' value=' + ' onclick='addRdbmsCondition(this);' /> <b>Add Condition<b>";
	
	var row = rows[2];
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Table:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "1";
	cell1.innerHTML = "<input type='text' placeholder='Enter table name' size='60' />";
}

function addInsertFields(rows) {
	var row = rows[0];
	row.id = 'data-fields-entry-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Data:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "1";
	cell1.innerHTML = "<input type='button' value=' + ' onclick='addRdbmsDataEntry(this);' /> <b>Add Field<b>";

	var row = rows[1];
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Table:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "1";
	cell1.innerHTML = "<input type='text' placeholder='Enter table name' size='60' />";	
}

function addDeleteFields(rows) {
	var row = rows[0];
	row.id = 'condition-entry-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Conditions:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "1";
	cell1.innerHTML = "<input type='button' value=' + ' onclick='addRdbmsCondition(this);' /> <b>Add Condition<b>";

	var row = rows[1];
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Table:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "1";
	cell1.innerHTML = "<input type='text' placeholder='Enter table name' size='60' />";
}

function addAdvancedFields(rows) {
	var row = rows[0];
	row.id = 'statement-entry-row';
	var cell0 = row.insertCell(0);
	cell0.colSpan = "1";
	cell0.innerHTML = "<b>Command:</b>";
	var cell1 = row.insertCell(1);
	cell1.colSpan = "1";
	cell1.innerHTML = "<input type='text' placeholder='Enter sql command' size='60' />";
}

function deleteArray(array) {
	while (array.length != 0) {
		array[0].remove();
	}
}

function executeTest(testId, button) {
	var statusIcon = button.parentNode.parentNode.cells[0].getElementsByTagName('img')[0];
	statusIcon.src = "images/running.gif";
//	alert(statusIcon.src);
	var thisdate = new Date();
	var serverPage = "projects/name/" + workspaceName + "/execute-test/" + testId;

	var xmlhttp1 = getxmlhttp();
	xmlhttp1.open("POST", serverPage);
	xmlhttp1.onreadystatechange = function() {
		executeTestAjaxHandler(xmlhttp1, true, workspaceName, statusIcon);
	}
	xmlhttp1.setRequestHeader("_csrf", token);
	xmlhttp1.send(null);
}

function executeTestAjaxHandler(xmlhttp1, workspaceFlag, workspaceName, statusIcon) {
	try {
		if (xmlhttp1.readyState == 4 && xmlhttp1.status == 200) {
			var response = xmlhttp1.responseText;
			statusIcon.src = "images/pass.png";
//			alert(response);
		} else if (xmlhttp1.status != 200) {
			alert("HTTP Status: " + xmlhttp1.status);
		}
	}
	catch(error) {
		return;
	}
}
