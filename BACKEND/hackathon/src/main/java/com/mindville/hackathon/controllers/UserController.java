package com.mindville.hackathon.controllers;

import com.mindville.hackathon.dtos.UserDTO;
import com.mindville.hackathon.dtos.UserLoginDTO;
import com.mindville.hackathon.models.UserModel;
import com.mindville.hackathon.repositories.UserRankingRepository;
import com.mindville.hackathon.services.UserRankingService;
import com.mindville.hackathon.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "chrome-extension://ponmklobmponmoimengmopfjbmcjnegd",
})
public class UserController {

    @Autowired
    private UserService userService;
    
    private UserRankingService userRankingRepository;

    UserController(UserRankingService userRankingRepository) {
        this.userRankingRepository = userRankingRepository;
    }

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public UserDTO createUser(@RequestBody UserModel user) {
        UserDTO use = userService.createUser(user);
        System.out.println("******************************" + use.id());
        userRankingRepository.joinClassRoom(use.id(), user.getClassCode());
        return use;
    }

    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable Long id, @RequestBody UserModel user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDTO userDto) {
        try {
            UserDTO user = userService.login(userDto);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
