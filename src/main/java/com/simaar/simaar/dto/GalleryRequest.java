package com.simaar.simaar.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GalleryRequest {

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    private String caption;
}