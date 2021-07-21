package com.onlineinteract.rest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
// import org.springframework.security.web.csrf.CsrfToken; TODO: uncomment to re-enable security

import com.fasterxml.jackson.databind.ObjectMapper;
import com.onlineinteract.DiscoveryTestApplication;
import com.onlineinteract.exception.BadRequestException;
import com.onlineinteract.model.Project;
import com.onlineinteract.model.Tabs;
import com.onlineinteract.service.ProjectService;
import com.onlineinteract.template.UriTemplates;

/**
 * Main Rest Controller for the Discovery platform POC.
 * 
 * @author Gary Black
 *
 */
@RestController()
public class TestHarnessController {

	private static Logger logger = LoggerFactory.getLogger(TestHarnessController.class);

	@Autowired
	private ProjectService projectService;
	private Runtime runtime = Runtime.getRuntime();
	private String appPid = "";
	private boolean applicationRunningFlag = false;
	private Process exec;
	private OutputStream outputStream;
	private String summary = "";

	// TODO: uncomment to re-enable security
	// @RequestMapping(method = RequestMethod.GET, produces = "application/json",
	// value = "/token")
	// @ResponseBody
	// public String token(HttpServletRequest request, HttpServletResponse response)
	// {
	// System.out.println("**** session timeout = " +
	// request.getSession().getMaxInactiveInterval());
	// // request.getSession().setMaxInactiveInterval(20);
	//
	// CsrfToken token = (CsrfToken) request.getAttribute("_csrf");
	// response.setHeader("X-CSRF-HEADER", token.getHeaderName());
	// response.setHeader("X-CSRF-PARAM", token.getParameterName());
	// response.setHeader("X-CSRF-TOKEN", token.getToken());
	// return token.getToken();
	// }

	/**
	 * Returns the maximum session timeout
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(method = RequestMethod.GET, produces = "application/json", value = "/session-timeout")
	@ResponseBody
	public String sessionTimeout(HttpServletRequest request, HttpServletResponse response) {
		System.out.println("**** session timeout = " + request.getSession().getMaxInactiveInterval());
		return String.valueOf(request.getSession().getMaxInactiveInterval());
	}

	/**
	 * Creates a new project.
	 * 
	 * @param projectIn projectIn
	 * @param request   HttpServletRequest
	 * @param response  HttpServletResponse
	 */
	@RequestMapping(value = UriTemplates.PROJECTS, method = RequestMethod.POST)
	public Long createProject(@RequestBody String projectIn, HttpServletRequest request, HttpServletResponse response) {
		ObjectMapper objectMapper = new ObjectMapper();
		Project project = null;
		try {
			System.out.println(projectIn);
			project = objectMapper.readValue(projectIn, Project.class);
		} catch (Exception e) {
			e.printStackTrace();
		}

		Long projectId = projectService.createProject(project);
		logger.info("create project, id = " + projectId);

		response.addHeader(HttpHeaders.LOCATION, UriTemplates.PROJECT_ID.replace("{projectId}", projectId.toString()));
		response.setStatus(HttpStatus.CREATED.value());
		logger.info("project " + projectId + " created");
		return projectId;
	}

	/**
	 * Saves existing project.
	 * 
	 * @param projectIn projectIn
	 * @param request   HttpServletRequest
	 * @param response  HttpServletResponse
	 */
	@RequestMapping(value = UriTemplates.PROJECT_ID, method = RequestMethod.POST)
	public Long saveProject(@RequestBody String projectIn, HttpServletRequest request, HttpServletResponse response) {
		ObjectMapper objectMapper = new ObjectMapper();
		Project project = null;
		try {
			System.out.println(projectIn);
			project = objectMapper.readValue(projectIn, Project.class);
		} catch (Exception e) {
			e.printStackTrace();
		}

		Long projectId = projectService.saveProject(project);
		logger.info("save project, id = " + projectId);

		response.addHeader(HttpHeaders.LOCATION, UriTemplates.PROJECT_ID.replace("{projectId}", projectId.toString()));
		response.setStatus(HttpStatus.OK.value());
		logger.info("project " + projectId + " saved");
		return projectId;
	}

