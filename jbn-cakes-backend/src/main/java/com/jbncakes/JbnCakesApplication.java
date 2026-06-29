package com.jbncakes;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication
public class JbnCakesApplication {

    public static void main(String[] args) {
        SpringApplication.run(JbnCakesApplication.class, args);
    }

    @Bean
    CommandLineRunner init() {
        return args -> {
            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
                System.out.println("Created uploads directory");
            }
        };
    }
}
