package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class ConnectionController {
    @GetMapping("/api/hello")
    public Map<String, String> hello() {
        return Map.of(
                "testMessage", "Yes it is!"
        );
    }
}
