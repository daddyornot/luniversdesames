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
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order saveOrder(OrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Order order = new Order();
        order.setUser(user);
        order.setCustomerEmail(request.customerEmail());
        order.setCustomerName(request.customerName());
        order.setInvoiceNumber(generateInvoiceReference());

        double total = 0;

        for (ItemRequest itemReq : request.items()) {
            Product product = productRepository.findById(itemReq.productId())
                .orElseThrow(() -> new RuntimeException("Produit non trouvé : " + itemReq.productId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(itemReq.quantity());
            orderItem.setPriceAtPurchase(product.getPrice()); // On prend le prix du Back
            orderItem.setAppointmentDate(itemReq.appointmentDate()); // On sauvegarde la date du RDV

            order.getItems().add(orderItem);
            total += product.getPrice() * itemReq.quantity();
        }

        order.setTotalAmount(total);
        return orderRepository.save(order);
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
        // Résultat : INV-20260116-173522 (Unique et triable par date)
    }
}