	/**
	 * Get project by id.
	 * 
	 * @param projectId projectId
	 * @param request   HttpServletRequest
	 * @param response  HttpServletResponse
	 * @return project
	 */
	@RequestMapping(value = UriTemplates.PROJECT_ID, method = RequestMethod.GET)
	@ResponseBody
	public Project getProjectById(@PathVariable("projectId") String projectId, HttpServletRequest request,
			HttpServletResponse response) {
		if (logger.isDebugEnabled()) {
			logger.debug("received get request for Project [{}]", projectId);
		}

		Project project;
		try {
			project = projectService.retrieveProject(Long.parseLong(projectId));
		} catch (NumberFormatException e) {
			throw new BadRequestException("Invalid Project identifier [{}]", projectId);
		}
		response.setStatus(HttpStatus.OK.value());

		return project;
	}

	/**
	 * Get project by name.
	 * 
	 * @param projectName projectName
	 * @param request     HttpServletRequest
	 * @param response    HttpServletResponse
	 * @return project
	 */
	@RequestMapping(value = UriTemplates.PROJECT_NAME, method = RequestMethod.GET)
	@ResponseBody
	public Project getProjectByName(@PathVariable("projectName") String projectName, HttpServletRequest request,
			HttpServletResponse response) {
		if (logger.isDebugEnabled()) {
			logger.debug("received get request for Project [{}]", projectName);
		}

		Project project;
		try {
			project = projectService.retrieveProject(projectName);
		} catch (NumberFormatException e) {
			throw new BadRequestException("Invalid Project name [{}]", projectName);
		}
		if (project != null)
			response.setStatus(HttpStatus.OK.value());
		else
			response.setStatus(HttpStatus.NOT_FOUND.value());

		return project;
	}

	/**
	 * Delete project.
	 * 
	 * @param projectId projectId
	 * @param request   HttpServletRequest
	 * @param response  HttpServletResponse
	 */
	@RequestMapping(value = UriTemplates.PROJECT_ID, method = RequestMethod.DELETE)
	@ResponseBody
	public void deleteProject(@PathVariable("projectId") String projectId, HttpServletRequest request,
			HttpServletResponse response) {
		if (logger.isDebugEnabled()) {
			logger.debug("received delete request for project [{}]", projectId);
		}

		try {
			projectService.deleteProject(Long.parseLong(projectId));
		} catch (NumberFormatException e) {
			throw new BadRequestException("Invalid Project identifier [{}]", projectId);
		}
		response.setStatus(HttpStatus.NO_CONTENT.value());
		return;
	}

	/**
	 * Get all projects.
	 * 
	 * @param request  HttpServletRequest
	 * @param response HttpServletResponse
	 * @return all projects
	 */
	@RequestMapping(value = UriTemplates.PROJECTS, method = RequestMethod.GET)
	@ResponseBody
	public List<Project> getAllProjects(HttpServletRequest request, HttpServletResponse response) {
		if (logger.isDebugEnabled()) {
			logger.debug("received get request for Projects");
		}

		List<Project> projects = projectService.retrieveProjects();
		response.setStatus(HttpStatus.OK.value());

		return projects;
	}

	/**
	 * Main method for executing (all) Integration Tests (including ETE).
	 * 
	 * @param projectName projectName
	 * @param request     HttpServletRequest
	 * @param response    HttpServletResponse
	 * @return project
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = UriTemplates.TEST_EXECUTION, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<String> executeIntegrationTests(@PathVariable("projectName") String projectName,
			@PathVariable("testId") String testId, HttpServletRequest request, HttpServletResponse response) {
		logger.info("received post request for test execution on Project [{}] with test id [{}]", projectName, testId);
		summary = "received post request for test execution on Project " + projectName + " with test id " + testId
				+ "\n";

		try {
			Thread.sleep(2000);
			Project project = projectService.retrieveProject(projectName);
			List<Tabs> workspaceState = project.getWorkspaceState();

			for (int i = 0; i < workspaceState.size(); i++) {
				Object viewObject = workspaceState.get(i);
				LinkedHashMap<String, String> view = (LinkedHashMap<String, String>) viewObject;
				String tab = view.get("tab");
				String tabHTML = new String(Base64.getDecoder().decode(tab));
				Document doc = Jsoup.parse(tabHTML);
				Element test = doc.getElementById("modal-" + testId);
				if (test != null) {
					if (parseAndExecuteTests(test)) {
						summary += "All Tests PASS\n";
						return new ResponseEntity<>(summary, HttpStatus.OK);
					} else {
						summary += "One or more Tests FAIL\n";
						return new ResponseEntity<>(summary, HttpStatus.INTERNAL_SERVER_ERROR);
					}
				}
			}

		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return new ResponseEntity<>("executeTest(): ", HttpStatus.OK);
	}

	/**
	 * Each test passed in is parsed out and executed returning success or fail.
	 * 
	 * @param test
	 * @return boolean
	 */
	@SuppressWarnings("unchecked")
	public boolean parseAndExecuteTests(Element test) {
		logger.info("\n*** parseAndExecuteTests() ***\n");
		summary += "\n*** parseAndExecuteTests() ***\n";
		String jsonTest = test.attr("value");
		logger.info(jsonTest);
		try {
			LinkedHashMap<String, Object> result = new ObjectMapper().readValue(jsonTest, LinkedHashMap.class);
			@SuppressWarnings("unused")
			String id = (String) result.get("id");
			String suiteName = (String) result.get("name");
			String topology = (String) result.get("topology");
			@SuppressWarnings("unused")
			String cronSchedule = (String) result.get("cron-schedule");
			String gitRepo = (String) result.get("git-repo");
			String appPortNo = (String) result.get("app-port-no");
			ArrayList<LinkedHashMap<String, String>> configOverrides = (ArrayList<LinkedHashMap<String, String>>) result
					.get("config-overrides");
			ArrayList<LinkedHashMap<String, Object>> tests = (ArrayList<LinkedHashMap<String, Object>>) result
					.get("tests");

			logger.info("Test name is: " + suiteName + " with a topology of: " + topology + " on git: " + gitRepo);
			summary += "Test name is: " + suiteName + " with a topology of: " + topology + " on git: " + gitRepo + "\n";

			if (gitRepo != null)
				spinUpApplicationService(gitRepo, appPortNo, configOverrides);

			boolean testsResult = executeTests(tests, suiteName);

			if (gitRepo != null)
				shutdownApplication();

			return testsResult;

		} catch (IOException e) {
			e.printStackTrace();
		}

		return false;
	}

