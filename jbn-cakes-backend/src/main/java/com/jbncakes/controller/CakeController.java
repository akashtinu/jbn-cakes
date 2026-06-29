package com.jbncakes.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jbncakes.model.Cake;
import com.jbncakes.service.CakeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/cakes")
public class CakeController {

    private final CakeService cakeService;

    @Autowired
    public CakeController(CakeService cakeService) {
        this.cakeService = cakeService;
    }

    @GetMapping
    public ResponseEntity<List<Cake>> getAllCakes(@RequestParam(required = false) Boolean available) {
        if (available != null && available) {
            return ResponseEntity.ok(cakeService.getAvailableCakes());
        }
        return ResponseEntity.ok(cakeService.getAllCakes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cake> getCakeById(@PathVariable Long id) {
        return ResponseEntity.ok(cakeService.getCakeById(id));
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Cake> createCake(
            @RequestPart("cake") String cakeStr,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Cake cake = mapper.readValue(cakeStr, Cake.class);
            if (image != null && !image.isEmpty()) {
                String filename = cakeService.saveImage(image);
                cake.setImageUrl(filename);
            }
            return new ResponseEntity<>(cakeService.createCake(cake), HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Cake> updateCake(
            @PathVariable Long id,
            @RequestPart("cake") String cakeStr,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Cake cakeDetails = mapper.readValue(cakeStr, Cake.class);
            if (image != null && !image.isEmpty()) {
                String filename = cakeService.saveImage(image);
                cakeDetails.setImageUrl(filename);
            }
            return ResponseEntity.ok(cakeService.updateCake(id, cakeDetails));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCake(@PathVariable Long id) {
        cakeService.deleteCake(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<String> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            String filename = cakeService.saveImage(file);
            Cake cake = cakeService.getCakeById(id);
            cake.setImageUrl(filename);
            cakeService.updateCake(id, cake);
            return ResponseEntity.ok(filename);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path file = Paths.get("uploads").resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
