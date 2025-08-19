package com.example.students.service;

import com.example.students.dto.*;
import com.example.students.exception.ResourceNotFoundException;
import com.example.students.mapper.StudentMapper;
import com.example.students.model.Student;
import com.example.students.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Business logic for Student operations.
 */
@Service
public class StudentService {

    @Autowired
    private StudentRepository repo;
    @Autowired
    private com.example.students.repository.MarksheetRepository marksheetRepository;

    private Long nextRollNumber() {
        return repo.findMaxRollNumber() + 1;
    }

    /**
     * Create a new student.
     */
    @Transactional
    public StudentResponse create(StudentCreateRequest req) {
        Long roll = nextRollNumber();
        Student student = StudentMapper.toEntity(req, roll);
        Student saved = repo.save(student);
        return StudentMapper.toResponse(saved);
    }

    /**
     * Get paged list with optional filters.
     */
    public PagedResponse<StudentResponse> list(int page, int size, String sortBy, String sortDir,
            String firstName, String lastName,
            Integer minMarks, Integer maxMarks) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Student> pg = repo.filter(firstName, lastName, minMarks, maxMarks, pageable);
        List<StudentResponse> content = pg.getContent().stream()
                .map(StudentMapper::toResponse)
                .collect(Collectors.toList());
        // set hasMarksheet flag for each student
        content.forEach(sr -> sr.setHasMarksheet(marksheetRepository.existsByStudentId(sr.getId())));
        PagedResponse<StudentResponse> response = new PagedResponse<>();
        response.setContent(content);
        response.setPage(pg.getNumber());
        response.setSize(pg.getSize());
        response.setTotalElements(pg.getTotalElements());
        response.setTotalPages(pg.getTotalPages());
        return response;
    }

    /**
     * Update student inline.
     */
    @Transactional
    public StudentResponse update(Long id, StudentUpdateRequest req) {
        Student student = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        StudentMapper.updateEntity(student, req);
        Student updated = repo.save(student);
        return StudentMapper.toResponse(updated);
    }

    /**
     * Expose entity for internal use (e.g., marksheet creation).
     */
    public Student findEntity(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
    }

    /**
     * Delete a student.
     */
    @Transactional
    public void delete(Long id) {
        Student student = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        repo.delete(student);
    }
}
