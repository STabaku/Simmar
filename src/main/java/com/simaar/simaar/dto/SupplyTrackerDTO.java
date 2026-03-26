package com.simaar.simaar.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SupplyTrackerDTO {
    private Long id;
    private String productName;
    private Integer quantity;
    private String unit;
    private BigDecimal pricePaid;
    private LocalDate datePurchased;
    private String notes;
}