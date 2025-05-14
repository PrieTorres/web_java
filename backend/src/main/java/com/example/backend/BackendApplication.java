package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api")
// public class HelloController {
//     @GetMapping("/hello")
//     public String hello() {
//         return "Olá do Spring Boot!";
//     }
// }

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
