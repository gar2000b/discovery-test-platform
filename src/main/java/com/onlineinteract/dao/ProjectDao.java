package com.onlineinteract.dao;

import java.util.List;

import com.onlineinteract.exception.AppRuntimeException;
import com.onlineinteract.model.Project;
import com.onlineinteract.service.ServiceRuntimeException;

/**
 * 
 * @author Gary Black
 *
 */
public interface ProjectDao {

	/**
	 * Create a new Project.
	 * 
	 * @param project the Project
	 * @return the unique identifier for the Project
	 * @throws AppRuntimeException on any store error
	 */
	long createProject(Project project) throws AppRuntimeException;

	/**
	 * Save project.
	 * 
	 * @param project
	 * @return
	 * @throws AppRuntimeException
	 */
	long saveProject(Project project) throws AppRuntimeException;

	/**
	 * Retrieve project based on Id.
	 * 
	 * @param projectId
	 * @return
	 * @throws ServiceRuntimeException
	 */
	public Project retrieveProject(long projectId) throws ServiceRuntimeException;

	/**
	 * Retrieve project based on name.
	 * 
	 * @param projectName
	 * @return
	 * @throws ServiceRuntimeException
	 */
	Project retrieveProject(String projectName) throws ServiceRuntimeException;

	/**
	 * Retrieve all proejcts.
	 * 
	 * @return
	 * @throws ServiceRuntimeException
	 */
	public List<Project> retrieveProjects() throws ServiceRuntimeException;

	/**
	 * Update project.
	 * 
	 * @param project
	 * @return
	 * @throws ServiceRuntimeException
	 */
	public int updateProject(Project project) throws ServiceRuntimeException;

	/**
	 * Delete project based on Id.
	 * 
	 * @param projectId
	 * @return
	 * @throws ServiceRuntimeException
	 */
	public int deleteProject(long projectId) throws ServiceRuntimeException;
}
