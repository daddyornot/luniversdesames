package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.Order;
import fr.daddyornot.universdesames.model.dto.OrderRequest;
import fr.daddyornot.universdesames.service.InvoiceService;
import fr.daddyornot.universdesames.service.OrderService;
import fr.daddyornot.universdesames.service.ShippingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final InvoiceService invoiceService;
    private final ShippingService shippingService;

    @GetMapping
    // @Secured("ROLE_ADMIN")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

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

    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id, Authentication authentication) {
        // TODO: Vérifier que la commande appartient bien à l'utilisateur connecté (Sécurité)
        Order order = orderService.getOrderById(id);
        
        byte[] pdfBytes = invoiceService.generateInvoice(order);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=facture-" + order.getInvoiceNumber() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @PostMapping("/generate")
    public ResponseEntity<byte[]> downloadInvoice(@RequestBody Order order) {
        byte[] pdfContent = invoiceService.generateInvoice(order);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=facture_" + order.getInvoiceNumber() + ".pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdfContent);
    }

    @PostMapping("/{id}/ship")
    // @Secured("ROLE_ADMIN")
    public ResponseEntity<Void> createShippingLabel(@PathVariable Long id) {
        shippingService.createParcel(id);
        return ResponseEntity.ok().build();
    }
}
