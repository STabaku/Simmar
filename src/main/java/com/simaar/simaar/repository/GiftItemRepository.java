package com.simaar.simaar.repository;

import com.simaar.simaar.model.GiftItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GiftItemRepository extends JpaRepository<GiftItem, Long> {
    List<GiftItem> findByIsAvailableTrue();
}