package com.simaar.simaar.controller;

import com.simaar.simaar.dto.BouquetDTO;
import com.simaar.simaar.dto.BouquetRequest;
import com.simaar.simaar.service.BouquetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")

public class BouquetController {

    private final BouquetService bouquetService;

    // PUBLIC — anyone can see bouquets
    @GetMapping("/api/bouquets")
    public ResponseEntity<List<BouquetDTO>> getAllAvailable() {
        return ResponseEntity.ok(bouquetService.getAllAvailable());
    }

    @GetMapping("/api/bouquets/{id}")
    public ResponseEntity<BouquetDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bouquetService.getById(id));
    }

    // ADMIN ONLY — protected by SecurityConfig
    @GetMapping("/api/admin/bouquets")
    public ResponseEntity<List<BouquetDTO>> getAll() {
        return ResponseEntity.ok(bouquetService.getAll());
    }

    @PostMapping("/api/admin/bouquets")
    public ResponseEntity<BouquetDTO> create(@Valid @RequestBody BouquetRequest request) {
        return ResponseEntity.ok(bouquetService.create(request));
    }

    @PutMapping("/api/admin/bouquets/{id}")
    public ResponseEntity<BouquetDTO> update(@PathVariable Long id, @Valid @RequestBody BouquetRequest request) {
        return ResponseEntity.ok(bouquetService.update(id, request));
    }

    @DeleteMapping("/api/admin/bouquets/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        bouquetService.delete(id);
        return ResponseEntity.ok("Bouquet deleted successfully");
    }

}
