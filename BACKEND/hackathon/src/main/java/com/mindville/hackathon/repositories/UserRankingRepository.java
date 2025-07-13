package com.mindville.hackathon.repositories;

import com.mindville.hackathon.models.UserRanking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRankingRepository extends JpaRepository<UserRanking, Long> {
}