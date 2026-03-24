package com.simaar.simaar.repository;

import com.simaar.simaar.model.BouquetOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BouquetOptionRepository extends JpaRepository<BouquetOption, Long> {
    List<BouquetOption> findByBouquetId(Long bouquetId);
    void deleteByBouquetId(Long bouquetId);
}

