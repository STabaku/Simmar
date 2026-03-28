// ── EventCategoryRepository.java ──
// Place in: repository/EventCategoryRepository.java

package com.simaar.simaar.repository;

import com.simaar.simaar.model.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventCategoryRepository extends JpaRepository<EventCategory, Long> {
}

