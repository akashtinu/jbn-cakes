package com.jbncakes.service;

import com.jbncakes.model.Cake;
import com.jbncakes.repository.CakeRepository;
import com.jbncakes.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class CakeService {

    private final CakeRepository cakeRepository;
    private final OrderItemRepository orderItemRepository;
    private final Path uploadDir = Paths.get("uploads");

    @Autowired
    public CakeService(CakeRepository cakeRepository, OrderItemRepository orderItemRepository) {
        this.cakeRepository = cakeRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public List<Cake> getAllCakes() {
        return cakeRepository.findAll();
    }

    public List<Cake> getAvailableCakes() {
        return cakeRepository.findByAvailableTrue();
    }

    public Cake getCakeById(Long id) {
        return cakeRepository.findById(id).orElseThrow(() -> new RuntimeException("Cake not found"));
    }

    public Cake createCake(Cake cake) {
        return cakeRepository.save(cake);
    }

    public Cake updateCake(Long id, Cake cakeDetails) {
        Cake cake = getCakeById(id);
        cake.setName(cakeDetails.getName());
        cake.setDescription(cakeDetails.getDescription());
        cake.setPrice(cakeDetails.getPrice());
        cake.setCategory(cakeDetails.getCategory());
        cake.setAvailable(cakeDetails.getAvailable());
        if(cakeDetails.getImageUrl() != null) {
            cake.setImageUrl(cakeDetails.getImageUrl());
        }
        return cakeRepository.save(cake);
    }

    @Transactional
    public void deleteCake(Long id) {
        // First delete all order items referencing this cake to avoid foreign key constraint error
        orderItemRepository.deleteByCakeId(id);
        // Now safely delete the cake
        Cake cake = getCakeById(id);
        cakeRepository.delete(cake);
    }

    public String saveImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file.");
        }
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path destinationFile = this.uploadDir.resolve(Paths.get(filename)).normalize().toAbsolutePath();
        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
        return filename;
    }
}
