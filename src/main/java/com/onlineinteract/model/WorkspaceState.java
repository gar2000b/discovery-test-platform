package com.onlineinteract.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WorkspaceState {
    private List<Tabs> tabs;

    public WorkspaceState() {}

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
