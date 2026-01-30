package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.Order;
import fr.daddyornot.universdesames.model.dto.OrderDTO;
import fr.daddyornot.universdesames.model.dto.OrderItemDTO;
import fr.daddyornot.universdesames.model.dto.OrderRequest;
import fr.daddyornot.universdesames.service.InvoiceService;
import fr.daddyornot.universdesames.service.OrderService;
import fr.daddyornot.universdesames.service.ShippingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final InvoiceService invoiceService;
    private final ShippingService shippingService;

    @GetMapping
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "getAllOrders", summary = "Récupérer toutes les commandes (Admin)", responses = {
            @ApiResponse(responseCode = "200", description = "Liste des commandes",
                    content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = OrderDTO.class)))),
            @ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        List<OrderDTO> dtos = orders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    @Operation(operationId = "createOrder", summary = "Créer une commande", responses = {
            @ApiResponse(responseCode = "200", description = "Commande créée",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = OrderDTO.class))),
            @ApiResponse(responseCode = "400", description = "Données invalides", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderRequest request, Authentication authentication) {
        String userEmail = authentication.getName();
        Order savedOrder = orderService.saveOrder(request, userEmail);
        return ResponseEntity.ok(convertToDto(savedOrder));
    }

    @GetMapping("/my-orders")
    @Operation(operationId = "getMyOrders", summary = "Récupérer mes commandes", responses = {
            @ApiResponse(responseCode = "200", description = "Liste de mes commandes",
                    content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = OrderDTO.class)))),
            @ApiResponse(responseCode = "403", description = "Non authentifié", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<List<OrderDTO>> getMyOrders(Authentication authentication) {
        String userEmail = authentication.getName();
        List<Order> orders = orderService.getOrdersByUser(userEmail);
        List<OrderDTO> dtos = orders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping(value = "/{id}/invoice", produces = MediaType.APPLICATION_PDF_VALUE)
    @Operation(
        operationId = "downloadOrderInvoice",
        summary = "Télécharge la facture en PDF",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Facture PDF",
                content = @Content(mediaType = "application/pdf", schema = @Schema(type = "string", format = "binary"))),
            @ApiResponse(responseCode = "404", description = "Commande ou facture non trouvée", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(mediaType = "application/json"))
        }
    )
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id, Authentication authentication) {
        Order order = orderService.getOrderById(id);
        byte[] pdfBytes = invoiceService.generateInvoice(order);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=facture-" + order.getInvoiceNumber() + ".pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdfBytes);
    }

    @PostMapping("/{id}/ship")
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "createShippingLabel", summary = "Créer une étiquette d'expédition (Admin)", responses = {
            @ApiResponse(responseCode = "200", description = "Étiquette créée"),
            @ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "404", description = "Commande non trouvée", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<Void> createShippingLabel(@PathVariable Long id) {
        shippingService.createParcel(id);
        return ResponseEntity.ok().build();
    }

    private OrderDTO convertToDto(Order order) {
        List<OrderItemDTO> items = order.getItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getId(),
                        item.getProductId(),
                        item.getProductName(),
                        item.getQuantity(),
                        item.getPriceAtPurchase(),
                        item.getAppointmentDate(),
                        item.getSizeLabel(),
                        item.getSizeDescription()
                ))
                .collect(Collectors.toList());

        return new OrderDTO(
                order.getId(),
                order.getInvoiceNumber(),
                order.getCustomerEmail(),
                order.getCustomerName(),
                order.getBillingAddress(),
                order.getBillingCity(),
                order.getBillingPostalCode(),
                order.getBillingCountry(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                items,
                order.getSendCloudParcelId(),
                order.getTrackingNumber(),
                order.getTrackingUrl(),
                order.getShippingStatus(),
                order.getShippingLabelUrl()
        );
    }
}
