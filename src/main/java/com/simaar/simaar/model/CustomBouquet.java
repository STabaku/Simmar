package com.simaar.simaar.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "custom_bouquets")
public class CustomBouquet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "wrapper_id")
    private WrapperPricing wrapper;

    @Column(name = "total_price")
    private BigDecimal totalPrice = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "customBouquet", cascade = CascadeType.ALL)
    private List<CustomBouquetFlower> flowers;

    @OneToMany(mappedBy = "customBouquet", cascade = CascadeType.ALL)
    private List<CustomBouquetExtra> extras;

    public enum Status {
        PENDING, ACCEPTED, CANCELLED
    }
}