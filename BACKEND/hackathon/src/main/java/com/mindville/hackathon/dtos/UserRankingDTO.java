package com.mindville.hackathon.dtos;

import org.springframework.boot.autoconfigure.security.SecurityProperties.User;

import com.mindville.hackathon.models.UserRanking;

public class UserRankingDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long classroomId;
    private Integer weeklyPoints;
    private Integer generalPoints;

    
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

    public UserRankingDTO(UserRanking userRanking) {
        this.id = userRanking.getId();
        this.studentId = userRanking.getStudentId();
        this.classroomId = userRanking.getClassroomId();
        this.weeklyPoints = userRanking.getWeeklyPoints();
        this.generalPoints = userRanking.getGeneralPoints();
    }

    public UserRankingDTO() {
        // Default constructor
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
}