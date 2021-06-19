var timeout;
var sessionTimeout;
var tabsCounter = 1;
var token = "";
var zIndex = 10;
var currentProjectId = 0;
var tabId = 0;

window.onload = function() {
	// TODO: add back to re-enable security
	//getToken();
	getSessionTimeout();
	openPrimaryWorkspace();
}

function openPrimaryWorkspace() {
	emptyTestSuite();
	openWorkspaceByName("primary-workspace");
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
		   <td><a href='#' onclick='openModal("modal-test-` + tabsCounter + `-1");'>New Integration Test</a></td>
		   <td><a href='https://system-monitor-dev.apps.pcf.devfg.abc.com/index.html?workspace=pda-flow' target='_blank'>pda-flow</a></td>
		   <td>01-01-2019 @ 00:00:00</td>
		   <td>01-01-2019 @ 00:00:00</td>
		   <td>0 ms</td>
		   <td>0 0 6 * * *</td>
		   <td><img alt="status" src="images/console.png" onclick="alert('Yet to be implemented');"></td>
		   <td><input type='button' value='Delete' onclick='deleteTest("test-` + tabsCounter + `-1");' /></td>
		   <td><input type="button" value="Execute" /></td>
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
		cell2.innerHTML = "<a href='#' onclick='openModal(\"modal-" + row.id + "\");'>New Integration Test</a>";
		cell3.innerHTML = "<a href='https://system-monitor-dev.apps.pcf.devfg.abc.com/index.html?workspace=pda-flow' target='_blank'>topology-link</a>";
		cell4.innerHTML = "01-01-2019 @ 00:00:00";
		cell5.innerHTML = "01-01-2019 @ 00:00:00";
		cell6.innerHTML = "0 ms";		
		cell7.innerHTML = "N/A";
		cell8.innerHTML = "<img alt=\"status\" src=\"images/console.png\" onclick=\"alert('Yet to be implemented');\">";
		cell9.innerHTML = "<input type='button' value='Delete' onclick='deleteTest(\"" + row.id + "\");' />";
		cell10.innerHTML = "<input type='button' value='Execute' />";
		
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
		cell3.innerHTML = "<a href='https://system-monitor-dev.apps.pcf.devfg.abc.com/index.html?workspace=pda-flow' target='_blank'>topology-link</a>";
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
		cell3.innerHTML = "<a href='https://system-monitor-dev.apps.pcf.devfg.abc.com/index.html?workspace=pda-flow' target='_blank'>topology-link</a>";
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
	save();
}

function openModal(entry) {
	var modal = document.getElementById('itModal');
	modal.style.display = "block";
	document.getElementById('update').setAttribute( "onClick", "javascript: updateTestEntry('" + entry + "');" );
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
	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		var testTable = row.children[0].children[1];
		var injectionRows = table.getElementsByClassName("test-injection-row");
		var assertionRows = table.getElementsByClassName("test-assertion-row");
		processInjectionRows(injectionRows, testSuite);
		processAssertionRows(assertionRows, testSuite);
	}
	
	document.getElementById(entry).value = JSON.stringify(testSuite);
	closeServiceModel();
}

function processInjectionRows(injectionRows, testSuite) {
	var injectionType = injectionRows[0].children[1].children[0].value;
	if (injectionType == 'http') {
		processInjectionHttp(injectionRows, testSuite);
	}
	if (injectionType == 'kafka') {
		processInjectionKafka(injectionRows, testSuite);
	}
	if (injectionType == 'ftp') {
		processInjectionFtp(injectionRows, testSuite);
	}
	if (injectionType == 'rdbms') {
		processInjectionRdbms(injectionRows, testSuite);
	}
}

function processInjectionHttp(injectionRows, testSuite) {
	var test = {};
	test["type"] = "injection";
	test["injection-type"] = injectionRows[0].getElementsByTagName('select')[0].value;
	test["endpoint"] = injectionRows[2].getElementsByTagName('input')[0].value;
	test["verb"] = injectionRows[4].getElementsByTagName('select')[0].value;

	// TODO: Add Injection Headers.

	alert(injectionRows[4].getElementsByTagName('select')[0].value);
	//testSuite.push(test);
}

function processAssertionRows(assertionRows, test) {
	
}

function closeServiceModel() {
	var modal = document.getElementById('itModal');
	modal.style.display = "none";
}

function addScheduledRows() {
	var table = document.getElementById('itTestTable');
	var rows = table.getElementsByTagName("tr");
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].id == "scheduled-row") {
			var row = table.insertRow(i + 1);
			row.className = "top-level";
			var cell0 = row.insertCell(0);
			cell0.innerHTML = "Cron Schedule - e.g: 0 0 6 * * *";
			cell0.colSpan = "2";
			
			var row = table.insertRow(i + 2);
			row.className = "top-level";
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
			row.className = "top-level";
			var cell0 = row.insertCell(0);
			cell0.innerHTML = "Git Repo Location";
			cell0.colSpan = "2";
			
			var row = table.insertRow(i + 2);
			row.className = "top-level";
			var cell0 = row.insertCell(0);
			cell0.colSpan = "2";
			cell0.innerHTML = "<input type='text' id='git-repo' value='' size='60' />";
			
			var row = table.insertRow(i + 3);
			row.className = "top-level";
			var cell0 = row.insertCell(0);
			cell0.innerHTML = "App Port Number";
			cell0.colSpan = "2";
			
			var row = table.insertRow(i + 4);
			row.className = "top-level";
			var cell0 = row.insertCell(0);
			cell0.colSpan = "2";
			cell0.innerHTML = "<input type='text' id='app-port-no' value='' />";
			
			var row = table.insertRow(i + 5);
			row.className = "top-level";
			row.id = "config-row";
			var cell0 = row.insertCell(0);
			cell0.colSpan = "2";
			cell0.innerHTML = "<b>Will there be app config overrides? - <input type='radio' name='overrides' value='yes' onchange='addConfigRows();'> Yes <input type='radio' name='overrides' value='no' checked='checked' onchange='removeConfigRows();'> No</b>";
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
			row.className = "top-level";
			var cell0 = row.insertCell(0);
			cell0.colSpan = "2";
			cell0.innerHTML =
				`<table id='config-table'>
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
						<td colspan='3'><input type='button' value=' + ' onclick='addConfigEntry(this);' /> <b>Add Config Entry</b></td>
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
	alert(table);
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
				<td colspan='3'><input type='button' value=' + ' onclick='addHttpHeader(this);' /> <b>Add Header</b></td>
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
	alert('TODO: populateRdbmsInjectionEntry() to be implemented');
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
	button.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
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

function removeHttpHeader(button) {
	button.parentNode.parentNode.remove();
}
