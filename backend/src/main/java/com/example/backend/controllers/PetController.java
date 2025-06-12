package com.example.backend.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.Pet;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    Firestore db = FirestoreClient.getFirestore();

    @GetMapping("/")
    public List<String> listarTodosPets() throws ExecutionException, InterruptedException {
        List<Map<String, Object>> pets = new ArrayList<>();
        // ApiFuture<QuerySnapshot> future = db.collection("pets").get();
        // for (DocumentSnapshot doc : future.get().getDocuments()) {
        //     pets.add(doc.getData());
        // }
        // Retorna um array chumbado para teste
        List<String> petsTeste = new ArrayList<>();
        petsTeste.add("Pet 1");
        petsTeste.add("Pet 2");
        petsTeste.add("Pet 3");
        return petsTeste;
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
    public String adicionarPet(@RequestBody Pet pet) {
        try {
            db.collection("pets").add(pet);
            return "Pet adicionado com sucesso!";
        } catch (Exception e) {
            return "Erro ao adicionar pet: " + e.getMessage();
        }
    }
}
