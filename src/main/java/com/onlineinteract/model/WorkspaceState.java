package com.onlineinteract.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * WorkspaceState Data Model - TODO: consider removing as favor of tabs
 * collection direct within Project DM.
 * 
 * @author Gary Black
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class WorkspaceState {
	private List<Tabs> tabs;

	public WorkspaceState() {
	}

	public WorkspaceState(List<Tabs> tabs) {
		this.tabs = tabs;
	}

	public List<Tabs> getTabs() {
		return tabs;
	}

	public void setTabs(List<Tabs> tabs) {
		this.tabs = tabs;
	}
}
