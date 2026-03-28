package com.simaar.simaar.controller;

import com.simaar.simaar.model.EventCategory;
import com.simaar.simaar.model.EventPhoto;
import com.simaar.simaar.repository.EventCategoryRepository;
import com.simaar.simaar.repository.EventPhotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final EventCategoryRepository eventCategoryRepository;
    private final EventPhotoRepository eventPhotoRepository;

    // PUBLIC — anyone can see events
    @GetMapping("/api/events")
    public ResponseEntity<List<EventCategory>> getAll() {
        return ResponseEntity.ok(eventCategoryRepository.findAll());
    }

    // ADMIN — add event category
    @PostMapping("/api/admin/events")
    public ResponseEntity<EventCategory> create(@RequestBody EventCategory category) {
        return ResponseEntity.ok(eventCategoryRepository.save(category));
    }

    // ADMIN — delete event category
    @DeleteMapping("/api/admin/events/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        eventCategoryRepository.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }

    // ADMIN — add photo to event
    @PostMapping("/api/admin/events/{id}/photos")
    public ResponseEntity<EventPhoto> addPhoto(@PathVariable Long id,
                                                @RequestBody EventPhoto photo) {
        EventCategory category = eventCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        photo.setEventCategory(category);
        return ResponseEntity.ok(eventPhotoRepository.save(photo));
    }

    // ADMIN — delete event photo
    @DeleteMapping("/api/admin/events/photos/{photoId}")
    public ResponseEntity<String> deletePhoto(@PathVariable Long photoId) {
        eventPhotoRepository.deleteById(photoId);
        return ResponseEntity.ok("Photo deleted");
    }
}
