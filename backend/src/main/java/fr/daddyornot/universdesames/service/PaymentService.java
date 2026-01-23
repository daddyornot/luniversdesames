package fr.daddyornot.universdesames.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import fr.daddyornot.universdesames.model.Product;
import fr.daddyornot.universdesames.model.dto.OrderRequest;
import fr.daddyornot.universdesames.model.dto.PaymentResponse;
import fr.daddyornot.universdesames.repository.ProductRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    @Value("${stripe.secret-key}")
    private String secretKey;

    private final ProductRepository productRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public PaymentResponse createCheckoutSession(OrderRequest orderRequest) throws StripeException {
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();

        for (var item : orderRequest.items()) {
            Product product = productRepository.findById(item.productId())
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

            lineItems.add(
                SessionCreateParams.LineItem.builder()
                    .setQuantity(Long.valueOf(item.quantity()))
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("eur")
                            .setUnitAmount((long) (product.getPrice() * 100))
                            .setProductData(
                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName(product.getName())
                                    .setDescription(product.getDescription())
                                    // .addImage(product.getImageUrl()) // Optionnel si URL publique
                                    .build()
                            )
                            .build()
                    )
                    .build()
            );
        }

        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl("http://localhost:4200/checkout/success?session_id={CHECKOUT_SESSION_ID}")
            .setCancelUrl("http://localhost:4200/panier")
            .setCustomerEmail(orderRequest.customerEmail())
            .addAllLineItem(lineItems)
            .build();

        Session session = Session.create(params);

        // On renvoie l'URL de redirection vers Stripe
        return new PaymentResponse(session.getUrl());
    }
}
