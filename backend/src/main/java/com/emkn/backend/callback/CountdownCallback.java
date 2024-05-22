package com.emkn.backend.callback;

public interface CountdownCallback {
    void startCountdown(int roomId);
    void stopCountdown(int roomId);
}
