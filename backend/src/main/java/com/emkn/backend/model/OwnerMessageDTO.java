package com.emkn.backend.model;

public class OwnerMessageDTO {
    private int teamIndex;
    private String username;
    private String word;
    private int number;

    public OwnerMessageDTO() {
    }

    public OwnerMessageDTO(int teamIndex, String username, String word, int number) {
        this.teamIndex = teamIndex;
        this.username = username;
        this.word = word;
        this.number = number;
    }

    public int getTeamIndex() {
        return teamIndex;
    }

    public void setTeamIndex(int teamIndex) {
        this.teamIndex = teamIndex;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }
}
