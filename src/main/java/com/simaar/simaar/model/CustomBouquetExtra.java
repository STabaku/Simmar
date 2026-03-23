package com.simaar.simaar.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "custom_bouquet_extras")
public class CustomBouquetExtra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "custom_bouquet_id", nullable = false)
    private CustomBouquet customBouquet;

    @Column(name = "extra_name", nullable = false)
    private String extraName;

    @Column(name = "extra_price", nullable = false)
    private BigDecimal extraPrice = BigDecimal.ZERO;
}