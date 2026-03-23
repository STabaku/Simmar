package com.simaar.simaar.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "bouquet_options")
public class BouquetOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bouquet_id", nullable = false)
    private Bouquet bouquet;

    @Column(nullable = false)
    private String color;

    @Column(name = "flower_count", nullable = false)
    private Integer flowerCount;
}