package com.mindville.hackathon.dtos;

public class UserRankingDTO {
    private Long id;
    private Long studentId;
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
}