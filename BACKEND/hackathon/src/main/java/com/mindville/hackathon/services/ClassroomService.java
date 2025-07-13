package com.mindville.hackathon.services;

import com.mindville.hackathon.dtos.ClassroomDTO;
import com.mindville.hackathon.models.Classroom;
import com.mindville.hackathon.repositories.ClassroomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClassroomService {

    private final ClassroomRepository repository;

    public ClassroomService(ClassroomRepository repository) {
        this.repository = repository;
    }

    public List<ClassroomDTO> getAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ClassroomDTO getById(Long id) {
        return repository.findById(id).map(this::toDTO).orElse(null);
    }

    public ClassroomDTO create(ClassroomDTO dto) {
        Classroom classroom = toEntity(dto);
        return toDTO(repository.save(classroom));
    }

    public ClassroomDTO update(Long id, ClassroomDTO dto) {
        return repository.findById(id).map(existing -> {
            existing.setName(dto.getName());
            existing.setPassword(dto.getPassword());
            existing.setTeacherId(dto.getTeacherId());
            return toDTO(repository.save(existing));
        }).orElse(null);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private ClassroomDTO toDTO(Classroom classroom) {
        ClassroomDTO dto = new ClassroomDTO();
        dto.setId(classroom.getId());
        dto.setName(classroom.getName());
        dto.setPassword(classroom.getPassword());
        dto.setTeacherId(classroom.getTeacherId());
        return dto;
    }

    private Classroom toEntity(ClassroomDTO dto) {
        Classroom classroom = new Classroom();
        classroom.setId(dto.getId());
        classroom.setName(dto.getName());
        classroom.setPassword(dto.getPassword());
        classroom.setTeacherId(dto.getTeacherId());
        return classroom;
    }

    public Classroom getByPassword (String password) {
        return repository.findByPassword(password);
    }
}