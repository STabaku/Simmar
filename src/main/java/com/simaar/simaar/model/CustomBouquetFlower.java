package com.simaar.simaar.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "custom_bouquet_flowers")
public class CustomBouquetFlower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "custom_bouquet_id", nullable = false)
    private CustomBouquet customBouquet;

    @ManyToOne
    @JoinColumn(name = "flower_id", nullable = false)
    private Flower flower;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "subtotal")
    private BigDecimal subtotal;
}