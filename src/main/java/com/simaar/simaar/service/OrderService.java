package com.simaar.simaar.service;

import com.simaar.simaar.dto.OrderDTO;
import com.simaar.simaar.dto.OrderRequest;
import com.simaar.simaar.model.Bouquet;
import com.simaar.simaar.model.GiftItem;
import com.simaar.simaar.model.Order;
import com.simaar.simaar.model.User;
import com.simaar.simaar.repository.BouquetRepository;
import com.simaar.simaar.repository.GiftItemRepository;
import com.simaar.simaar.repository.OrderRepository;
import com.simaar.simaar.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final BouquetRepository bouquetRepository;
    private final UserRepository userRepository;

    private final GiftItemRepository giftItemRepository;

    // user places an order
  public OrderDTO placeOrder(OrderRequest request) {

    String email = SecurityContextHolder.getContext()
            .getAuthentication().getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    java.math.BigDecimal total = java.math.BigDecimal.ZERO;
    Bouquet bouquet = null;
    GiftItem giftItem = null;

    if (request.getBouquetId() != null) {
        Long bid = request.getBouquetId();
        bouquet = bouquetRepository.findById(bid)
                .orElseThrow(() -> new RuntimeException("Bouquet not found"));
        if (!bouquet.getIsAvailable()) {
            throw new RuntimeException("Bouquet is not available");
        }
        int count = request.getSelectedCount() != null
                ? request.getSelectedCount() : 1;
        total = total.add(bouquet.getBasePrice()
                .multiply(java.math.BigDecimal.valueOf(count)));
    }

    if (request.getGiftItemId() != null) {
        Long gid = request.getGiftItemId();
        giftItem = giftItemRepository.findById(gid)
                .orElseThrow(() -> new RuntimeException("Gift not found"));
        if (!giftItem.getIsAvailable()) {
            throw new RuntimeException("Gift item is not available");
        }
        total = total.add(giftItem.getPrice());
    }

    // custom bouquet order — use price from request
if (request.getBouquetId() == null && request.getGiftItemId() == null) {
    if (request.getTotalPrice() != null) {
        total = request.getTotalPrice();
    }
}

    Order order = new Order();
    order.setUser(user);
    order.setBouquet(bouquet);
    order.setGiftItem(giftItem);
    order.setSelectedColor(request.getSelectedColor());
    order.setSelectedCount(request.getSelectedCount());
    order.setTotalPrice(total);
    order.setNotes(request.getNotes());
    order.setStatus(Order.Status.PENDING);

    return toDTO(orderRepository.save(order));
}
    // user sees their own orders
    public List<OrderDTO> getMyOrders() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUserId(user.getId())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // admin sees all orders
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // admin accepts an order
    public OrderDTO acceptOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != Order.Status.PENDING) {
            throw new RuntimeException("Only pending orders can be accepted");
        }

        order.setStatus(Order.Status.ACCEPTED);
        return toDTO(orderRepository.save(order));
    }

    // admin cancels an order
    public OrderDTO cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == Order.Status.ACCEPTED) {
            throw new RuntimeException("Accepted orders cannot be cancelled");
        }

        order.setStatus(Order.Status.CANCELLED);
        return toDTO(orderRepository.save(order));
    }

    private OrderDTO toDTO(Order order) {
    OrderDTO dto = new OrderDTO();
    dto.setId(order.getId());
    dto.setUserName(order.getUser().getName());
    dto.setUserEmail(order.getUser().getEmail());

    if (order.getBouquet() != null) {
        dto.setBouquetName(order.getBouquet().getName());
    } else {
        dto.setBouquetName("Custom Bouquet");
    }

    if (order.getGiftItem() != null) {
        dto.setGiftItemName(order.getGiftItem().getName());
    }

    dto.setSelectedColor(order.getSelectedColor());
    dto.setSelectedCount(order.getSelectedCount());
    dto.setTotalPrice(order.getTotalPrice());
    dto.setStatus(order.getStatus().name());
    dto.setNotes(order.getNotes());
    dto.setCreatedAt(order.getCreatedAt());
    return dto;
}
}