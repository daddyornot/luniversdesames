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
    private Double price;

    // Remplacement de ElementCollection par ManyToMany
    @ManyToMany
    @JoinTable(
        name = "product_stones_link",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "stone_id")
    )
    private List<Stone> stones = new ArrayList<>();

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private ProductType type;

    private Integer sessionCount;
    private Integer durationMonths;
    
    private Integer bufferTimeMinutes = 0;

    // --- ABONNEMENT ---
    private boolean isSubscription = false;
    
    // "month", "year", "week", "day"
    private String recurringInterval;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> variants = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "product_available_sizes",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "size_id")
    )
    private List<ProductSize> sizes = new ArrayList<>();
}
