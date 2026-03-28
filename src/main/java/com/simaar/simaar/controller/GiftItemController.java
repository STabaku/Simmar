package com.simaar.simaar.controller;

import com.simaar.simaar.model.GiftItem;
import com.simaar.simaar.repository.GiftItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gift-items")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GiftItemController {

    private final GiftItemRepository giftItemRepository;

    @GetMapping
    public ResponseEntity<List<GiftItem>> getAll() {
        return ResponseEntity.ok(giftItemRepository.findByIsAvailableTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GiftItem> getById(@PathVariable Long id) {
        return ResponseEntity.ok(
            giftItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gift not found"))
        );
    }

    // admin adds a gift item
    @PostMapping("/api/admin/gift-items")
    public ResponseEntity<GiftItem> create(@RequestBody GiftItem item) {
        return ResponseEntity.ok(giftItemRepository.save(item));
    }

    // admin deletes a gift item
    @DeleteMapping("/api/admin/gift-items/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        giftItemRepository.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }
// admin updates a gift item
    @PutMapping("/api/admin/gift-items/{id}")
public ResponseEntity<GiftItem> update(@PathVariable Long id,
                                        @RequestBody GiftItem item) {
    item.setId(id);
    return ResponseEntity.ok(giftItemRepository.save(item));
}
}