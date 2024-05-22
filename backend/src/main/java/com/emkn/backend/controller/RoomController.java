package com.emkn.backend.controller;

import com.emkn.backend.auth.JWTTokenProvider;
import com.emkn.backend.model.RoomDTO;
import com.emkn.backend.model.UserDTO;
import com.emkn.backend.repository.room.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

@RestController
@RequestMapping("/api/v1")
public class RoomController {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketRoomController.class);


    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public RoomController(RoomRepository roomRepository, SimpMessagingTemplate messagingTemplate) {
        this.roomRepository = roomRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/private/rooms")
    public RoomDTO createRoom(@RequestBody RoomDTO roomDTO, HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");
        if (token != null && JWTTokenProvider.validateToken(token.substring(7))) {
            int userId = JWTTokenProvider.getUserIDFromToken(token.substring(7));
            int roomId = roomRepository.createRoom(roomDTO, userId);
            roomDTO.setId(roomId);
            return roomDTO;
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
    }

    @GetMapping("/public/rooms")
    public List<RoomDTO> getAllRooms() {
        return roomRepository.getAllRooms();
    }

    @GetMapping("/private/rooms/{id}")
    public RoomDTO getRoomById(@PathVariable int id) {
        return roomRepository.getRoomById(id);
    }

    @PostMapping("/private/rooms/{id}/join")
    public RoomDTO joinTeam(@PathVariable int id, @RequestParam int teamId, HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");


        logger.info("[Join] Room: " + id + ", Team ID: " + teamId + ", Token: " + token);

        if (token != null && JWTTokenProvider.validateToken(token.substring(7))) {
            int userId = JWTTokenProvider.getUserIDFromToken(token.substring(7));
            String username = JWTTokenProvider.getUsernameFromToken(token.substring(7));
            UserDTO user = new UserDTO();
            user.setId(userId);
            user.setUsername(username);
            roomRepository.joinTeam(id, user, teamId);
            roomRepository.setReadyStatus(id, username, false); // Reset ready status when changing team
            RoomDTO room = roomRepository.getRoomById(id);
            messagingTemplate.convertAndSend("/topic/room/" + id, room);
            return room;
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
    }

    @PostMapping("/private/rooms/{id}/ready")
    public RoomDTO setReadyStatus(@PathVariable int id, @RequestParam boolean ready, HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");

        logger.info("[Ready] Room: " + id + ", Token: " + token);


        if (token != null && JWTTokenProvider.validateToken(token.substring(7))) {
            int userId = JWTTokenProvider.getUserIDFromToken(token.substring(7));
            String username = JWTTokenProvider.getUsernameFromToken(token.substring(7));
            roomRepository.setReadyStatus(id, username, ready);
            RoomDTO room = roomRepository.getRoomById(id);
            messagingTemplate.convertAndSend("/topic/room/" + id, room);

            if (room.getTeams().stream()
                    .flatMap(team -> team.getMembers().values().stream())
                    .allMatch(member -> room.getReadyStatus().getOrDefault(member.getId(), false))) {

                Timer timer = new Timer();
                timer.scheduleAtFixedRate(new TimerTask() {
                    int countdown = 5;

                    @Override
                    public void run() {
                        if (countdown > 0) {
                            messagingTemplate.convertAndSend("/topic/countdown/" + id, countdown);
                            countdown--;
                        } else {
                            room.setStarted(true);
                            messagingTemplate.convertAndSend("/topic/room/" + id, room);
                            timer.cancel();
                        }
                    }
                }, 0, 1000);
            }

            return room;
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
    }

    @PostMapping("/private/rooms/{id}/connect")
    public RoomDTO connectUser(@PathVariable int id, HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");

        logger.info("[Connect] Room: " + id + ", Token: " + token);


        if (token != null && JWTTokenProvider.validateToken(token.substring(7))) {
            int userId = JWTTokenProvider.getUserIDFromToken(token.substring(7));
            String username = JWTTokenProvider.getUsernameFromToken(token.substring(7));
            UserDTO user = new UserDTO();
            user.setId(userId);
            user.setUsername(username);
            roomRepository.connectUser(id, user);
            return roomRepository.getRoomById(id);
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
    }

    @PostMapping("/private/rooms/{id}/disconnect")
    public RoomDTO disconnectUser(@PathVariable int id, HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");

        logger.info("[Disconnect] Room: " + id + ", Token: " + token);

        if (token != null && JWTTokenProvider.validateToken(token.substring(7))) {
            int userId = JWTTokenProvider.getUserIDFromToken(token.substring(7));
            roomRepository.disconnectUser(id, userId);
            return roomRepository.getRoomById(id);
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
    }
}
