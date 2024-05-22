package com.emkn.backend.repository.room;

import com.emkn.backend.model.RoomDTO;
import com.emkn.backend.model.TeamDTO;
import com.emkn.backend.model.WordDTO;
import com.emkn.backend.repository.word.SQLWordRepository;
import com.emkn.backend.repository.word.WordRepository;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Repository
public class InMemoryRoomRepository implements RoomRepository {

    private Map<Integer, RoomDTO> rooms = RoomDTO.generateTemplates();
    private Map<Integer, Integer> userRooms = new HashMap<>();
    private AtomicInteger idCounter = new AtomicInteger();
    private WordRepository wordRepository = new SQLWordRepository();

    @Override
    public int createRoom(RoomDTO roomDTO, int userId) {
        deleteRoomByUserId(userId);

        int roomId = idCounter.incrementAndGet();
        roomDTO.setId(roomId);
        generateWordsForRoom(roomDTO);
        generateTeamsForRoom(roomDTO);
        rooms.put(roomId, roomDTO);
        userRooms.put(userId, roomId);
        return roomId;
    }

    @Override
    public RoomDTO getRoomById(int id) {
        RoomDTO roomDTO = rooms.get(id);
        if (roomDTO != null && (roomDTO.getWords() == null || roomDTO.getWords().isEmpty())) {
            generateWordsForRoom(roomDTO);
        }

        if (roomDTO != null && (roomDTO.getTeams() == null || roomDTO.getTeams().isEmpty())) {
            generateTeamsForRoom(roomDTO);
        }

        return rooms.get(id);
    }

    @Override
    public List<RoomDTO> getAllRooms() {
        return new ArrayList<>(rooms.values());
    }

    @Override
    public void deleteRoomByUserId(int userId) {
        Integer roomId = userRooms.remove(userId);
        if (roomId != null) {
            rooms.remove(roomId);
        }
    }

    private void generateWordsForRoom(RoomDTO roomDTO) {
        List<WordDTO> words = wordRepository.getRandomWords(roomDTO.getTeamCount() * 5, roomDTO.getLanguage());
        assignWordsToTeams(words, roomDTO.getTeamCount());
        roomDTO.setWords(words);
    }

    private void generateTeamsForRoom(RoomDTO roomDTO) {
        List<TeamDTO> teams = new ArrayList<>();
        for (int i = 0; i < roomDTO.getTeamCount(); i++) {
            TeamDTO team = new TeamDTO();
            team.setId(i);
            team.setName("Team " + (i + 1));
            team.setOwner(-1);
            team.setMembers(new ArrayList<>());
            teams.add(team);
        }
        roomDTO.setTeams(teams);
    }

    private void assignWordsToTeams(List<WordDTO> words, int teamCount) {
        for (int i = 0; i < words.size(); i++) {
            words.get(i).setTeamIndex(i % teamCount);
        }
    }

}