package com.example.students.controller;

import com.example.students.dto.*;
import com.example.students.service.ExcelService;
import com.example.students.service.FileStorageService;
import com.example.students.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;

/**
 * REST controller for student marksheet operations.
 */
@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private ExcelService excelService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<StudentResponse> create(@Validated @RequestBody StudentCreateRequest req) {
        StudentResponse resp = studentService.create(req);
        return ResponseEntity.status(201).body(resp);
    }

    @GetMapping
    public PagedResponse<StudentResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "rollNumber") String sort,
            @RequestParam(defaultValue = "asc") String dir,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) Integer minMarks,
            @RequestParam(required = false) Integer maxMarks) {
        return studentService.list(page, size, sort, dir, firstName, lastName, minMarks, maxMarks);
    }

    @PutMapping("/{id}")
    public StudentResponse update(@PathVariable Long id, @Validated @RequestBody StudentUpdateRequest req) {
        return studentService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/bulk/upload")
    public ResponseEntity<BulkUploadResponse> bulkUpload(@RequestParam("file") MultipartFile file) throws IOException {
        BulkUploadResponse resp = excelService.parseAndCreate(file);
        return ResponseEntity.status(201).body(resp);
    }

    @GetMapping("/template")
    public ResponseEntity<byte[]> downloadTemplate() throws IOException {
        byte[] data = excelService.generateTemplate();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Student_Template.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }

    @PostMapping("/{id}/marks/upload")
    public StudentResponse uploadMarks(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        StudentResponse resp = excelService.parseMarksUpload(id, file);
        fileStorageService.saveFile(resp.getRollNumber(), file);
        return resp;
    }

    @GetMapping("/marksheets/{rollNumber}/download")
    public ResponseEntity<Resource> downloadMarks(@PathVariable Long rollNumber, HttpServletRequest request) throws MalformedURLException {
        Path filePath = fileStorageService.resolveStudentFolder(rollNumber);
        Resource resource = new UrlResource(filePath.toUri());
        String contentType = request.getServletContext().getMimeType(resource.getFilename());
        if (contentType == null) contentType = "application/octet-stream";
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + resource.getFilename())
                .body(resource);
    }
}
