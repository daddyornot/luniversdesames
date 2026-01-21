package fr.daddyornot.universdesames.controller;

import com.stripe.exception.StripeException;
import fr.daddyornot.universdesames.model.dto.OrderRequest;
import fr.daddyornot.universdesames.model.dto.PaymentResponse;
import fr.daddyornot.universdesames.service.PaymentService;
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
    public ResponseEntity<PaymentResponse> createCheckoutSession(@Valid @RequestBody OrderRequest orderRequest) throws StripeException {
        return ResponseEntity.ok(paymentService.createCheckoutSession(orderRequest));
    }
}
