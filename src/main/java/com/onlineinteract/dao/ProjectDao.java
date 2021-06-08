package com.onlineinteract.dao;

import java.util.List;

import com.onlineinteract.exception.AppRuntimeException;
import com.onlineinteract.model.Project;
import com.onlineinteract.service.ServiceRuntimeException;

public interface ProjectDao {

	/**
	 * Create a new Project.
	 * 
	 * @param project the Project
	 * @return the unique identifier for the Project
	 * @throws AppRuntimeException on any store error
	 */
	long createProject(Project project) throws AppRuntimeException;

	long saveProject(Project project) throws AppRuntimeException;

	public Project retrieveProject(long projectId) throws ServiceRuntimeException;

	Project retrieveProject(String projectName) throws ServiceRuntimeException;

	public List<Project> retrieveProjects() throws ServiceRuntimeException;

	public int updateProject(Project project) throws ServiceRuntimeException;

	public int deleteProject(long projectId) throws ServiceRuntimeException;
}
