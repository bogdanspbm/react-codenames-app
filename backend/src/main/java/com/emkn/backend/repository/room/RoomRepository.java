package com.emkn.backend.repository.room;

import com.emkn.backend.model.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;

public interface RoomRepository {
    int createRoom(RoomDTO roomDTO, int userId);

    RoomDTO getRoomById(int id);

    List<RoomDTO> getAllRooms();

    void deleteRoomByUserId(int userId);

    void setReadyStatus(int roomId, String userName, boolean isReady, SimpMessagingTemplate messagingTemplate);

    void voteForWord(int roomId, String word, String username, SimpMessagingTemplate messagingTemplate);

    void addOwnerMessage(int roomId, OwnerMessageDTO message, SimpMessagingTemplate messagingTemplate);

    void joinTeam(int roomId, UserDTO user, int teamId);

    void connectUser(int roomId, UserDTO user);

    void disconnectUser(int roomId, int userId);

    void disconnectUser(int roomId, String username);

    void pingUser(UserPingDTO userPing);

    List<UserPingDTO> getAllUserPings();

    void addChatMessage(int roomId, ChatMessageDTO message);
}