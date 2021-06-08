package com.onlineinteract.service;

import java.util.List;

import com.onlineinteract.model.Project;

public interface ProjectService {

	long createProject(Project project) throws ServiceRuntimeException;

	long saveProject(Project project) throws ServiceRuntimeException;

	public Project retrieveProject(long projectId) throws ServiceRuntimeException;

	Project retrieveProject(String name) throws ServiceRuntimeException;

	public List<Project> retrieveProjects() throws ServiceRuntimeException;

	public int updateProject(Project project) throws ServiceRuntimeException;

	public int deleteProject(long projectId) throws ServiceRuntimeException;
}
