package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class ConnectionController {
    @GetMapping("/api/hello")
    public Map<String, String> hello() {

        // SpringBoot converts this to JSON
        return Map.of(
                "testMessage", "Yes it is!"
        );
    }
}
