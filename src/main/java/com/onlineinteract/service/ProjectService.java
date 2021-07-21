package com.onlineinteract.service;

import java.util.List;

import com.onlineinteract.model.Project;

/**
 * Main Project Service Interface.
 * 
 * @author Gary Black
 *
 */
public interface ProjectService {

	/**
	 * Create a new project
	 * 
	 * @param project
	 * @return
	 * @throws ServiceRuntimeException
	 */
	long createProject(Project project) throws ServiceRuntimeException;

	/**
	 * Saves a project
	 * 
	 * @param project
	 * @return
	 * @throws ServiceRuntimeException
	 */
	long saveProject(Project project) throws ServiceRuntimeException;

	/**
	 * Retrieves a project based on id
	 * 
	 * @param projectId
	 * @return
	 * @throws ServiceRuntimeException
	 */
	public Project retrieveProject(long projectId) throws ServiceRuntimeException;

	/**
	 * Retrieves a project based on name
	 * 
	 * @param name
	 * @return
	 * @throws ServiceRuntimeException
	 */
	Project retrieveProject(String name) throws ServiceRuntimeException;

	/**
	 * Retrieve all projects
	 * 
	 * @return
	 * @throws ServiceRuntimeException
	 */
	public List<Project> retrieveProjects() throws ServiceRuntimeException;

	/**
	 * Updates a project
	 * 
	 * @param project
	 * @return
	 * @throws ServiceRuntimeException
	 */
	public int updateProject(Project project) throws ServiceRuntimeException;

	/**
	 * Deletes a project
	 * 
	 * @param projectId
	 * @return
	 * @throws ServiceRuntimeException
	 */
	public int deleteProject(long projectId) throws ServiceRuntimeException;
}
