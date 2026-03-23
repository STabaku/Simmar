package com.simaar.simaar.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "event_photos")
public class EventPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_category_id", nullable = false)
    private EventCategory eventCategory;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    private String caption;
}
