package com.emkn.backend.controller;

import com.emkn.backend.auth.JWTTokenProvider;
import com.emkn.backend.model.ChatMessageDTO;
import com.emkn.backend.model.RoomDTO;
import com.emkn.backend.model.RoomReadyDTO;
import com.emkn.backend.repository.room.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketRoomController {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketRoomController.class);

    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketRoomController(RoomRepository roomRepository, SimpMessagingTemplate messagingTemplate) {
        this.roomRepository = roomRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatMessageDTO sendMessage(@Payload ChatMessageDTO message, @Header("Authorization") String token) {
        logger.info("Received message: {}", message);
        if (JWTTokenProvider.validateToken(token)) {
            String username = JWTTokenProvider.getUsernameFromToken(token);
            message.setSender(username);
            roomRepository.addChatMessage(message.getRoomId(), message);
            return message;
        } else {
            logger.warn("Invalid token for message: {}", message);
            return null;
        }
    }

    @MessageMapping("/ready")
    public void setReadyStatus(@Payload RoomReadyDTO roomReadyDTO, @Header("Authorization") String token) {
        logger.info("Received ready status: {}", roomReadyDTO);
        if (JWTTokenProvider.validateToken(token)) {
            String username = JWTTokenProvider.getUsernameFromToken(token.substring(7));
            roomRepository.setReadyStatus(roomReadyDTO.getRoomId(), username, roomReadyDTO.isReady(), messagingTemplate);
            RoomDTO room = roomRepository.getRoomById(roomReadyDTO.getRoomId());
            messagingTemplate.convertAndSend("/topic/room/" + roomReadyDTO.getRoomId(), room);
        } else {
            logger.warn("Invalid token for ready status: {}", roomReadyDTO);
        }
    }
}
