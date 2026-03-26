package com.simaar.simaar.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class GalleryDTO {
    private Long id;
    private String imageUrl;
    private String caption;
    private LocalDateTime uploadedAt;
}