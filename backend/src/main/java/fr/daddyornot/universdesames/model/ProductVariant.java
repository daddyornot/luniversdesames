package fr.daddyornot.universdesames.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "product_variants")
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label; // Ex: "Formule Découverte (1 mois)"
    private Double price; // Prix spécifique à cette variante
    private Integer sessionCount;
    private Integer durationMonths;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;
}
