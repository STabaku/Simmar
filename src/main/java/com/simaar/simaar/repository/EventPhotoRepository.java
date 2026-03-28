

// ── EventPhotoRepository.java ──
// Place in: repository/EventPhotoRepository.java

package com.simaar.simaar.repository;

import com.simaar.simaar.model.EventPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventPhotoRepository extends JpaRepository<EventPhoto, Long> {
}
