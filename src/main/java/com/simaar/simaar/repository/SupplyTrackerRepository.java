package com.simaar.simaar.repository;

import com.simaar.simaar.model.SupplyTracker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplyTrackerRepository extends JpaRepository<SupplyTracker, Long> {
    List<SupplyTracker> findAllByOrderByDatePurchasedDesc();
}