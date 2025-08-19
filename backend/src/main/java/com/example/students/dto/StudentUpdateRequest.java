package com.example.students.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for updating an existing student.
 */
public class StudentUpdateRequest {

    @NotBlank(message = "firstName must not be blank")
    @Size(min = 2, max = 50, message = "firstName must be between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "lastName must not be blank")
    @Size(min = 2, max = 50, message = "lastName must be between 2 and 50 characters")
    private String lastName;

    @Min(value = 0, message = "marks must be at least 0")
    @Max(value = 100, message = "marks must be at most 100")
    private Integer marks;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Integer getMarks() {
        return marks;
    }

    public void setMarks(Integer marks) {
        this.marks = marks;
    }
}
