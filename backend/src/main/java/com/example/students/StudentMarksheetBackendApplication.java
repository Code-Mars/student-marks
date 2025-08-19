package com.example.students;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.example.students.config.StorageProperties;

/**
 * Entry point for the Student Marksheet Backend application.
 */
@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class StudentMarksheetBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudentMarksheetBackendApplication.class, args);
    }
}
