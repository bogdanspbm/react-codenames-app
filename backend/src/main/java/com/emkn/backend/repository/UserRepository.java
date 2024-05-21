package com.emkn.backend.repository;

import com.emkn.backend.model.UserDTO;

import java.util.List;

public interface UserRepository {
    List<UserDTO> getAll();

    UserDTO getByID(int id);

    int addUser(UserDTO userDTO);

    boolean deleteByID(int id);

    UserDTO authenticate(String username, String password);
}


