package com.emkn.backend.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TeamDTO {
    private int id = -1;
    private String name = "";
    private UserDTO owner = null;
    private Map<String, UserDTO> members = new HashMap<>();



    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UserDTO getOwner() {
        return owner;
    }

    public void setOwner(UserDTO owner) {
        this.owner = owner;
    }

    public Map<String, UserDTO> getMembers() {
        return members;
    }

    public void setMembers(Map<String, UserDTO> members) {
        this.members = members;
    }
}
