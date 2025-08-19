package com.example.students.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/**
 * Entity representing a student marksheet record.
 */
@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    /**
     * Primary key.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Sequential roll number assigned to student.
     */
    @Column(name = "roll_number", unique = true, nullable = false)
    private Long rollNumber;

    /**
     * First name of student.
     */
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    /**
     * Last name of student.
     */
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    /**
     * Marks obtained (0-100).
     */
    @Column(nullable = false)
    private Integer marks = 0;

    /**
     * Record creation timestamp.
     */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    /**
     * Record update timestamp.
     */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
