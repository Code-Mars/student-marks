package com.example.students.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration properties for file storage.
 */
@ConfigurationProperties(prefix = "app.storage")
public class StorageProperties {

    /**
     * Base directory path where files will be stored.
     */
    private String basePath;

    public String getBasePath() {
        return basePath;
    }

    public void setBasePath(String basePath) {
        this.basePath = basePath;
    }
}
