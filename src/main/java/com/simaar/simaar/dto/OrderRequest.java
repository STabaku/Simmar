package com.simaar.simaar.dto;

//import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {

    private Long bouquetId;       // null for custom / gift orders
    private Long giftItemId;      // null for bouquet / custom orders

    private Integer selectedCount;
    private String selectedColor;

    private java.math.BigDecimal totalPrice; // used for custom orders

    private String notes;
}