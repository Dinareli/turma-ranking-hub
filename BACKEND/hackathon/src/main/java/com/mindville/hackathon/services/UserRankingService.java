package com.mindville.hackathon.services;

import com.mindville.hackathon.dtos.UserRankingDTO;
import com.mindville.hackathon.models.UserRanking;
import com.mindville.hackathon.repositories.UserRankingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserRankingService {

    private final UserRankingRepository repository;

    public UserRankingService(UserRankingRepository repository) {
        this.repository = repository;
    }

    public List<UserRankingDTO> getAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public UserRankingDTO getById(Long id) {
        return repository.findById(id).map(this::toDTO).orElse(null);
    }

    public UserRankingDTO create(UserRankingDTO dto) {
        UserRanking entity = toEntity(dto);
        return toDTO(repository.save(entity));
    }

    public UserRankingDTO update(Long id, UserRankingDTO dto) {
        return repository.findById(id).map(existing -> {
            existing.setStudentId(dto.getStudentId());
            existing.setClassroomId(dto.getClassroomId());
            existing.setWeeklyPoints(dto.getWeeklyPoints());
            existing.setGeneralPoints(dto.getGeneralPoints());
            return toDTO(repository.save(existing));
        }).orElse(null);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private UserRankingDTO toDTO(UserRanking entity) {
        UserRankingDTO dto = new UserRankingDTO();
        dto.setId(entity.getId());
        dto.setStudentId(entity.getStudentId());
        dto.setClassroomId(entity.getClassroomId());
        dto.setWeeklyPoints(entity.getWeeklyPoints());
        dto.setGeneralPoints(entity.getGeneralPoints());
        return dto;
    }

    private UserRanking toEntity(UserRankingDTO dto) {
        UserRanking entity = new UserRanking();
        entity.setId(dto.getId());
        entity.setStudentId(dto.getStudentId());
        entity.setClassroomId(dto.getClassroomId());
        entity.setWeeklyPoints(dto.getWeeklyPoints());
        entity.setGeneralPoints(dto.getGeneralPoints());
        return entity;
    }

    public UserRanking incrementWeeklyPoints(Long id) {
        UserRanking userRanking = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("UserRanking not found"));

        int currentPoints = userRanking.getWeeklyPoints() != null ? userRanking.getWeeklyPoints() : 0;
        userRanking.setWeeklyPoints(currentPoints + 1);

        return repository.save(userRanking);
    }
}
