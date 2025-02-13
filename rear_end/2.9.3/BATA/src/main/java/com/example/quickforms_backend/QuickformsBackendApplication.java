package com.example.quickforms_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {
    "com.example.quickforms_backend.doxc.entity",
    "com.example.quickforms_backend.DAO"
})
@EnableJpaRepositories(basePackages = {
    "com.example.quickforms_backend.doxc.repository"
})
public class QuickformsBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuickformsBackendApplication.class, args);
    }

}
