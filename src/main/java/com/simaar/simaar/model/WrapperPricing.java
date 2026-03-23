package com.simaar.simaar.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "wrapper_pricing")
public class WrapperPricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private Size size;

    @Column(nullable = false)
    private String color;

    @Column(name = "extra_price", nullable = false)
    private BigDecimal extraPrice = BigDecimal.ZERO;

    public enum Size {
        SMALL, MEDIUM, LARGE
    }
}