package com.example.students.service;

import com.example.students.dto.BulkUploadResponse;
import com.example.students.dto.BulkUploadResponse.RowError;
import com.example.students.dto.StudentCreateRequest;
import com.example.students.dto.StudentResponse;
import com.example.students.model.Student;
import com.example.students.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Service for generating and parsing Excel templates for Student entities.
 */
@Service
@Slf4j
public class ExcelService {

    private static final String SHEET_NAME = "Template";

    private final StudentService studentService;

    public ExcelService(StudentService studentService) {
        this.studentService = studentService;
    }

    /**
     * Generate an Excel template with headers.
     */
    public byte[] generateTemplate() throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet(SHEET_NAME);
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("FirstName");
            header.createCell(1).setCellValue("LastName");
            header.createCell(2).setCellValue("Marks");
            wb.write(out);
            return out.toByteArray();
        }
    }

    /**
     * Parse bulk-upload Excel file and create students.
     */
    public BulkUploadResponse parseAndCreate(MultipartFile file) throws IOException {
        BulkUploadResponse resp = new BulkUploadResponse();
        List<RowError> errors = new ArrayList<>();
        int added = 0;
        try (InputStream in = file.getInputStream(); Workbook wb = new XSSFWorkbook(in)) {
            Sheet sheet = wb.getSheet(SHEET_NAME);
            if (sheet == null) {
                log.error("Sheet {} not found in uploaded file", SHEET_NAME);
                throw new IllegalArgumentException("Sheet " + SHEET_NAME + " not found");
            }
            Iterator<Row> rows = sheet.rowIterator();
            if (rows.hasNext()) rows.next(); // skip header
            int rowNum = 1;
            while (rows.hasNext()) {
                rowNum++;
                Row row = rows.next();
                try {
                    String fn = row.getCell(0).getStringCellValue();
                    String ln = row.getCell(1).getStringCellValue();
                    int marks = (int) row.getCell(2).getNumericCellValue();
                    StudentCreateRequest req = new StudentCreateRequest();
                    req.setFirstName(fn);
                    req.setLastName(ln);
                    req.setMarks(marks);
                    StudentResponse created = studentService.create(req);
                    added++;
                } catch (Exception ex) {
                    log.error("Failed to parse row {}: {}", rowNum, ex.getMessage());
                    errors.add(new RowError(rowNum, ex.getMessage()));
                }
            }
        }
        resp.setAdded(added);
        resp.setFailed(errors.size());
        resp.setErrors(errors);
        return resp;
    }

    /**
     * Parse single-row upload of marks and return updated StudentResponse.
     */
    public StudentResponse parseMarksUpload(Long id, MultipartFile file) throws IOException {
        try (InputStream in = file.getInputStream(); Workbook wb = new XSSFWorkbook(in)) {
            Sheet sheet = wb.getSheet(SHEET_NAME);
            if (sheet == null) {
                throw new IllegalArgumentException("Sheet " + SHEET_NAME + " not found");
            }
            Row row = sheet.getRow(1);
            if (row == null) throw new IllegalArgumentException("No data row found");
            int marks = (int) row.getCell(2).getNumericCellValue();
            return studentService.update(id, createUpdateRequest(marks, id));
        }
    }

    private com.example.students.dto.StudentUpdateRequest createUpdateRequest(int marks, Long id) {
        // fetch existing to preserve names
        StudentResponse existing = studentService.list(0, 1, "rollNumber", "asc", null, null, null, null)
                .getContent().stream().filter(s -> s.getId().equals(id)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Student not found for marks upload"));
        com.example.students.dto.StudentUpdateRequest req = new com.example.students.dto.StudentUpdateRequest();
        req.setFirstName(existing.getFirstName());
        req.setLastName(existing.getLastName());
        req.setMarks(marks);
        return req;
    }
}
