package com.emkn.backend.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RoomDTO {
    private int id = -1;
    private String name = "";

    private int turn = 0;
    private int teamCount = 2;
    private String language = "Russian";
    private List<WordDTO> words = new ArrayList<>();
    private List<TeamDTO> teams = new ArrayList<>();
    private boolean isStarted = false;
    private Map<String, Boolean> readyStatus = new HashMap<>();
    private Map<String, UserDTO> spectators = new HashMap<>();
    private List<ChatMessageDTO> chatHistory = new ArrayList<>();
    private int currentTeamIndex = 0;
    private boolean ownerTurn = true;

    // Новое поле
    private List<OwnerMessageDTO> ownerMessages = new ArrayList<>();

    // Новые поля для голосования
    private Map<String, List<String>> wordVotes = new HashMap<>();
    private Map<String, Integer> userVotes = new HashMap<>();
    private Map<String, Boolean> selectedWords = new HashMap<>();

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

    public boolean isStarted() {
        return isStarted;
    }

    public void setStarted(boolean started) {
        isStarted = started;
    }

    public Map<String, Boolean> getReadyStatus() {
        return readyStatus;
    }

    public void setReadyStatus(Map<String, Boolean> readyStatus) {
        this.readyStatus = readyStatus;
    }

    public Map<String, UserDTO> getSpectators() {
        return spectators;
    }

    public void setSpectators(Map<String, UserDTO> spectators) {
        this.spectators = spectators;
    }

    public List<ChatMessageDTO> getChatHistory() {
        return chatHistory;
    }

    public void setChatHistory(List<ChatMessageDTO> chatHistory) {
        this.chatHistory = chatHistory;
    }

    public int getCurrentTeamIndex() {
        return currentTeamIndex;
    }

    public void setCurrentTeamIndex(int currentTeamIndex) {
        this.currentTeamIndex = currentTeamIndex;
    }

    public boolean isOwnerTurn() {
        return ownerTurn;
    }

    public WordDTO getUnusedWordForTeams(int index) {
        for (WordDTO wordDTO : words) {
            if(wordDTO.getTeamIndex() != index){
                continue;
            }

            if(selectedWords == null || selectedWords.size() == 0 ){
                return wordDTO;
            }

            if(!selectedWords.containsKey(wordDTO.getWord()) || !selectedWords.get(wordDTO.getWord())){
                return wordDTO;
            }
        }

        return null;
    }

    public void setOwnerTurn(boolean ownerTurn) {
        this.ownerTurn = ownerTurn;
    }

    public Map<String, List<String>> getVoteCounts() {
        return wordVotes;
    }

    public Map<String, Boolean> getSelectedWords() {
        return selectedWords;
    }

    public List<OwnerMessageDTO> getOwnerMessages() {
        return ownerMessages;
    }

    public boolean hasUnusedOwnerMessage() {
        if (ownerMessages.isEmpty()) {
            return false;
        }

        return !ownerMessages.get(ownerMessages.size() - 1).isUsed();
    }

    public int getTurn() {
        return turn;
    }

    public int incrementTurn() {
        this.turn += 1;
        return turn;
    }

    public void setTurn(int turn) {
        this.turn = turn;
    }

    // Методы для голосования
    public void addVote(String word, String username, int limit) {
        if (!wordVotes.containsKey(word) || wordVotes.get(word) == null) {
            wordVotes.put(word, new ArrayList<>());
        }

        if (!userVotes.containsKey(username)) {
            userVotes.put(username, 0);
        }

        List<String> votes = wordVotes.get(word);
        if (votes.isEmpty() && userVotes.get(username) < limit) {
            votes.add(username);
            userVotes.put(username, userVotes.get(username) + 1);
            return;
        }

        if (votes.contains(username)) {
            userVotes.put(username, userVotes.get(username) - 1);
            votes.remove(username);
        } else if (userVotes.get(username) < limit) {
            userVotes.put(username, userVotes.get(username) + 1);
            votes.add(username);
        }
    }

    public void clearVotes() {
        userVotes.clear();
        wordVotes.clear();
    }

    public List<String> selectWords(int count) {
        List<Map.Entry<String, List<String>>> entries = new ArrayList<>(wordVotes.entrySet());

        entries.sort((e1, e2) -> Integer.compare(e2.getValue().size(), e1.getValue().size()));

        List<String> output = new ArrayList<>();

        for (int i = 0; i < Math.min(count, entries.size()); i++) {
            output.add(entries.get(i).getKey());
            selectedWords.put(entries.get(i).getKey(), true);
        }

        return output;
    }

    public static Map<Integer, RoomDTO> generateTemplates() {
        Map<Integer, RoomDTO> output = new HashMap<>();

        RoomDTO roomA = new RoomDTO();
        roomA.setId(1);
        roomA.setName("Demo");
        roomA.setLanguage("Russian");

        output.put(1, roomA);
        return output;
    }

    // Метод для получения последнего числа от владельца команды
    public int getOwnerNumber() {
        if (!ownerMessages.isEmpty() && !ownerMessages.get(ownerMessages.size() - 1).isUsed()) {
            return ownerMessages.get(ownerMessages.size() - 1).getNumber();
        }
        return 0; // Возвращаем 0, если нет сообщений от владельца
    }

    public void setOwnerMessageUsed() {
        if (ownerMessages.isEmpty()) {
            return;
        }

        ownerMessages.get(ownerMessages.size() - 1).setUsed(true);
    }
}
