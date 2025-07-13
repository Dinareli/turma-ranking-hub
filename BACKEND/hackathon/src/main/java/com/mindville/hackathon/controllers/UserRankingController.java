package com.mindville.hackathon.controllers;

import com.mindville.hackathon.dtos.UserRankingDTO;
import com.mindville.hackathon.models.UserRanking;
import com.mindville.hackathon.services.UserRankingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/user-rankings")
@CrossOrigin(origins = "http://localhost:3000")
public class UserRankingController {

    private final UserRankingService service;

    public UserRankingController(UserRankingService service) {
        this.service = service;
    }

    @GetMapping
    public List<UserRankingDTO> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserRankingDTO> getById(@PathVariable Long id) {
        UserRankingDTO dto = service.getById(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @GetMapping("/{classroomId}")
    public ResponseEntity<List<UserRankingDTO>> getRankingTable(@PathVariable Long id) {
        List<UserRankingDTO> dtos = service.getRankingTable(id);
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<UserRankingDTO> create(@RequestBody UserRankingDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserRankingDTO> update(@PathVariable Long id, @RequestBody UserRankingDTO dto) {
        UserRankingDTO updated = service.update(id, dto);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/add-point")
    public ResponseEntity<UserRanking> addWeeklyPoint(@PathVariable Long id) {
        UserRanking updated = service.incrementWeeklyPoints(id);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/{passWord}")
    public ResponseEntity<UserRankingDTO> joinClassRoom(@PathVariable Long id, @PathVariable String passWord) {
        UserRankingDTO updated = service.joinClassRoom(id, passWord);
        
        return ResponseEntity.ok(updated);
    }
    
}