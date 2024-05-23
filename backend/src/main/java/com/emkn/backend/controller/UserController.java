package com.emkn.backend.controller;

import com.emkn.backend.auth.JWTTokenProvider;
import com.emkn.backend.model.UserDTO;
import com.emkn.backend.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/public/register")
    public UserDTO registerUser(@RequestBody UserDTO userDTO) {
        int userId = userRepository.addUser(userDTO);
        userDTO.setId(userId);
        return userDTO;
    }

    @PostMapping("/public/login")
    public Map<String, String> loginUser(@RequestBody UserDTO userDTO, HttpServletResponse response) {
        UserDTO authenticatedUser = userRepository.authenticate(userDTO.getUsername(), userDTO.getPassword());
        if (authenticatedUser != null) {
            String token = JWTTokenProvider.generateToken(authenticatedUser);
            return Collections.singletonMap("token", token);
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return Collections.singletonMap("error", "Invalid password");
        }
    }

    @GetMapping("/private/validate")
    public Map<String, String> validateToken(HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");
        if (token != null && JWTTokenProvider.validateToken(token.substring(7))) {
            int userId = JWTTokenProvider.getUserIDFromToken(token.substring(7));
            UserDTO user = userRepository.getByID(userId);
            return Collections.singletonMap("username", user.getUsername());
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return Collections.singletonMap("error", "Invalid token");
        }
    }

    @GetMapping("/private/users/{id}")
    public UserDTO getUserById(@PathVariable int id, HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");
        if (token != null && JWTTokenProvider.validateToken(token.substring(7))) {
            return userRepository.getByID(id);
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
    }

    @DeleteMapping("/private/users/{id}")
    public boolean deleteUserById(@PathVariable int id, HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");
        if (token != null && JWTTokenProvider.validateToken(token.substring(7))) {
            return userRepository.deleteByID(id);
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }
    }
}
