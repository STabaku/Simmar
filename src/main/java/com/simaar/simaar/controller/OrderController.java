package com.simaar.simaar.controller;

import com.simaar.simaar.dto.OrderDTO;
import com.simaar.simaar.dto.OrderRequest;
import com.simaar.simaar.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    // USER — place an order (must be logged in)
    @PostMapping("/api/orders")
    public ResponseEntity<OrderDTO> placeOrder(@Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.placeOrder(request));
    }

    // USER — see my orders (must be logged in)
    @GetMapping("/api/orders/my")
    public ResponseEntity<List<OrderDTO>> getMyOrders() {
        return ResponseEntity.ok(orderService.getMyOrders());
    }

    // ADMIN — see all orders
    @GetMapping("/api/admin/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // ADMIN — accept an order
    @PutMapping("/api/admin/orders/{id}/accept")
    public ResponseEntity<OrderDTO> acceptOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.acceptOrder(id));
    }

    // ADMIN — cancel an order
    @PutMapping("/api/admin/orders/{id}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(id));
    }
}