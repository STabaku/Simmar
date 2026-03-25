package com.simaar.simaar.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {

    @NotNull(message = "Bouquet is required")
    private Long bouquetId;

    @NotNull(message = "Flower count is required")
    private Integer selectedCount;

    @NotNull(message = "Color is required")
    private String selectedColor;

    private String notes;
}