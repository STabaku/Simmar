package com.simaar.simaar.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class BouquetDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private String imageUrl;
    private Boolean isAvailable;
    private List<BouquetOptionDTO> options;
}