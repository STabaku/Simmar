package com.simaar.simaar.service;

import com.simaar.simaar.dto.*;
import com.simaar.simaar.model.Gallery;
import com.simaar.simaar.model.Order;
import com.simaar.simaar.model.SupplyTracker;
import com.simaar.simaar.model.User;
import com.simaar.simaar.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final BouquetRepository bouquetRepository;
    private final SupplyTrackerRepository supplyTrackerRepository;
    private final GalleryRepository galleryRepository;

    // dashboard summary numbers
    public DashboardDTO getDashboard() {
        DashboardDTO dto = new DashboardDTO();
        dto.setTotalOrders(orderRepository.count());
        dto.setTotalUsers(userRepository.count());
        dto.setTotalBouquets(bouquetRepository.count());
        dto.setPendingOrders(orderRepository.countByStatus(Order.Status.PENDING));
        dto.setAcceptedOrders(orderRepository.countByStatus(Order.Status.ACCEPTED));
        dto.setCancelledOrders(orderRepository.countByStatus(Order.Status.CANCELLED));
        return dto;
    }

    // get all users
    public List<UserDTO> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toUserDTO)
                .collect(Collectors.toList());
    }

    // deactivate a user
    public String deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
        return "User deactivated";
    }

    // get all supplies
    public List<SupplyTrackerDTO> getAllSupplies() {
        return supplyTrackerRepository.findAllByOrderByDatePurchasedDesc()
                .stream()
                .map(this::toSupplyDTO)
                .collect(Collectors.toList());
    }

    // add a supply purchase
    public SupplyTrackerDTO addSupply(SupplyRequest request) {
        SupplyTracker supply = new SupplyTracker();
        supply.setProductName(request.getProductName());
        supply.setQuantity(request.getQuantity());
        supply.setUnit(request.getUnit());
        supply.setPricePaid(request.getPricePaid());
        supply.setDatePurchased(request.getDatePurchased());
        supply.setNotes(request.getNotes());
        return toSupplyDTO(supplyTrackerRepository.save(supply));
    }

    // get all gallery photos
    public List<GalleryDTO> getAllGallery() {
        return galleryRepository.findAllByOrderByUploadedAtDesc()
                .stream()
                .map(this::toGalleryDTO)
                .collect(Collectors.toList());
    }

    // add a gallery photo
    public GalleryDTO addGalleryPhoto(GalleryRequest request) {
        Gallery gallery = new Gallery();
        gallery.setImageUrl(request.getImageUrl());
        gallery.setCaption(request.getCaption());
        return toGalleryDTO(galleryRepository.save(gallery));
    }

    // delete a gallery photo
    public String deleteGalleryPhoto(Long id) {
        if (!galleryRepository.existsById(id)) {
            throw new RuntimeException("Photo not found");
        }
        galleryRepository.deleteById(id);
        return "Photo deleted";
    }

    // converters
    private UserDTO toUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setIsActive(user.getIsActive());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    private SupplyTrackerDTO toSupplyDTO(SupplyTracker supply) {
        SupplyTrackerDTO dto = new SupplyTrackerDTO();
        dto.setId(supply.getId());
        dto.setProductName(supply.getProductName());
        dto.setQuantity(supply.getQuantity());
        dto.setUnit(supply.getUnit());
        dto.setPricePaid(supply.getPricePaid());
        dto.setDatePurchased(supply.getDatePurchased());
        dto.setNotes(supply.getNotes());
        return dto;
    }

    private GalleryDTO toGalleryDTO(Gallery gallery) {
        GalleryDTO dto = new GalleryDTO();
        dto.setId(gallery.getId());
        dto.setImageUrl(gallery.getImageUrl());
        dto.setCaption(gallery.getCaption());
        dto.setUploadedAt(gallery.getUploadedAt());
        return dto;
    }
}