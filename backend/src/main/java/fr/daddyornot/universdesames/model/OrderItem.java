package fr.daddyornot.universdesames.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "order_item")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private String productName;
    private Integer quantity;
    private Double priceAtPurchase; // Le prix figé au moment de la commande
    private LocalDateTime appointmentDate; // Date du RDV si c'est un service
}
