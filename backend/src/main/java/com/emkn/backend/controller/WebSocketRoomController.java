package com.emkn.backend.controller;

import com.emkn.backend.auth.JWTTokenProvider;
import com.emkn.backend.model.ChatMessageDTO;
import com.emkn.backend.model.UserDTO;
import com.emkn.backend.repository.room.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketRoomController {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketRoomController.class);

    private final RoomRepository roomRepository;

    @Autowired
    public WebSocketRoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatMessageDTO sendMessage(@Payload ChatMessageDTO message, @Header("Authorization") String token) {
        logger.info("Received message: {}", message);
        if (JWTTokenProvider.validateToken(token)) {
            String username = JWTTokenProvider.getUsernameFromToken(token);
            message.setSender(username);
            return message;
        } else {
            logger.warn("Invalid token for message: {}", message);
            return null;
        }
    }
}
