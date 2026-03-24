package com.simaar.simaar.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class BouquetRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    private BigDecimal basePrice;

    private String imageUrl;

    private Boolean isAvailable = true;

    private List<BouquetOptionDTO> options;
}