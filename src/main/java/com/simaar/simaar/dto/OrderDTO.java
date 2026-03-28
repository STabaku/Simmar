package com.simaar.simaar.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderDTO {
    private Long id;
    private String userName;
    private String userEmail;
    private String bouquetName;
    private String selectedColor;
    private Integer selectedCount;
    private BigDecimal totalPrice;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
    // add this field
    private String giftItemName;
}