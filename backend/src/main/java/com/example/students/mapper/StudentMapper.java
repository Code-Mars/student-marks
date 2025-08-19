package com.example.students.mapper;

import com.example.students.dto.StudentCreateRequest;
import com.example.students.dto.StudentResponse;
import com.example.students.dto.StudentUpdateRequest;
import com.example.students.model.Student;

/**
 * Utility for mapping between Student entity and DTOs.
 */
public class StudentMapper {

    public static StudentResponse toResponse(Student student) {
        StudentResponse resp = new StudentResponse();
        resp.setId(student.getId());
        resp.setRollNumber(student.getRollNumber());
        resp.setFirstName(student.getFirstName());
        resp.setLastName(student.getLastName());
        resp.setMarks(student.getMarks());
        resp.setCreatedAt(student.getCreatedAt());
        resp.setUpdatedAt(student.getUpdatedAt());
        return resp;
    }

    public static Student toEntity(StudentCreateRequest req, Long rollNumber) {
        Student student = new Student();
        student.setRollNumber(rollNumber);
        student.setFirstName(req.getFirstName());
        student.setLastName(req.getLastName());
        student.setMarks(req.getMarks());
        return student;
    }

    public static void updateEntity(Student student, StudentUpdateRequest req) {
        student.setFirstName(req.getFirstName());
        student.setLastName(req.getLastName());
        student.setMarks(req.getMarks());
    }
}
