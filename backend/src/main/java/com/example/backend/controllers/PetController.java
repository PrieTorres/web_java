package com.example.backend.controllers;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.ApiError;
import com.example.backend.models.Pet;
import com.example.backend.services.PetService;
import com.example.backend.services.TokenService;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PetService petService;

    @GetMapping("")
    public ResponseEntity<List<Map<String, Object>>> listarTodosPets() throws ExecutionException, InterruptedException {
        List<Map<String, Object>> pets = petService.findAll();
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obterPetPorId(@PathVariable String id) throws ExecutionException, InterruptedException {
        Map<String, Object> pet = petService.findById(id);
        if (pet == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError("Pet não encontrado"));
        }
        return ResponseEntity.ok(pet);
    }

    @GetMapping("/usuario/{userId}")
    public ResponseEntity<List<Map<String, Object>>> listarPetsDoUsuario(@PathVariable String userId) throws ExecutionException, InterruptedException {
        List<Map<String, Object>> pets = petService.findByUserId(userId);
        return ResponseEntity.ok(pets);
    }

    @PostMapping
    public ResponseEntity<?> adicionarPet(@RequestBody Pet pet,
            @RequestHeader("Authorization") String token) {
        if (pet.getNome() == null || pet.getNome().isBlank() || pet.getLocalizacao() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiError("Nome e localização são obrigatórios."));
        }
        String userId = tokenService.getUserId(token);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiError("Token inválido"));
        }
        try {
            pet.setUserId(userId);
            String id = petService.addPet(pet);
            Map<String, Object> resp = Map.of(
                    "message", "Pet adicionado com sucesso!",
                    "id", id);
            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiError("Erro ao adicionar pet: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> listarPetsDoUsuarioToken(@RequestHeader("Authorization") String token)
            throws ExecutionException, InterruptedException {
        String userId = tokenService.getUserId(token);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiError("Token inválido"));
        }
        List<Map<String, Object>> pets = petService.findByUserId(userId);
        return ResponseEntity.ok(pets);
    }
}
