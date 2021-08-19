package com.onlineinteract.dao.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.onlineinteract.dao.ProjectDao;
import com.onlineinteract.dao.RedisBaseDao;
import com.onlineinteract.exception.AppRuntimeException;
import com.onlineinteract.model.Project;
import com.onlineinteract.model.Tabs;
import com.onlineinteract.service.ServiceRuntimeException;
import com.onlineinteract.service.StoreRuntimeException;
import com.onlineinteract.util.RandomizedSequencer;

/**
 * Implementation for Redis DAO.
 * 
 * @author Gary Black
 *
 */
public class RedisProjectDaoImpl extends RedisBaseDao implements ProjectDao {

	private Logger logger = LoggerFactory.getLogger(this.getClass());

	public RedisProjectDaoImpl(RedisTemplate<String, Object> redisTemplate) {
		super(redisTemplate);
	}

	@Override
	public long createProject(Project project) throws AppRuntimeException {
		try {
			long projectId = getLongSequence();
			logger.info("project: " + projectId + " saving to redis");
			// @formatter:off
			ObjectMapper mapper = new ObjectMapper();
			String workspaceState = mapper.writeValueAsString(project.getWorkspaceState());
			Map<String, String> projectMap = new HashMap<>();
			projectMap.put("id", String.valueOf(projectId));
			projectMap.put("name", project.getName());
			projectMap.put("workspace_state", workspaceState);
			hashOperations.putAll("project:" + projectId, projectMap);
			logger.info("project: " + projectId + " saved to redis");
			return projectId;
		} catch (Exception e) {
			throw new AppRuntimeException("create project", e);
		}
	}

	@Override
	public long saveProject(Project project) throws AppRuntimeException {
		try {
			long projectId = project.getProjectId();
			logger.info("project: " + projectId + " saving back to redis");
			// @formatter:off
			ObjectMapper mapper = new ObjectMapper();
			String workspaceState = mapper.writeValueAsString(project.getWorkspaceState());
			Map<String, String> projectMap = new HashMap<>();
			projectMap.put("id", String.valueOf(projectId));
			projectMap.put("name", project.getName());
			projectMap.put("workspace_state", workspaceState);
			hashOperations.putAll("project:" + projectId, projectMap);
			logger.info("project: " + projectId + " saved back to redis");
			return projectId;
		} catch (Exception e) {
			throw new AppRuntimeException("save project", e);
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public Project retrieveProject(long projectId) throws ServiceRuntimeException {
		Long id = Long.valueOf(hashOperations.get("project:" + projectId, "id"));
		logger.info("retrieving project: " + projectId);
		String name = hashOperations.get("project:" + projectId, "name");
		String ws = hashOperations.get("project:" + projectId, "workspace_state");
		Project project = new Project();
		project.setProjectId(id);
		project.setName(name);
		List<Tabs> workspaceState = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			workspaceState = mapper.readValue(ws, List.class);
		} catch (IOException e) {
			e.printStackTrace();
		}
		project.setWorkspaceState(workspaceState);
		logger.info("returing project: " + project.getName());
		return project;
	}

	@SuppressWarnings("unchecked")
	@Override
	public Project retrieveProject(String projectName) throws ServiceRuntimeException {
		logger.info("retrieving projectName " + projectName);
		Set<String> keys = redisTemplate.keys("*");
		ObjectMapper mapper = new ObjectMapper();
		for (String key : keys) {
			logger.info("retrieving project with key: " + key);
			if (hashOperations.get(key, "id") == null || key == null || !(key.length() > 0))
				continue;

			String name = hashOperations.get(key, "name");
			Project project = new Project();
			if (name.equals(projectName)) {
				Long id = Long.valueOf(hashOperations.get(key, "id"));
				String ws = hashOperations.get(key, "workspace_state");
				project.setProjectId(id);
				project.setName(name);
				List<Tabs> workspaceState = null;
				try {
					workspaceState = mapper.readValue(ws, List.class);
				} catch (IOException e) {
					e.printStackTrace();
				}
				project.setWorkspaceState(workspaceState);
				logger.info("returing project: " + project.getName());
				return project;
			}
		}
		return null;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Project> retrieveProjects() throws ServiceRuntimeException {
		logger.info("retrieving all projects");
		List<Project> projects = new ArrayList<>();
		Set<String> keys = redisTemplate.keys("*");
		logger.info("No of projects: " + keys.size());
		ObjectMapper mapper = new ObjectMapper();
		for (String key : keys) {
			logger.info("key: " + key);
		}
		for (String key : keys) {
			logger.info("retrieving project with key: " + key);
			if (hashOperations.get(key, "id") == null || key == null || !(key.length() > 0))
				continue;

			Long id = Long.valueOf(hashOperations.get(key, "id"));
			String name = hashOperations.get(key, "name");
			String ws = hashOperations.get(key, "workspace_state");
			Project project = new Project();
			project.setProjectId(id);
			project.setName(name);
			List<Tabs> workspaceState = null;
			try {
				if (ws != null)
					workspaceState = mapper.readValue(ws, List.class);
			} catch (IOException e) {
				e.printStackTrace();
			}
			project.setWorkspaceState(workspaceState);
			projects.add(project);
		}
		logger.info("returning all projects of length: " + projects.size());
		return projects;
	}

	@Override
	public int updateProject(Project project) throws ServiceRuntimeException {
		try {
			ObjectMapper mapper = new ObjectMapper();
			String workspaceState = mapper.writeValueAsString(project.getWorkspaceState());
			Map<String, String> projectMap = new HashMap<>();
			projectMap.put("id", String.valueOf(project.getProjectId()));
			projectMap.put("name", project.getName());
			projectMap.put("workspace_state", workspaceState);
			hashOperations.putAll("project:" + project.getProjectId(), projectMap);
			return 1;
		} catch (Exception ex) {
			throw new StoreRuntimeException("updating Project", ex);
		}
	}

	@Override
	public int deleteProject(long projectId) throws ServiceRuntimeException {
		hashOperations.delete("project:" + projectId, "id", "name", "workspace_state");
		return 0;
	}

	/**
	 * Get a long sequence value.
	 * 
	 * @return a random long value
	 */
	protected long getLongSequence() {
		return RandomizedSequencer.nextLongValue();
	}
}
