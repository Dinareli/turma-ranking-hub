package com.mindville.hackathon.repositories;

import com.mindville.hackathon.dtos.UserRankingDTO;
import com.mindville.hackathon.models.UserRanking;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRankingRepository extends JpaRepository<UserRanking, Long> {
    //@Query("SELECT u,users.name FROM user_rankings u LEFT JOIN users on u.student_id = users.id WHERE u.classroom_id = ?1 ORDER BY u.general_points DESC")
    List<UserRanking> findByClassroomId(Long classroomId);
}