package com.onlineinteract;

/**
 * URITemplates defines the URI resources for REST access.
 * 
 * @author Gary Black
 *
 */
public class UriTemplates {

	public static final String PROJECTS = "/projects";

	public static final String PROJECT_ID = "/projects/{projectId}";

	public static final String PROJECT_NAME = "/projects/name/{projectName}";
	
	public static final String TEST_EXECUTION = "/projects/name/{projectName}/execute-test/{testId}";
}
