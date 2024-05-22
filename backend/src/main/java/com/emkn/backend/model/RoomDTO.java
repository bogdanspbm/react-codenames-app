package com.emkn.backend.model;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RoomDTO {
    private int id = -1;
    private String name = "";
    private int teamCount = 2;
    private String language = "Russian";
    private List<WordDTO> words = new ArrayList<>();
    private List<TeamDTO> teams = new ArrayList<>();;


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

    public int getTeamCount() {
        return teamCount;
    }

    public void setTeamCount(int teamCount) {
        this.teamCount = teamCount;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public List<WordDTO> getWords() {
        return words;
    }

    public void setWords(List<WordDTO> words) {
        this.words = words;
    }

    public List<TeamDTO> getTeams() {
        return teams;
    }

    public void setTeams(List<TeamDTO> teams) {
        this.teams = teams;
    }

    public static Map<Integer, RoomDTO> generateTemplates(){
        Map<Integer, RoomDTO> output = new HashMap<>();

        RoomDTO roomA = new RoomDTO();
        roomA.setId(1);
        roomA.setName("Demo");
        roomA.setLanguage("Russian");

        output.put(1, roomA);
        return output;
    }
}
