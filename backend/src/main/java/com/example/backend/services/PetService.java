package com.example.backend.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.example.backend.models.Pet;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;

@Service
public class PetService {
    private final Firestore db = FirestoreClient.getFirestore();

    public List<Map<String, Object>> findAll() throws ExecutionException, InterruptedException {
        List<Map<String, Object>> pets = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = db.collection("pets").get();
        for (DocumentSnapshot doc : future.get().getDocuments()) {
            Map<String, Object> data = doc.getData();
            if (data != null) {
                data.put("id", doc.getId());
                pets.add(data);
            }
        }
        return pets;
    }

    public List<Map<String, Object>> findByUserId(String userId) throws ExecutionException, InterruptedException {
        List<Map<String, Object>> pets = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = db.collection("pets").whereEqualTo("userId", userId).get();
        for (DocumentSnapshot doc : future.get().getDocuments()) {
            Map<String, Object> data = doc.getData();
            if (data != null) {
                data.put("id", doc.getId());
                pets.add(data);
            }
        }
        return pets;
    }

    public String addPet(Pet pet) throws Exception {
        CollectionReference col = db.collection("pets");
        DocumentReference ref = col.document();
        ref.set(pet);
        return ref.getId();
    }

    public Map<String, Object> findById(String id) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = db.collection("pets").document(id).get().get();
        if (!doc.exists()) {
            return null;
        }
        Map<String, Object> data = doc.getData();
        if (data == null) {
            return null;
        }
        data.put("id", doc.getId());
        return data;
    }
}
