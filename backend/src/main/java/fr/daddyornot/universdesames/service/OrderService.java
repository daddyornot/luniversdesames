package fr.daddyornot.universdesames.service;

import fr.daddyornot.universdesames.model.Order;
import fr.daddyornot.universdesames.model.OrderItem;
import fr.daddyornot.universdesames.model.Product;
import fr.daddyornot.universdesames.model.User;
import fr.daddyornot.universdesames.model.dto.ItemRequest;
import fr.daddyornot.universdesames.model.dto.OrderRequest;
import fr.daddyornot.universdesames.repository.OrderRepository;
import fr.daddyornot.universdesames.repository.ProductRepository;
import fr.daddyornot.universdesames.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final GoogleCalendarService googleCalendarService;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public Order saveOrder(OrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Order order = new Order();
        order.setUser(user);
        order.setCustomerEmail(request.customerEmail());
        order.setCustomerName(request.customerName());
        order.setInvoiceNumber(generateInvoiceReference());

        order.setBillingAddress(user.getAddress());
        order.setBillingCity(user.getCity());
        order.setBillingPostalCode(user.getPostalCode());
        order.setBillingCountry(user.getCountry());

        double total = 0;

        for (ItemRequest itemReq : request.items()) {
            Product product = productRepository.findById(itemReq.productId())
                .orElseThrow(() -> new RuntimeException("Produit non trouvé : " + itemReq.productId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(itemReq.quantity());
            orderItem.setPriceAtPurchase(product.getPrice());
            orderItem.setAppointmentDate(itemReq.appointmentDate() != null ?
                    itemReq.appointmentDate().toLocalDateTime() : null
            );

            order.getItems().add(orderItem);
            total += product.getPrice() * itemReq.quantity();

            // Si c'est un service avec une date, on crée l'événement Google Calendar
            if (itemReq.appointmentDate() != null) {
                // On lance la création de l'événement de manière asynchrone (ou synchrone si on veut être sûr)
                // Ici on le fait directement car createEvent gère ses exceptions
                googleCalendarService.createEvent(
                    "RDV : " + product.getName() + " - " + request.customerName(),
                    "Réservation via Univers des Âmes.\nClient : " + request.customerName() + "\nEmail : " + request.customerEmail(),
                    itemReq.appointmentDate().toLocalDateTime(),
                    itemReq.appointmentDate().toLocalDateTime().plusHours(1), // Durée par défaut 1h, à affiner selon le produit
                    request.customerEmail()
                );
            }
        }

        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);

        try {
            sendOrderConfirmationEmail(savedOrder);
        } catch (MessagingException e) {
            log.error("Erreur lors de l'envoi de l'email de confirmation : {}", e.getMessage());
        }

        return savedOrder;
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
    }

    private void sendOrderConfirmationEmail(Order order) throws MessagingException {
        Map<String, Object> templateModel = Map.of(
            "customerName", order.getCustomerName(),
            "orderNumber", order.getInvoiceNumber(),
            "items", order.getItems(),
            "totalAmount", String.format("%.2f", order.getTotalAmount())
        );

        emailService.sendHtmlEmail(
            order.getCustomerEmail(),
            "Confirmation de votre commande #" + order.getInvoiceNumber(),
            "order-confirmation.html",
            templateModel
        );
    }

    public List<Order> getOrdersByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return orderRepository.findByUser(user);
    }

    private String generateInvoiceReference() {
        LocalDateTime now = LocalDateTime.now();
        String datePart = now.format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        return "INV-" + datePart;
    }
}
