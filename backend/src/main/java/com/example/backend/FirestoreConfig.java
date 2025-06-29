package com.example.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;

@Configuration
public class FirestoreConfig {
    @Bean
    public Firestore firestore() {
        return FirestoreClient.getFirestore();
    }
}
