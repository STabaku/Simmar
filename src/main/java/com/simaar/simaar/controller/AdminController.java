package com.simaar.simaar.controller;

import com.simaar.simaar.dto.*;
import com.simaar.simaar.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    // dashboard summary
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    // users
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deactivateUser(id));
    }

    // supply tracker
    @GetMapping("/supply")
    public ResponseEntity<List<SupplyTrackerDTO>> getAllSupplies() {
        return ResponseEntity.ok(adminService.getAllSupplies());
    }

    @PostMapping("/supply")
    public ResponseEntity<SupplyTrackerDTO> addSupply(@Valid @RequestBody SupplyRequest request) {
        return ResponseEntity.ok(adminService.addSupply(request));
    }

    // gallery
    @GetMapping("/gallery")
    public ResponseEntity<List<GalleryDTO>> getAllGallery() {
        return ResponseEntity.ok(adminService.getAllGallery());
    }

    @PostMapping("/gallery")
    public ResponseEntity<GalleryDTO> addGalleryPhoto(@Valid @RequestBody GalleryRequest request) {
        return ResponseEntity.ok(adminService.addGalleryPhoto(request));
    }

    @DeleteMapping("/gallery/{id}")
    public ResponseEntity<String> deleteGalleryPhoto(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deleteGalleryPhoto(id));
    }
}