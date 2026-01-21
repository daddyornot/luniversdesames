package fr.daddyornot.universdesames.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Double price; // Prix de base (ou prix "à partir de")
    private String stone;

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private ProductType type;

    private Integer sessionCount;
    private Integer durationMonths;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> variants = new ArrayList<>();
}
