package com.example.students.service;

import com.example.students.config.StorageProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Service for storing files on disk under student-specific folders.
 */
@Service
@Slf4j
public class FileStorageService {

    private final Path basePath;

    public FileStorageService(StorageProperties properties) {
        this.basePath = Paths.get(properties.getBasePath()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.basePath);
            log.info("File storage base directory initialized at {}", basePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create storage directory: " + basePath, ex);
        }
    }

    /**
     * Resolve the directory path for a given student's roll number.
     */
    public Path resolveStudentFolder(Long rollNumber) {
        Path studentDir = basePath.resolve(String.valueOf(rollNumber));
        try {
            Files.createDirectories(studentDir);
            log.debug("Resolved student folder: {}", studentDir);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create student directory: " + studentDir, ex);
        }
        return studentDir;
    }

    /**
     * Save the given file under the student's folder, returning the stored filename.
     */
    public String saveFile(Long rollNumber, MultipartFile file) {
        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (filename.contains("..")) {
                throw new RuntimeException("Invalid file path: " + filename);
            }
            Path targetDir = resolveStudentFolder(rollNumber);
            Path targetFile = targetDir.resolve(filename);
            Files.copy(file.getInputStream(), targetFile);
            log.info("Saved file for roll {}: {} ({} bytes)", rollNumber, targetFile, file.getSize());
            return filename;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file " + filename, ex);
        }
    }
}
