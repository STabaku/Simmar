package com.simaar.simaar.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SupplyRequest {

    @NotBlank(message = "Product name is required")
    private String productName;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

    @NotBlank(message = "Unit is required")
    private String unit;

    @NotNull(message = "Price is required")
    private BigDecimal pricePaid;

    @NotNull(message = "Date is required")
    private LocalDate datePurchased;

    private String notes;
}
