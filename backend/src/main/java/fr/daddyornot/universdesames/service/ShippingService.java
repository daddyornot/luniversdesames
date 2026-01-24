package fr.daddyornot.universdesames.service;

import fr.daddyornot.universdesames.model.Order;
import fr.daddyornot.universdesames.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShippingService {

    private final OrderRepository orderRepository;

    @Value("${sendcloud.api.key:}")
    private String apiKey;

    @Value("${sendcloud.api.secret:}")
    private String apiSecret;

    public void createParcel(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));

        if (order.getSendCloudParcelId() != null) {
            throw new RuntimeException("Une étiquette existe déjà pour cette commande");
        }

        // TODO: Appeler l'API SendCloud pour créer le colis
        // POST https://panel.sendcloud.sc/api/v2/parcels

        // Simulation pour le moment
        System.out.println("Création étiquette SendCloud pour commande " + order.getInvoiceNumber());

        order.setSendCloudParcelId("parcel_" + System.currentTimeMillis());
        order.setTrackingNumber("TRACK-" + System.currentTimeMillis());
        order.setTrackingUrl("https://tracking.sendcloud.sc/" + order.getTrackingNumber());
        order.setShippingStatus("ANNOUNCED");
        order.setShippingLabelUrl("https://example.com/label.pdf"); // URL fictive

        orderRepository.save(order);
    }
}
