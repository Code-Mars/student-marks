package com.example.students.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/**
 * Entity for storing detailed marksheet of a student.
 */
@Entity
@Table(name = "marksheets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Marksheet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private Student student;

    @Column(nullable = false)
    private Integer english;

    @Column(nullable = false)
    private Integer science;

    @Column(nullable = false)
    private Integer maths;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
