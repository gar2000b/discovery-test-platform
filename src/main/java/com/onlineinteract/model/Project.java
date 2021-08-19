package com.onlineinteract.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Main project Data Model
 * 
 * @author Gary Black
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Project {
    private Long projectId;
    private String name;
    private List<Tabs> workspaceState;

    /**
     * Default constructor.
     */
    public Project() {}

    public Project(Long projectId, String name, List<Tabs> workspaceState) {
        this.projectId = projectId;
        this.name = name;
        this.workspaceState = workspaceState;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Tabs> getWorkspaceState() {
        return workspaceState;
    }

    public void setWorkspaceState(List<Tabs> workspaceState) {
        this.workspaceState = workspaceState;
    }
}