	/**
	 * Individual Integration Test (or out-of-component test) applications are
	 * shutdown with this method.
	 * 
	 * @throws IOException
	 */
	private void shutdownApplication() throws IOException {
		logger.info("Shutting down application");
		summary += "Shutting down application\n";
		outputStream.write(("kill " + appPid + "\n").getBytes());
		outputStream.flush();
		exec.destroy();
	}

	/**
	 * Individual Integration Test (or out-of-component test) applications are
	 * checked out, compiled and spun up with this method.
	 * 
	 * @param gitRepo
	 * @param appPortNo
	 * @param configOverrides
	 */
	private void spinUpApplicationService(String gitRepo, String appPortNo,
			ArrayList<LinkedHashMap<String, String>> configOverrides) {
		applicationRunningFlag = false;
		logger.info("Spinning up application from: " + gitRepo + " on port no: " + appPortNo);
		summary += "Spinning up application from: " + gitRepo + " on port no: " + appPortNo + "\n";
		String appConfigOverrides = "";

		for (LinkedHashMap<String, String> config : configOverrides) {
			appConfigOverrides += " --" + config.get("key") + "=" + config.get("value");
		}

		try {
			exec = runtime.exec("sh");
			outputStream = exec.getOutputStream();

			new Thread(() -> {
				try {
					InputStream inputStream = exec.getInputStream();
					BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
					String line = "";
					while ((line = bufferedReader.readLine()) != null) {
						logger.info(line);
						summary += line + "\n";
						if (line.contains("pid"))
							appPid = line;
						if (line.contains("JVM running")) {
							logger.info("\n*** Application running state detected ***\n");
							summary += "\n*** Application running state detected ***\n";
							applicationRunningFlag = true;
						}
					}
				} catch (IOException e) {
					e.printStackTrace();
				}
			}).start();

			outputStream.write("pwd\n".getBytes());
			outputStream.flush();
			outputStream.write(("git clone " + gitRepo + "\n").getBytes());
			outputStream.flush();
			logger.info("\n*** Checking out repository ***\n");
			summary += "\n*** Checking out repository ***\n";
			String[] repositorySplit = gitRepo.split("/");
			String directory = repositorySplit[repositorySplit.length - 1].replace(".git", "");
			outputStream.write(("cd " + directory + "\n").getBytes());
			outputStream.flush();
			outputStream.write(("git pull\n").getBytes());
			outputStream.flush();
			logger.info("\n*** Fetch latest from repository ***\n");
			summary += "\n*** Fetch latest from repository ***\n";
			outputStream.write("mvn clean package\n".getBytes());
			outputStream.flush();
			logger.info("\n*** Compile Application ***\n");
			summary += "\n*** Compile Application ***\n";
			outputStream.write(("cd target\n").getBytes());
			outputStream.flush();
			outputStream.write(("java -jar *.jar --server.port=" + appPortNo + appConfigOverrides
					+ " --spring.profiles.active=test & echo pid $!\n").getBytes());
			logger.info("\n*** Application Launch Initiated ***\n");
			summary += "\n*** Application Launch Initiated ***\n";
			outputStream.flush();

			int timeoutCounter = 10;
			while (!applicationRunningFlag) {
				try {
					if (timeoutCounter == 0)
						break;
					Thread.sleep(1000);
					timeoutCounter--;
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
			applicationRunningFlag = false;
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Actual test execution entry starts here.
	 * 
	 * @param tests
	 * @param suiteName
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private boolean executeTests(ArrayList<LinkedHashMap<String, Object>> tests, String suiteName) {
		for (LinkedHashMap<String, Object> test : tests) {
			ArrayList<LinkedHashMap<String, Object>> testPair = (ArrayList<LinkedHashMap<String, Object>>) test
					.get("test-pair");
			LinkedHashMap<String, Object> testInjection = testPair.get(0);
			LinkedHashMap<String, Object> testAssertion = testPair.get(1);

			if (!processTest(testInjection, testAssertion, suiteName))
				return false;
			else
				continue;
		}

		return true;
	}

	private boolean processTest(LinkedHashMap<String, Object> testInjection,
			LinkedHashMap<String, Object> testAssertion, String suiteName) {
		String injectionType = (String) testInjection.get("injection-type");
		if (injectionType.equals("http"))
			return processHttpTest(testInjection, testAssertion, suiteName);
		if (injectionType.equals("kafka"))
			logger.info("TODO: KAFA");
		if (injectionType.equals("ftp"))
			logger.info("TODO: FTP");
		if (injectionType.equals("rdbms"))
			logger.info("TODO: RDBMS");
		if (injectionType.equals("assertion"))
			return processAssertionOnlyTest(testInjection, testAssertion, suiteName);

		return false;
	}

	private boolean processAssertionOnlyTest(LinkedHashMap<String, Object> testInjection,
			LinkedHashMap<String, Object> testAssertion, String suiteName) {

		String assertionType = (String) testAssertion.get("assertion-type");
		if (assertionType.equals("rdbms"))
			return processRdbmsAssertionTest(testAssertion, suiteName);

		return false;
	}

	@SuppressWarnings("unchecked")
	private boolean processRdbmsAssertionTest(LinkedHashMap<String, Object> testAssertion, String suiteName) {
		logger.info("\n*** processRdbmsAssertionTest() commenced ***\n");
		summary += "\n*** processRdbmsAssertionTest() commenced ***\n\n";

		String columns = (String) testAssertion.get("columns");
		String table = (String) testAssertion.get("table");
		String expectedOperator = (String) testAssertion.get("expectedOperator");
		String expectedRowCount = (String) testAssertion.get("expectedRowCount");
		ArrayList<LinkedHashMap<String, String>> conditions = (ArrayList<LinkedHashMap<String, String>>) testAssertion
				.get("conditions");

		String query = "SELECT " + columns + " FROM " + table + " WHERE ";

		for (LinkedHashMap<String, String> condition : conditions) {
			String varA = condition.get("varA");
			String operator = condition.get("operator");
			String varB = condition.get("varB");
			query += varA + " " + operator + " '" + varB + "' AND ";
			logger.info(varA + " - " + operator + " - " + varB);
		}

		if (query.substring(query.length() - 4, query.length()).contains("AND "))
			query = query.substring(0, query.length() - 5) + ";";

		logger.info("Final Query: " + query);
		summary += "Final Query: " + query + "\n\n";

		Statement statement;
		try {
			statement = DiscoveryTestApplication.databaseConnection.createStatement();
			statement.setQueryTimeout(60);
			statement.setFetchSize(1000);
			ResultSet rs = statement.executeQuery(query);
			rs.last();
			int size = rs.getRow();
			logger.info("Expected operator " + expectedOperator);
			summary += "Expected operator " + expectedOperator + "\n";
			logger.info("Expected row count " + expectedRowCount);
			summary += "Expected row count " + expectedRowCount + "\n";
			logger.info("\n*** processRdbmsAssertionTest() complete ***\n");
			summary += "\n*** processRdbmsAssertionTest() complete ***\n";

			if (expectedOperator.equals("=")) {
				if (size == Integer.valueOf(expectedRowCount)) {
					logger.info("\n*** Test PASS ***\n");
					summary = "*** Test PASS ***\n\n" + summary;
					summary += "\n*** Test PASS ***\n\n";
					rs.close();
					statement.close();
					return true;
				}
			}
			if (expectedOperator.equals(">")) {
				if (size > Integer.valueOf(expectedRowCount)) {
					logger.info("\n*** Test PASS ***\n");
					summary = "*** Test PASS ***\n\n" + summary;
					summary += "\n*** Test PASS ***\n\n";
					rs.close();
					statement.close();
					return true;
				}
			}
			if (expectedOperator.equals(">=")) {
				if (size >= Integer.valueOf(expectedRowCount)) {
					logger.info("\n*** Test PASS ***\n");
					summary = "*** Test PASS ***\n\n" + summary;
					summary += "\n*** Test PASS ***\n\n";
					rs.close();
					statement.close();
					return true;
				}
			}
			if (expectedOperator.equals("<")) {
				if (size < Integer.valueOf(expectedRowCount)) {
					logger.info("\n*** Test PASS ***\n");
					summary = "*** Test PASS ***\n\n" + summary;
					summary += "\n*** Test PASS ***\n\n";
					rs.close();
					statement.close();
					return true;
				}
			}
			if (expectedOperator.equals("<=")) {
				if (size <= Integer.valueOf(expectedRowCount)) {
					logger.info("\n*** Test PASS ***\n");
					summary = "*** Test PASS ***\n\n" + summary;
					summary += "\n*** Test PASS ***\n\n";
					rs.close();
					statement.close();
					return true;
				}
			}
			if (expectedOperator.equals("!=")) {
				if (size != Integer.valueOf(expectedRowCount)) {
					logger.info("\n*** Test PASS ***\n");
					summary = "*** Test PASS ***\n\n" + summary;
					summary += "\n*** Test PASS ***\n\n";
					rs.close();
					statement.close();
					return true;
				}
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}

		logger.info("\n*** Test FAIL ***\n");
		summary = "*** Test FAIL ***\n\n" + summary;
		summary += "\n*** Test FAIL ***\n";
		return false;
	}

	@SuppressWarnings("unchecked")
	private boolean processHttpTest(LinkedHashMap<String, Object> testInjection,
			LinkedHashMap<String, Object> testAssertion, String suiteName) {
		logger.info("\n*** processHttpTest() commenced ***\n");
		summary += "\n*** processHttpTest() commenced ***\n";
		String endpoint = (String) testInjection.get("endpoint");
		String verb = (String) testInjection.get("verb");
		String body = (String) testInjection.get("body");
		ArrayList<LinkedHashMap<String, String>> headers = (ArrayList<LinkedHashMap<String, String>>) testInjection
				.get("headers");

		String assertionType = (String) testAssertion.get("assertion-type");
		String httpStatus = (String) testAssertion.get("http-status");
		String responseType = (String) testAssertion.get("response-type");
		String expectedPayload = (String) testAssertion.get("expected-payload");

		if (verb.equals("post")) {
			HttpHeaders httpHeaders = new HttpHeaders();
			for (LinkedHashMap<String, String> header : headers) {
				httpHeaders.add(header.get("key"), header.get("value"));
			}

			if (assertionType.equals("http")) {
				RestTemplate restTemplate = new RestTemplate();
				httpHeaders.setContentType(MediaType.APPLICATION_JSON);
				HttpEntity<String> request = new HttpEntity<String>(body, httpHeaders);
				ResponseEntity<String> response = restTemplate.postForEntity(endpoint, request, String.class);
				logger.info("\n*** processHttpTest() complete ***\n");
				summary += "\n*** processHttpTest() complete ***\n";
				logger.info("Response from " + endpoint + ": " + response.getBody());
				summary += "Response from " + endpoint + ": " + response.getBody() + "\n";

				if (responseType.equals("text")) {
					if (response.getStatusCodeValue() == Integer.valueOf(httpStatus)
							&& response.getBody().equals(expectedPayload)) {
						logger.info("\n*** Test PASS ***\n");
						summary = "*** Test PASS ***\n\n" + summary;
						summary += "\n*** Test PASS ***\n";
						return true;
					}
				}
			}
		}

		logger.info("\n*** Test FAIL ***\n");
		summary = "*** Test FAIL ***\n\n" + summary;
		summary += "\n*** Test FAIL ***\n";
		return false;
	}

	public static void main(String[] args) {
		String abc = "https://github.com/gar2000b/loan-application-service.git";
		String[] split = abc.split("/");
		String directory = split[split.length - 1].replace(".git", "");
		System.out.println(directory);
	}
}
