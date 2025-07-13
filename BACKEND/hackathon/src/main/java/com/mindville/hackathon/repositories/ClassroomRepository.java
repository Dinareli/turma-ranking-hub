package com.mindville.hackathon.repositories;

import com.mindville.hackathon.models.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
}