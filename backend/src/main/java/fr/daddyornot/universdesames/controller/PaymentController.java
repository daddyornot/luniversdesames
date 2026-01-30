package fr.daddyornot.universdesames.controller;

import com.stripe.exception.StripeException;
import fr.daddyornot.universdesames.model.dto.OrderRequest;
import fr.daddyornot.universdesames.model.dto.PaymentResponse;
import fr.daddyornot.universdesames.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-session")
    @Operation(operationId = "createCheckoutSession", summary = "Créer une session de paiement Stripe", responses = {
            @ApiResponse(responseCode = "200", description = "Session créée",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = PaymentResponse.class))),
            @ApiResponse(responseCode = "400", description = "Erreur de validation ou Stripe", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<PaymentResponse> createCheckoutSession(@Valid @RequestBody OrderRequest orderRequest) throws StripeException {
        return ResponseEntity.ok(paymentService.createCheckoutSession(orderRequest));
    }
}
