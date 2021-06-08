package com.onlineinteract.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.onlineinteract.config.ConfigConstants;
import com.onlineinteract.dao.ProjectDao;
import com.onlineinteract.model.Project;
import com.onlineinteract.service.ProjectService;
import com.onlineinteract.service.ServiceRuntimeException;
import com.onlineinteract.service.StoreRuntimeException;

@Service(value = ConfigConstants.PROJECT_SERVICE)
public class ProjectServiceImpl implements ProjectService {

	@SuppressWarnings("unused")
	private Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ProjectDao projectDao;

	public void setProjectDao(ProjectDao projectDao) {
		this.projectDao = projectDao;
	}

	@Override
	public long createProject(Project project) throws ServiceRuntimeException {
		try {
			return projectDao.createProject(project);
		} catch (StoreRuntimeException e) {
			throw new ServiceRuntimeException(e);
		}
	}

	@Override
	public long saveProject(Project project) throws ServiceRuntimeException {
		try {
			return projectDao.saveProject(project);
		} catch (StoreRuntimeException e) {
			throw new ServiceRuntimeException(e);
		}
	}

	@Override
	public Project retrieveProject(long projectId) throws ServiceRuntimeException {
		try {
			return projectDao.retrieveProject(projectId);
		} catch (StoreRuntimeException e) {
			throw new ServiceRuntimeException(e);
		}
	}

	@Override
	public Project retrieveProject(String name) throws ServiceRuntimeException {
		try {
			return projectDao.retrieveProject(name);
		} catch (StoreRuntimeException e) {
			throw new ServiceRuntimeException(e);
		}
	}

	@Override
	public List<Project> retrieveProjects() throws ServiceRuntimeException {
		try {
			return projectDao.retrieveProjects();
		} catch (StoreRuntimeException e) {
			throw new ServiceRuntimeException(e);
		}
	}

	@Override
	public int updateProject(Project project) throws ServiceRuntimeException {
		try {
			return projectDao.updateProject(project);
		} catch (StoreRuntimeException e) {
			throw new ServiceRuntimeException(e);
		}
	}

	@Override
	public int deleteProject(long projectId) throws ServiceRuntimeException {
		try {
			return projectDao.deleteProject(projectId);
		} catch (StoreRuntimeException e) {
			throw new ServiceRuntimeException(e);
		}
	}
}
