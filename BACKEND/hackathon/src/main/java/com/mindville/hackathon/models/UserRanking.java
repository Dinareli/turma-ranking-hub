package com.mindville.hackathon.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_rankings")
public class UserRanking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    private Long classroomId;

    private Integer weeklyPoints;

    private Integer generalPoints;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getClassroomId() {
        return classroomId;
    }

    public void setClassroomId(Long classroomId) {
        this.classroomId = classroomId;
    }

    public Integer getWeeklyPoints() {
        return weeklyPoints;
    }

    public void setWeeklyPoints(Integer weeklyPoints) {
        this.weeklyPoints = weeklyPoints;
    }

    public Integer getGeneralPoints() {
        return generalPoints;
    }

    public void setGeneralPoints(Integer generalPoints) {
        this.generalPoints = generalPoints;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}