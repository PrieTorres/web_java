package com.example.backend.controllers;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.backend.models.Pet;
import com.example.backend.services.PetService;
import com.example.backend.services.TokenService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(PetController.class)
class PetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PetService petService;

    @MockBean
    private TokenService tokenService;

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void testListarTodosPets() throws Exception {
        Map<String, Object> pet = new HashMap<>();
        pet.put("nome", "Fido");
        List<Map<String, Object>> pets = Arrays.asList(pet);
        when(petService.findAll()).thenReturn(pets);

        mockMvc.perform(get("/api/pets"))
                .andExpect(status().isOk())
                .andExpect(content().json(mapper.writeValueAsString(pets)));
    }

    @Test
    void testAdicionarPetUnauthorized() throws Exception {
        Pet pet = new Pet();
        when(tokenService.getUserId("bad")).thenReturn(null);

        mockMvc.perform(post("/api/pets")
                .header("Authorization", "bad")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(pet)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().json("{\"message\":\"Token inválido\"}"));
    }

    @Test
    void testAdicionarPetSuccess() throws Exception {
        Pet pet = new Pet();
        pet.setNome("Rex");
        pet.setLocalizacao(new com.example.backend.models.Localizacao());
        when(tokenService.getUserId("good")).thenReturn("uid1");
        when(petService.addPet(pet)).thenReturn("pid1");

        mockMvc.perform(post("/api/pets")
                .header("Authorization", "good")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(pet)))
                .andExpect(status().isCreated())
                .andExpect(content().json("{\"message\":\"Pet adicionado com sucesso!\",\"id\":\"pid1\"}"));
    }

    @Test
    void testAdicionarPetMissingFields() throws Exception {
        Pet pet = new Pet();
        when(tokenService.getUserId("good")).thenReturn("uid1");

        mockMvc.perform(post("/api/pets")
                .header("Authorization", "good")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(pet)))
                .andExpect(status().isBadRequest())
                .andExpect(content().json("{\"message\":\"Nome, tipo do animal, localização, latitude e longitude são obrigatórios.\"}"));
    }

    @Test
    void testObterPetNotFound() throws Exception {
        when(petService.findById("x")).thenReturn(null);

        mockMvc.perform(get("/api/pets/x"))
                .andExpect(status().isNotFound())
                .andExpect(content().json("{\"message\":\"Pet não encontrado\"}"));
    }

    @Test
    void testObterPetSuccess() throws Exception {
        Map<String, Object> pet = new HashMap<>();
        pet.put("id", "1");
        when(petService.findById("1")).thenReturn(pet);

        mockMvc.perform(get("/api/pets/1"))
                .andExpect(status().isOk())
                .andExpect(content().json(mapper.writeValueAsString(pet)));
    }
}
