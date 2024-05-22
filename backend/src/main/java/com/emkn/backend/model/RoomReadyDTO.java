package com.emkn.backend.model;

public class RoomReadyDTO {
    private int roomId;
    private boolean isReady;

    // Getters and setters
    public int getRoomId() {
        return roomId;
    }

    public void setRoomId(int roomId) {
        this.roomId = roomId;
    }

    public boolean isReady() {
        return isReady;
    }

    public void setReady(boolean ready) {
        isReady = ready;
    }
}
