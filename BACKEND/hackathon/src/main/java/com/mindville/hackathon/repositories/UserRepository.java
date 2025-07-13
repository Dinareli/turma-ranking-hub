package com.mindville.hackathon.repositories;

import com.mindville.hackathon.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserModel, Long> {
    boolean existsByEmail(String email);
}
