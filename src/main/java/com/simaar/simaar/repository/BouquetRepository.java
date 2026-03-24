package com.simaar.simaar.repository;

import com.simaar.simaar.model.Bouquet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BouquetRepository extends JpaRepository<Bouquet, Long> {

    @Query("SELECT b FROM Bouquet b WHERE b.isAvailable = true")
    List<Bouquet> findAllAvailable();
}