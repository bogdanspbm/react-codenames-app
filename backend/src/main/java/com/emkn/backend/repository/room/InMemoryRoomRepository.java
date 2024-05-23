package com.emkn.backend.repository.room;

import com.emkn.backend.controller.WebSocketRoomController;
import com.emkn.backend.model.*;
import com.emkn.backend.repository.word.SQLWordRepository;
import com.emkn.backend.repository.word.WordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Repository
public class InMemoryRoomRepository implements RoomRepository {
    private Map<Integer, Timer> countdownTimers = new ConcurrentHashMap<>();

    private static final Logger logger = LoggerFactory.getLogger(WebSocketRoomController.class);

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
        if (roomDTO != null) {
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

            if(team.getMembers().isEmpty()){
                team.setOwner(null);
            } else {
                team.setOwner(team.getMembers().get(team.getMembers().keySet().stream().findFirst().get()));
            }

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
    public void setReadyStatus(int roomId, String userName, boolean isReady, SimpMessagingTemplate messagingTemplate) {
        RoomDTO room = rooms.get(roomId);
        if (room == null || room.isStarted()) {
            return;
        }

        room.getReadyStatus().put(userName, isReady);

        List<String> membersList = new ArrayList<>();
        room.getTeams().forEach(team -> team.getMembers().forEach((username, member) -> membersList.add(member.getUsername())));

        int counter = 0;
        for (String member : membersList) {
            if (room.getReadyStatus().containsKey(member) && room.getReadyStatus().get(member)) {
                counter += 1;
            }
        }

        if (counter == membersList.size()) {
            startCountdown(roomId, messagingTemplate);
        } else {
            stopCountdown(roomId);
        }
    }

    private void startCountdown(int roomId, SimpMessagingTemplate messagingTemplate) {
        Timer timer = new Timer();
        countdownTimers.put(roomId, timer);

        timer.scheduleAtFixedRate(new TimerTask() {
            int countdown = 5;

            @Override
            public void run() {
                if (countdown > 0) {
                    messagingTemplate.convertAndSend("/topic/countdown/" + roomId, countdown);
                    countdown--;
                } else {
                    RoomDTO room = rooms.get(roomId);
                    if (room != null) {
                        room.setStarted(true);
                        messagingTemplate.convertAndSend("/topic/room/" + roomId, room);
                        startTurn(roomId, messagingTemplate);
                    }
                    timer.cancel();
                }
            }
        }, 0, 1000);
    }

    private void startTurn(int roomId, SimpMessagingTemplate messagingTemplate) {
        RoomDTO room = rooms.get(roomId);
        if (room == null) return;

        Timer timer = new Timer();
        countdownTimers.put(roomId, timer);

        TeamDTO currentTeam = room.getTeams().get(room.getCurrentTeamIndex());
        String turnType = room.isOwnerTurn() ? "owner" : "member";
        String messageContent = "Ход " + (room.isOwnerTurn() ? "владельца команды " : "участников команды ") + currentTeam.getName();

        ChatMessageDTO logMessage = new ChatMessageDTO();
        logMessage.setSender("System");
        logMessage.setContent(messageContent);
        logMessage.setRoomId(roomId);
        room.getChatHistory().add(logMessage);
        messagingTemplate.convertAndSend("/topic/messages", logMessage);

        timer.scheduleAtFixedRate(new TimerTask() {
            int countdown = 60;

            @Override
            public void run() {
                if (countdown > 0) {
                    messagingTemplate.convertAndSend("/topic/countdown/" + roomId, countdown);
                    countdown--;
                } else {
                    if (room.isOwnerTurn()) {
                        endOwnerTurn(roomId, messagingTemplate);
                    } else {
                        endMemberTurn(roomId, messagingTemplate);
                    }
                    timer.cancel();
                }
            }
        }, 0, 1000);

        messagingTemplate.convertAndSend("/topic/turn/" + roomId, turnType);
    }

    private void endOwnerTurn(int roomId, SimpMessagingTemplate messagingTemplate) {
        stopCountdown(roomId);
        RoomDTO room = rooms.get(roomId);
        if (room == null) return;

        // Логика для завершения хода владельца команды
        TeamDTO currentTeam = room.getTeams().get(room.getCurrentTeamIndex());
        if (!room.getOwnerMessages().isEmpty()) {
            OwnerMessageDTO lastOwnerMessage = room.getOwnerMessages().get(room.getOwnerMessages().size() - 1);
            String owner = lastOwnerMessage.getUsername();
            String messageContent = owner + " назвал слово: " + lastOwnerMessage.getWord() + " и число: " + lastOwnerMessage.getNumber();

            ChatMessageDTO logMessage = new ChatMessageDTO();
            logMessage.setSender("System");
            logMessage.setContent(messageContent);
            logMessage.setRoomId(roomId);
            room.getChatHistory().add(logMessage);
            messagingTemplate.convertAndSend("/topic/messages", logMessage);
        } else if (currentTeam.getOwner() != null) {
            String owner = currentTeam.getOwner().getUsername();
            String messageContent = owner + " не назвал слово.";

            ChatMessageDTO logMessage = new ChatMessageDTO();
            logMessage.setSender("System");
            logMessage.setContent(messageContent);
            logMessage.setRoomId(roomId);
            room.getChatHistory().add(logMessage);
            messagingTemplate.convertAndSend("/topic/messages", logMessage);
        }

        room.setOwnerTurn(false);
        room.clearVotes(); // Очистка голосов перед ходом участников
        messagingTemplate.convertAndSend("/topic/room/" + roomId, room);
        startTurn(roomId, messagingTemplate);
    }

    private void endMemberTurn(int roomId, SimpMessagingTemplate messagingTemplate) {
        stopCountdown(roomId);
        RoomDTO room = rooms.get(roomId);
        if (room == null) return;

        // Логика для обработки хода участников команды
        TeamDTO currentTeam = room.getTeams().get(room.getCurrentTeamIndex());
        int count = room.getOwnerNumber(); // Предполагается, что у нас есть способ получить число от владельца команды
        List<String> words = room.selectWords(count);
        room.clearVotes();
        String messageContent = currentTeam.getName() + " выбрала слова: " + String.join(", ", words);

        ChatMessageDTO logMessage = new ChatMessageDTO();
        logMessage.setSender("System");
        logMessage.setContent(messageContent);
        logMessage.setRoomId(roomId);
        room.getChatHistory().add(logMessage);
        messagingTemplate.convertAndSend("/topic/messages", logMessage);

        room.setOwnerTurn(true);
        room.setCurrentTeamIndex((room.getCurrentTeamIndex() + 1) % room.getTeams().size());
        messagingTemplate.convertAndSend("/topic/room/" + roomId, room);
        startTurn(roomId, messagingTemplate);
    }



    @Override
    public void addOwnerMessage(int roomId, OwnerMessageDTO message, SimpMessagingTemplate messagingTemplate) {
        RoomDTO room = rooms.get(roomId);
        if (room == null || !room.isOwnerTurn()) {
            return;
        }

        room.getOwnerMessages().add(message);

        TeamDTO currentTeam = room.getTeams().get(room.getCurrentTeamIndex());
        String messageContent = message.getUsername() + " назвал слово: " + message.getWord() + " и число: " + message.getNumber();

        ChatMessageDTO logMessage = new ChatMessageDTO();
        logMessage.setSender("System");
        logMessage.setContent(messageContent);
        logMessage.setRoomId(roomId);
        room.getChatHistory().add(logMessage);
        messagingTemplate.convertAndSend("/topic/messages", logMessage);

        endOwnerTurn(roomId, messagingTemplate);
    }


    // Новый метод для обработки голосования участников
    @Override
    public void voteForWord(int roomId, String word, String username, SimpMessagingTemplate messagingTemplate) {
        RoomDTO room = rooms.get(roomId);
        if (room == null || room.isOwnerTurn()) {
            return;
        }

        TeamDTO currentTeam = room.getTeams().get(room.getCurrentTeamIndex());
        if (currentTeam.getMembers().containsKey(username)) {
            room.addVote(word, username, room.getOwnerNumber());
        }

        messagingTemplate.convertAndSend("/topic/room/" + roomId, room);
    }

    private void stopCountdown(int roomId) {
        Timer timer = countdownTimers.remove(roomId);
        if (timer != null) {
            timer.cancel();
        }
    }

    @Override
    public void connectUser(int roomId, UserDTO user) {
        RoomDTO room = rooms.get(roomId);
        if (room != null && !room.isStarted()) {
            room.getSpectators().put(user.getUsername(), user);
        }
    }

    @Override
    public void disconnectUser(int roomId, int userId) {
        RoomDTO room = rooms.get(roomId);
        if (room != null && !room.isStarted()) {
            room.getTeams().forEach(team -> team.getMembers().values().removeIf(member -> member.getId() == userId));
            room.getSpectators().values().removeIf(spectator -> spectator.getId() == userId);
        }
    }

    @Override
    public void disconnectUser(int roomId, String username) {
        RoomDTO room = rooms.get(roomId);
        if (room != null && !room.isStarted()) {
            room.getTeams().forEach(team -> team.getMembers().remove(username));
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
        List<WordDTO> words = wordRepository.getRandomWords(25, roomDTO.getLanguage());
        assignWordsToTeams(words, roomDTO.getTeamCount(), 25);
        words.get(0).setTeamIndex(5);
        Collections.shuffle(words);
        roomDTO.setWords(words);
    }

    private void assignWordsToTeams(List<WordDTO> words, int teamCount, int limit) {
        for (int i = 0; i < words.size(); i++) {
            if(i > limit){
                return;
            }
            words.get(i).setTeamIndex(i % teamCount);
        }
    }
}
