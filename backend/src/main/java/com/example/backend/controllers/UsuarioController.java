package com.example.backend.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.ApiError;
import com.example.backend.services.TokenService;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    Firestore db = FirestoreClient.getFirestore();
    @Autowired
    private TokenService tokenService;

    @PostMapping("/{userId}")
    public String salvarOuAtualizarUsuario(@PathVariable String userId, @RequestBody Map<String, Object> usuario) {
        try {
            db.collection("usuarios").document(userId).set(usuario);
            return "Usuário salvo/atualizado com sucesso!";
        } catch (Exception e) {
            return "Erro ao salvar usuário: " + e.getMessage();
        }
    }

    @GetMapping("/{userId}")
    public Map<String, Object> obterUsuario(@PathVariable String userId) throws ExecutionException, InterruptedException {
        DocumentSnapshot snapshot = db.collection("usuarios").document(userId).get().get();
        if (snapshot.exists()) {
            return snapshot.getData();
        } else {
            throw new RuntimeException("Usuário não encontrado");
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addData(@RequestBody Map<String, Object> data) {
        try {
            String email = (String) data.get("email");
            if (email != null) {
                ApiFuture<QuerySnapshot> future = db.collection("usuarios")
                        .whereEqualTo("email", email).limit(1).get();
                if (!future.get().isEmpty()) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("Email já cadastrado.");
                }
            }
            
            Object senha = data.get("senha");
            if (email == null || senha == null
                    || email.toString().isBlank() || senha.toString().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiError("Email e senha são obrigatórios."));
            }

            String senhaPlana = senha.toString();
            String senhaHash = BCrypt.hashpw(senhaPlana, BCrypt.gensalt());
            data.put("senha", senhaHash);

            db.collection("usuarios").add(data);
            Map<String, String> resp = new HashMap<>();
            resp.put("message", "Usuário cadastrado com sucesso!");
            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiError("Erro: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> loginData) throws ExecutionException, InterruptedException {
        String email = (String) loginData.get("email");
        String senha = (String) loginData.get("senha");

        if (email == null || senha == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiError("Email e senha são obrigatórios."));
        }

        ApiFuture<QuerySnapshot> future = db.collection("usuarios")
                .whereEqualTo("email", email).limit(1).get();
        QuerySnapshot snapshot;
        snapshot = future.get();

        if (snapshot.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Usuário não encontrado."));
        }

        DocumentSnapshot userDoc = snapshot.getDocuments().get(0);
        Map<String, Object> userData = userDoc.getData();

        if (userData == null || !userData.containsKey("senha")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiError("Erro interno: senha não encontrada."));
        }

        String senhaHash = (String) userData.get("senha");

        if (!BCrypt.checkpw(senha, senhaHash)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiError("Senha incorreta."));
        }

        String token = tokenService.createSession(userDoc.getId());
        Map<String, String> resp = new HashMap<>();
        resp.put("token", token);
        resp.put("userId", userDoc.getId());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/firebase/{uid}")
    public ResponseEntity<?> getUserByFirebaseId(@PathVariable String uid)
            throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = db.collection("usuarios")
                .whereEqualTo("firebaseUserId", uid).limit(1).get();
        QuerySnapshot snapshot = future.get();

        if (snapshot.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError("Usuário não encontrado"));
        }

        DocumentSnapshot doc = snapshot.getDocuments().get(0);
        Map<String, Object> data = doc.getData();
        if (data == null) {
            data = new HashMap<>();
        }
        data.put("id", doc.getId());
        String token = tokenService.createSession(doc.getId());
        data.put("token", token);
        return ResponseEntity.ok(data);
    }

    @PostMapping("/firebase/{uid}")
    public ResponseEntity<Map<String, Object>> createUserWithFirebaseId(@PathVariable String uid,
            @RequestBody(required = false) Map<String, Object> userData) throws ExecutionException, InterruptedException {

        ApiFuture<QuerySnapshot> future = db.collection("usuarios")
                .whereEqualTo("firebaseUserId", uid).limit(1).get();
        QuerySnapshot snapshot = future.get();
        if (!snapshot.isEmpty()) {
            DocumentSnapshot doc = snapshot.getDocuments().get(0);
            Map<String, Object> existingData = doc.getData();
            if (existingData == null) {
                existingData = new HashMap<>();
            }
            existingData.put("id", doc.getId());
            String token = tokenService.createSession(doc.getId());
            existingData.put("token", token);
            return ResponseEntity.ok(existingData);
        }

        if (userData == null) {
            userData = new HashMap<>();
        }
        userData.put("firebaseUserId", uid);
        DocumentReference newDoc = db.collection("usuarios").document();
        newDoc.set(userData);
        userData.put("id", newDoc.getId());
        String token = tokenService.createSession(newDoc.getId());
        userData.put("token", token);
        return ResponseEntity.status(HttpStatus.CREATED).body(userData);
    }
}
