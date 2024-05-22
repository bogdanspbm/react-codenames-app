package com.emkn.backend.model;

public class WordDTO {
    private int id;
    private String word;
    private String lang;

    private int teamIndex;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    public int getTeamIndex() {
        return teamIndex;
    }

    public void setTeamIndex(int teamIndex) {
        this.teamIndex = teamIndex;
    }
}
