package com.example.backend.services;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class TokenService {
    private final Map<String, String> tokenToUser = new ConcurrentHashMap<>();

    public String createSession(String userId) {
        String token = UUID.randomUUID().toString();
        tokenToUser.put(token, userId);
        return token;
    }

    public String getUserId(String token) {
        return tokenToUser.get(token);
    }
}
