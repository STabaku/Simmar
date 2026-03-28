package com.simaar.simaar.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.simaar.simaar.model.GiftItem;

@Data
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "bouquet_id")
    private Bouquet bouquet;
    // per porosi te gifteve
@ManyToOne
@JoinColumn(name = "gift_item_id")
private GiftItem giftItem;

    @Column(name = "selected_color")
    private String selectedColor;

    @Column(name = "selected_count")
    private Integer selectedCount;

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        PENDING, ACCEPTED, CANCELLED
    }
}
