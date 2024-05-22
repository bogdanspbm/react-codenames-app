package com.emkn.backend.model;

public class UserPingDTO {
    private String username;
    private int roomId;
    private long lastPingTime;

    public UserPingDTO(String username, int roomId, long lastPingTime) {
        this.username = username;
        this.roomId = roomId;
        this.lastPingTime = lastPingTime;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getRoomId() {
        return roomId;
    }

    public void setRoomId(int roomId) {
        this.roomId = roomId;
    }

    public long getLastPingTime() {
        return lastPingTime;
    }

    public void setLastPingTime(long lastPingTime) {
        this.lastPingTime = lastPingTime;
    }
}
