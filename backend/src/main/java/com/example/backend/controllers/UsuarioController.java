package com.example.backend.controllers;

import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    Firestore db = FirestoreClient.getFirestore();

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
    public ResponseEntity<String> addData(@RequestBody Map<String, Object> data) {
        try {
            if (data.containsKey("senha")) {
                String senhaPlana = (String) data.get("senha");
                String senhaHash = BCrypt.hashpw(senhaPlana, BCrypt.gensalt());
                data.put("senha", senhaHash);
            }
            db.collection("usuarios").add(data);
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuário cadastrado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, Object> loginData) throws ExecutionException, InterruptedException {
        String email = (String) loginData.get("email");
        String senha = (String) loginData.get("senha");

        if (email == null || senha == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email e senha são obrigatórios.");
        }

        ApiFuture<QuerySnapshot> future = db.collection("usuarios")
                .whereEqualTo("email", email).limit(1).get();
        QuerySnapshot snapshot;
        snapshot = future.get();

        if (snapshot.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado.");
        }

        DocumentSnapshot userDoc = snapshot.getDocuments().get(0);
        Map<String, Object> userData = userDoc.getData();

        if (userData == null || !userData.containsKey("senha")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno: senha não encontrada.");
        }

        String senhaHash = (String) userData.get("senha");

        if (!BCrypt.checkpw(senha, senhaHash)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta.");
        }

        return ResponseEntity.ok("Login bem-sucedido.");
    }
}
