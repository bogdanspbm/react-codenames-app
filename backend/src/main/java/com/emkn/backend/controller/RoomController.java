package com.emkn.backend.controller;

import com.emkn.backend.auth.JWTTokenProvider;
import com.emkn.backend.model.RoomDTO;
import com.emkn.backend.repository.room.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class RoomController {

    private final RoomRepository roomRepository;

    @Autowired
    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
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
}
