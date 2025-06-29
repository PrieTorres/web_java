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

    public void updatePet(String id, Pet pet) throws Exception {
        db.collection("pets").document(id).set(pet, com.google.cloud.firestore.SetOptions.merge());
    }

    public List<Map<String, Object>> filtrarPorLocalizacao(List<Map<String, Object>> pets, double lat, double lng, double raioKm) {
        List<Map<String, Object>> filtrados = new ArrayList<>();
        for (Map<String, Object> pet : pets) {
            Object locObj = pet.get("localizacao");
            if (locObj instanceof Map<?, ?> locMap) {
                Object latObj = locMap.get("latitude");
                Object lngObj = locMap.get("longitude");
                if (latObj instanceof Number latN && lngObj instanceof Number lngN) {
                    double dist = distanciaKm(lat, lng, latN.doubleValue(), lngN.doubleValue());
                    if (dist <= raioKm) {
                        filtrados.add(pet);
                    }
                }
            }
        }
        return filtrados;
    }

    public List<Map<String, Object>> filtrarPorTipo(List<Map<String, Object>> pets, String tipo) {
        List<Map<String, Object>> filtrados = new ArrayList<>();
        for (Map<String, Object> pet : pets) {
            Object t = pet.get("tipo");
            if (t != null && tipo.equalsIgnoreCase(t.toString())) {
                filtrados.add(pet);
            }
        }
        return filtrados;
    }

    public List<Map<String, Object>> filtrarPorTags(List<Map<String, Object>> pets, List<String> tags) {
        List<Map<String, Object>> filtrados = new ArrayList<>();
        for (Map<String, Object> pet : pets) {
            Object tagsObj = pet.get("tags");
            if (tagsObj instanceof List<?> list) {
                for (Object tag : list) {
                    if (tag != null && tags.stream().anyMatch(t -> t.equalsIgnoreCase(tag.toString()))) {
                        filtrados.add(pet);
                        break;
                    }
                }
            }
        }
        return filtrados;
    }

    private double distanciaKm(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371.0; // km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
