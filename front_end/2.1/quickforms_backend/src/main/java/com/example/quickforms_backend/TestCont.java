package com.example.quickforms_backend;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TestCont {
    @GetMapping("/test")
    public List<String> test() {
        return List.of("Hello World!");
    }
}
