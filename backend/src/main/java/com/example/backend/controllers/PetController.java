package com.example.backend.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.backend.models.Pet;
import com.example.backend.services.TokenService;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    Firestore db = FirestoreClient.getFirestore();
    @Autowired
    private TokenService tokenService;

    @GetMapping("")
    public List<Map<String, Object>> listarTodosPets() throws ExecutionException, InterruptedException {
        List<Map<String, Object>> pets = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = db.collection("pets").get();
        for (DocumentSnapshot doc : future.get().getDocuments()) {
            pets.add(doc.getData());
        }
        return pets;
    }

    @GetMapping("/usuario/{userId}")
    public List<Map<String, Object>> listarPetsDoUsuario(@PathVariable String userId) throws ExecutionException, InterruptedException {
        List<Map<String, Object>> pets = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = db.collection("pets")
            .whereEqualTo("userId", userId)
            .get();
        for (DocumentSnapshot doc : future.get().getDocuments()) {
            pets.add(doc.getData());
        }
        return pets;
    }

    @PostMapping("/add")
    public ResponseEntity<String> adicionarPet(@RequestBody Pet pet,
            @RequestHeader("Authorization") String token) {
        String userId = tokenService.getUserId(token);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido");
        }
        try {
            pet.setUserId(userId);
            db.collection("pets").add(pet);
            return ResponseEntity.status(HttpStatus.CREATED).body("Pet adicionado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao adicionar pet: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<List<Map<String, Object>>> listarPetsDoUsuarioToken(@RequestHeader("Authorization") String token)
            throws ExecutionException, InterruptedException {
        String userId = tokenService.getUserId(token);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        List<Map<String, Object>> pets = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = db.collection("pets")
                .whereEqualTo("userId", userId)
                .get();
        for (DocumentSnapshot doc : future.get().getDocuments()) {
            pets.add(doc.getData());
        }
        return ResponseEntity.ok(pets);
    }
}
