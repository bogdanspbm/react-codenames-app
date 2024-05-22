package com.emkn.backend.repository.room;

import com.emkn.backend.model.RoomDTO;

import java.util.List;

public interface RoomRepository {
    int createRoom(RoomDTO roomDTO, int userId);
    RoomDTO getRoomById(int id);
    List<RoomDTO> getAllRooms();
    void deleteRoomByUserId(int userId);
}