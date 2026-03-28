package com.simaar.simaar.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {

    
    private Long bouquetId;
    // adding this
    private Long giftItemId;

    @NotNull(message = "Flower count is required")
    private Integer selectedCount;

    @NotNull(message = "Color is required")
    private String selectedColor;

    private String notes;
}