package com.example.students.repository;

import com.example.students.model.Marksheet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MarksheetRepository extends JpaRepository<Marksheet, Long> {
    Optional<Marksheet> findByStudentId(Long studentId);

    boolean existsByStudentId(Long studentId);
}
