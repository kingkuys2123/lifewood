package com.lifewood.lifewood.util;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileUtil {

    private static final Set<String> ALLOWED_TYPES = Set.of("application/pdf", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    @Value("${app.file.upload-dir:uploads}")
    private String uploadDir;

    public String storeResume(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Resume file is required");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new BadRequestException("Unsupported file type for resume");
        }

        String originalName = file.getOriginalFilename() == null ? "resume" : file.getOriginalFilename();
        String extension = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf('.')) : "";
        String generatedName = UUID.randomUUID() + extension;

        try {
            Path directory = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(directory);
            Path destination = directory.resolve(generatedName);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            return destination.toString();
        } catch (IOException ex) {
            throw new BadRequestException("Failed to store file: " + ex.getMessage());
        }
    }

    public Resource loadResumeResource(String storedPath) {
        if (storedPath == null || storedPath.isBlank()) {
            throw new ResourceNotFoundException("Resume not found");
        }

        Path uploadBase = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path candidate = Paths.get(storedPath).toAbsolutePath().normalize();

        if (!candidate.startsWith(uploadBase)) {
            throw new BadRequestException("Invalid resume path");
        }

        try {
            Resource resource = new UrlResource(candidate.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new ResourceNotFoundException("Resume file is not available");
            }
            return resource;
        } catch (MalformedURLException ex) {
            throw new BadRequestException("Invalid resume file path");
        }
    }

    public String resolveContentType(Path filePath) {
        try {
            return Files.probeContentType(filePath);
        } catch (IOException ex) {
            return null;
        }
    }
}

