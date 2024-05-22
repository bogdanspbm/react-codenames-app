package com.emkn.backend.repository.room;

import com.emkn.backend.model.ChatMessageDTO;
import com.emkn.backend.model.RoomDTO;
import com.emkn.backend.model.UserDTO;

import java.util.List;

public interface RoomRepository {
    int createRoom(RoomDTO roomDTO, int userId);

    RoomDTO getRoomById(int id);

    List<RoomDTO> getAllRooms();

    void deleteRoomByUserId(int userId);

    void setReadyStatus(int roomId, int userId, boolean isReady);

    void joinTeam(int roomId, UserDTO user, int teamId);

    void connectUser(int roomId, UserDTO user);

    void disconnectUser(int roomId, int userId);

    void addChatMessage(int roomId, ChatMessageDTO message);
}