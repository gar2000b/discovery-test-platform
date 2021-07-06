package com.onlineinteract.rest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.onlineinteract.UriTemplates;
import com.onlineinteract.exception.BadRequestException;
import com.onlineinteract.model.Project;
import com.onlineinteract.model.Tabs;
import com.onlineinteract.service.ProjectService;

@RestController()
public class TestHarnessController {

	private static Logger logger = LoggerFactory.getLogger(TestHarnessController.class);

	@Autowired
	private ProjectService projectService;

	private Runtime runtime = Runtime.getRuntime();

	private String appPid = "";

	// TODO: undo comment when security needs re-enabled.
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
	 * Get project by name.
	 * 
	 * @param projectName projectName
	 * @param request     HttpServletRequest
	 * @param response    HttpServletResponse
	 * @return project
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = UriTemplates.TEST_EXECUTION, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<String> executeIntegrationTest(@PathVariable("projectName") String projectName,
			@PathVariable("testId") String testId, HttpServletRequest request, HttpServletResponse response) {
		logger.info("received post request for test execution on Project [{}] with test id [{}]", projectName, testId);
		try {
			Thread.sleep(2000);
			Project project = projectService.retrieveProject(projectName);
			List<Tabs> workspaceState = project.getWorkspaceState();

			for (int i = 0; i < workspaceState.size(); i++) {
				Object viewObject = workspaceState.get(i);
				LinkedHashMap<String, String> view = (LinkedHashMap<String, String>) viewObject;
//				System.out.println(view.get("name"));
//				System.out.println(view.get("tab"));
				String tab = view.get("tab");
				String tabHTML = new String(Base64.getDecoder().decode(tab));
//				System.out.println(tabHTML + "\n\n");
				Document doc = Jsoup.parse(tabHTML);
				Element test = doc.getElementById("modal-" + testId);
				if (test != null)
					parseTest(test);
				else
					break;
			}

		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return new ResponseEntity<>("executeTest(): ", HttpStatus.OK);
	}

	@SuppressWarnings("unchecked")
	public void parseTest(Element test) {
		System.out.println("Parsing test");
		String jsonTest = test.attr("value");
		System.out.println(jsonTest);
		try {
			LinkedHashMap<String, Object> result = new ObjectMapper().readValue(jsonTest, LinkedHashMap.class);
			String id = (String) result.get("id");
			String name = (String) result.get("name");
			String topology = (String) result.get("topology");
			String cronSchedule = (String) result.get("cron-schedule");
			String gitRepo = (String) result.get("git-repo");
			String appPortNo = (String) result.get("app-port-no");
			ArrayList<LinkedHashMap<String, String>> configOverrides = (ArrayList<LinkedHashMap<String, String>>) result
					.get("config-overrides");
			ArrayList<String> tests = (ArrayList<String>) result.get("tests");
			System.out.println("Test name is: " + name + " with a topology of: " + topology + " on git: " + gitRepo);
			if (gitRepo != null)
				spinUpApplicationService(gitRepo, appPortNo, configOverrides);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private void spinUpApplicationService(String gitRepo, String appPortNo,
			ArrayList<LinkedHashMap<String, String>> configOverrides) {
		logger.info("Spinning up application from: " + gitRepo + " on port no: " + appPortNo);
		Process exec;

		String appConfigOverrides = "";

		for (LinkedHashMap<String, String> config : configOverrides) {
			appConfigOverrides += " --" + config.get("key") + "=" + config.get("value");
		}

		try {
			exec = runtime.exec("sh");
			OutputStream outputStream = exec.getOutputStream();

			new Thread(() -> {
				try {
					InputStream inputStream = exec.getInputStream();
					BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
					String line = "";
					while ((line = bufferedReader.readLine()) != null) {
						logger.info(line);
						if (line.contains("pid"))
							appPid = line;
						if (line.contains("JVM running")) {
							logger.info("Application running state detected");
//							logger.info("Shutting down application");
//							outputStream.write(("kill " + appPid + "\n").getBytes());
//							outputStream.flush();
//							exec.destroy();
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
			String[] repositorySplit = gitRepo.split("/");
			String directory = repositorySplit[repositorySplit.length - 1].replace(".git", "");
			outputStream.write(("cd " + directory + "\n").getBytes());
			outputStream.flush();
			outputStream.write(("git pull\n").getBytes());
			outputStream.flush();
			outputStream.write("mvn clean package\n".getBytes());
			outputStream.flush();
			outputStream.write(("cd target\n").getBytes());
			outputStream.flush();
			outputStream.write(("java -jar *.jar --server.port=" + appPortNo + appConfigOverrides
					+ " --spring.profiles.active=test & echo pid $!\n").getBytes());
			outputStream.flush();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private void executeTests() {
		
	}

	public static void main(String[] args) {
		String abc = "https://github.com/gar2000b/loan-application-service.git";
		String[] split = abc.split("/");
		String directory = split[split.length - 1].replace(".git", "");
		System.out.println(directory);
	}

//	@RequestMapping(method = RequestMethod.GET, produces = "application/json", value = "/abc")
//	public String test(HttpServletRequest request, HttpServletResponse response) {
//		System.out.println("**** Test Invoked ****");
//		return "{\"name\":\"test\"}";
//	}
//
//	@RequestMapping(method = RequestMethod.POST, consumes = "application/json", produces = "application/json", value = "/def")
//	@ResponseBody
//	public String test2(@RequestBody String data, HttpServletRequest request, HttpServletResponse response) {
//		System.out.println("**** Test Invoked ****\n" + data);
//		return "{\"name\":\"test\"}";
//	}
}
