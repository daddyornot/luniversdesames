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

    @Value("${app.url}") // URL du frontend pour les redirections
    private String appUrl;

    private final ProductRepository productRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public PaymentResponse createCheckoutSession(OrderRequest orderRequest) throws StripeException {
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
        boolean hasSubscription = false;

        for (var item : orderRequest.items()) {
            Product product = productRepository.findById(item.productId())
                    .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

            if (product.isSubscription()) {
                hasSubscription = true;
            }

            SessionCreateParams.LineItem.PriceData.Builder priceDataBuilder = SessionCreateParams.LineItem.PriceData.builder()
                    .setCurrency("eur")
                    .setUnitAmount((long) (product.getPrice() * 100))
                    .setProductData(
                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName(product.getName())
                                    .setDescription(product.getDescription())
                                    .build()
                    );

            if (product.isSubscription()) {
                priceDataBuilder.setRecurring(
                        SessionCreateParams.LineItem.PriceData.Recurring.builder()
                                .setInterval(SessionCreateParams.LineItem.PriceData.Recurring.Interval.valueOf(product.getRecurringInterval().toUpperCase()))
                                .build()
                );
            }

            lineItems.add(
                    SessionCreateParams.LineItem.builder()
                            .setQuantity(Long.valueOf(item.quantity()))
                            .setPriceData(priceDataBuilder.build())
                            .build()
            );
        }

        SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                .setMode(hasSubscription ? SessionCreateParams.Mode.SUBSCRIPTION : SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(appUrl + "/checkout/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(appUrl + "/panier")
                .setCustomerEmail(orderRequest.customerEmail())
                .addAllLineItem(lineItems);

        Session session = Session.create(paramsBuilder.build());

        return new PaymentResponse(session.getUrl());
    }
}
