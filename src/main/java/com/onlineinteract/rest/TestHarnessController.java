package com.onlineinteract.rest;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
import com.onlineinteract.service.ProjectService;

@RestController()
public class TestHarnessController {

	private static Logger logger = LoggerFactory.getLogger(TestHarnessController.class);

	@Autowired
	private ProjectService projectService;

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

	@RequestMapping(method = RequestMethod.GET, produces = "application/json", value = "/abc")
	public String test(HttpServletRequest request, HttpServletResponse response) {
		System.out.println("**** Test Invoked ****");
		return "{\"name\":\"test\"}";
	}

	@RequestMapping(method = RequestMethod.POST, consumes = "application/json", produces = "application/json", value = "/def")
	@ResponseBody
	public String test2(@RequestBody String data, HttpServletRequest request, HttpServletResponse response) {
		System.out.println("**** Test Invoked ****\n" + data);
		return "{\"name\":\"test\"}";
	}
}
