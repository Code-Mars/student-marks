package com.example.students.repository;

import com.example.students.model.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Student entity.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByRollNumber(Long rollNumber);

    @Query("SELECT COALESCE(MAX(s.rollNumber), 0) FROM Student s")
    Long findMaxRollNumber();

    // Filtering by firstName, lastName, marks range
    @Query("SELECT s FROM Student s WHERE " +
            "(:firstName IS NULL OR LOWER(s.firstName) LIKE LOWER(CONCAT('%', :firstName, '%'))) AND " +
            "(:lastName IS NULL OR LOWER(s.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))) AND " +
            "(:minMarks IS NULL OR s.marks >= :minMarks) AND " +
            "(:maxMarks IS NULL OR s.marks <= :maxMarks)")
    Page<Student> filter(
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("minMarks") Integer minMarks,
            @Param("maxMarks") Integer maxMarks,
            Pageable pageable);
}
