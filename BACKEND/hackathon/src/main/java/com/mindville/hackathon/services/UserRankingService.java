package com.mindville.hackathon.services;

import com.mindville.hackathon.dtos.UserRankingDTO;
import com.mindville.hackathon.models.UserRanking;
import com.mindville.hackathon.repositories.UserRankingRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserRankingService {

    private final UserRankingRepository repository;
    private final ClassroomService classroomService;
    private final UserService userService;

    public UserRankingService(UserRankingRepository repository, ClassroomService classroomService, UserService userService) {
        this.repository = repository;
        this.classroomService = classroomService;
        this.userService = userService;
    }

    public List<UserRankingDTO> getAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public UserRankingDTO getById(Long id) {
        return repository.findById(id).map(this::toDTO).orElse(null);
    }

    public List<UserRankingDTO> getRankingTable(Long classroomId) {
        List<UserRanking> lista = repository.findByClassroomId(classroomId);
        List<UserRankingDTO> dtos = new ArrayList<>();
        for (UserRanking user : lista) {
            UserRankingDTO dto = new UserRankingDTO();
            dto.setId(user.getId());
            dto.setStudentId(user.getStudentId());
            dto.setClassroomId(user.getClassroomId());
            dto.setWeeklyPoints(user.getWeeklyPoints());
            dto.setGeneralPoints(user.getGeneralPoints());
            dto.setStudentName(userService.getUserById(user.getStudentId()).name());
            dtos.add(dto);
        }


        return dtos;

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

    public UserRankingDTO joinClassRoom(Long id, String passWord) {
        System.out.println("******************************" + passWord);
        UserRanking user = new UserRanking();
        user.setClassroomId(classroomService.getByPassword(passWord).getId());
        user.setGeneralPoints(0);
        user.setWeeklyPoints(0);
        user.setStudentId(id);
        return new UserRankingDTO(repository.save(user));
    }
}
