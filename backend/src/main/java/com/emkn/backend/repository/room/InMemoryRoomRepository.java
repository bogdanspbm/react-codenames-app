package com.emkn.backend.repository.room;

import com.emkn.backend.model.*;
import com.emkn.backend.repository.word.SQLWordRepository;
import com.emkn.backend.repository.word.WordRepository;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Repository
public class InMemoryRoomRepository implements RoomRepository {

    private static RoomRepository repository;

    public static RoomRepository getRoomRepository() {
        if (repository == null) {
            repository = new InMemoryRoomRepository();
        }

        return repository;
    }

    private Map<Integer, RoomDTO> rooms = RoomDTO.generateTemplates();
    private Map<Integer, Integer> userRooms = new HashMap<>();
    private AtomicInteger idCounter = new AtomicInteger();
    private WordRepository wordRepository = new SQLWordRepository();
    private Map<String, UserPingDTO> userPings = new ConcurrentHashMap<>();

    @Override
    public int createRoom(RoomDTO roomDTO, int userId) {
        deleteRoomByUserId(userId);

        int roomId = idCounter.incrementAndGet();
        roomDTO.setId(roomId);
        generateTeamsForRoom(roomDTO);
        generateWordsForRoom(roomDTO);
        rooms.put(roomId, roomDTO);
        userRooms.put(userId, roomId);
        return roomId;
    }

    @Override
    public RoomDTO getRoomById(int id) {
        RoomDTO roomDTO = rooms.get(id);
        if (roomDTO == null) {
            return null;
        }

        if (roomDTO.getWords() == null || roomDTO.getWords().isEmpty()) {
            generateWordsForRoom(roomDTO);
        }

        if (roomDTO.getTeams() == null || roomDTO.getTeams().isEmpty()) {
            generateTeamsForRoom(roomDTO);
        } else {
            for (TeamDTO team : roomDTO.getTeams()) {
                if (team.getMembers() == null) {
                    team.setMembers(new HashMap<>());
                }
            }
        }

        if (roomDTO.getSpectators() == null) {
            roomDTO.setSpectators(new HashMap<>());
        }

        return roomDTO;
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

    @Override
    public void joinTeam(int roomId, UserDTO user, int teamId) {
        RoomDTO room = rooms.get(roomId);
        if (room == null || room.isStarted()) {
            return;
        }

        for (TeamDTO team : room.getTeams()) {
            team.getMembers().remove(user.getUsername());
            if (team.getId() == teamId) {
                team.getMembers().put(user.getUsername(), user);
                if (team.getOwner() == null) {
                    team.setOwner(user);
                }
            }
        }

        if (teamId == -1) {
            room.getSpectators().put(user.getUsername(), user);
        } else {
            room.getSpectators().remove(user.getUsername());
        }
    }

    @Override
    public void setReadyStatus(int roomId, int userId, boolean isReady) {
        RoomDTO room = rooms.get(roomId);
        if (room == null || room.isStarted()) {
            return;
        }

        room.getReadyStatus().put(userId, isReady);
        if (room.getReadyStatus().values().stream().allMatch(Boolean::booleanValue)) {
            new Timer().schedule(new TimerTask() {
                @Override
                public void run() {
                    room.setStarted(true);
                }
            }, 5000);
        }
    }

    @Override
    public void connectUser(int roomId, UserDTO user) {
        RoomDTO room = rooms.get(roomId);
        if (room != null) {
            room.getSpectators().put(user.getUsername(), user);
        }
    }

    @Override
    public void disconnectUser(int roomId, int userId) {
        RoomDTO room = rooms.get(roomId);
        if (room == null) {
            return;
        }

        if (!room.isStarted()) {
            disconnectUserById(room, userId);
        } else {
            UserDTO user = findUserById(room, userId);
            if (user != null && room.getSpectators().containsKey(user.getUsername())) {
                room.getSpectators().remove(user.getUsername());
            }
        }
    }

    @Override
    public void disconnectUser(int roomId, String username) {
        RoomDTO room = rooms.get(roomId);
        if (room == null) {
            return;
        }

        if (!room.isStarted()) {
            room.getSpectators().remove(username);
            for (TeamDTO team : room.getTeams()) {
                team.getMembers().remove(username);
            }
        } else if (room.getSpectators().containsKey(username)) {
            room.getSpectators().remove(username);
        }
    }

    @Override
    public void pingUser(UserPingDTO userPing) {
        userPings.put(userPing.getUsername(), userPing);
    }

    @Override
    public List<UserPingDTO> getAllUserPings() {
        return new ArrayList<>(userPings.values());
    }

    @Override
    public void addChatMessage(int roomId, ChatMessageDTO message) {
        RoomDTO room = rooms.get(roomId);
        if (room != null) {
            room.getChatHistory().add(message);
        }
    }

    private void generateTeamsForRoom(RoomDTO roomDTO) {
        List<TeamDTO> teams = new ArrayList<>();
        for (int i = 0; i < roomDTO.getTeamCount(); i++) {
            TeamDTO team = new TeamDTO();
            team.setId(i);  // ID команды соответствует ее индексу
            team.setName("Team " + (i + 1));
            team.setOwner(null);  // Владельца изначально нет
            team.setMembers(new HashMap<>());
            teams.add(team);
        }
        roomDTO.setTeams(teams);
        roomDTO.setReadyStatus(new HashMap<>());
        roomDTO.setSpectators(new HashMap<>());
    }

    private void generateWordsForRoom(RoomDTO roomDTO) {
        List<WordDTO> words = wordRepository.getRandomWords(roomDTO.getTeamCount() * 5, roomDTO.getLanguage());
        assignWordsToTeams(words, roomDTO.getTeamCount());
        roomDTO.setWords(words);
    }

    private void assignWordsToTeams(List<WordDTO> words, int teamCount) {
        for (int i = 0; i < words.size(); i++) {
            words.get(i).setTeamIndex(i % teamCount);
        }
    }

    private UserDTO findUserById(RoomDTO room, int userId) {
        for (TeamDTO team : room.getTeams()) {
            for (UserDTO user : team.getMembers().values()) {
                if (user.getId() == userId) {
                    return user;
                }
            }
        }

        for (UserDTO user : room.getSpectators().values()) {
            if (user.getId() == userId) {
                return user;
            }
        }

        return null;
    }

    private void disconnectUserById(RoomDTO room, int userId) {
        UserDTO user = findUserById(room, userId);
        if (user != null) {
            room.getSpectators().remove(user.getUsername());
            for (TeamDTO team : room.getTeams()) {
                team.getMembers().remove(user.getUsername());
            }
        }
    }
}
