package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.Order;
import fr.daddyornot.universdesames.model.dto.OrderRequest;
import fr.daddyornot.universdesames.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody OrderRequest request, Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(orderService.saveOrder(request, userEmail));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(orderService.getOrdersByUser(userEmail));
    }
}
