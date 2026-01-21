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
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public Order saveOrder(OrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Order order = new Order();
        order.setUser(user);
        order.setCustomerEmail(request.customerEmail());
        order.setCustomerName(request.customerName());
        order.setInvoiceNumber(generateInvoiceReference());
        
        // On fige l'adresse de facturation
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
            orderItem.setAppointmentDate(itemReq.appointmentDate());

            order.getItems().add(orderItem);
            total += product.getPrice() * itemReq.quantity();
        }

        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);

        try {
            sendOrderConfirmationEmail(savedOrder);
        } catch (MessagingException e) {
            System.err.println("Erreur lors de l'envoi de l'email de confirmation : " + e.getMessage());
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
