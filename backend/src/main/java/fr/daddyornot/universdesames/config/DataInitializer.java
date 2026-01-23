package fr.daddyornot.universdesames.config;

import fr.daddyornot.universdesames.model.Product;
import fr.daddyornot.universdesames.model.ProductType;
import fr.daddyornot.universdesames.model.ProductVariant;
import fr.daddyornot.universdesames.model.User;
import fr.daddyornot.universdesames.repository.ProductRepository;
import fr.daddyornot.universdesames.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialisation Produits
        if (productRepository.count() == 0) {
            Product p1 = new Product();
            p1.setName("Bracelet Améthyste");
            p1.setDescription("Pierre de la sagesse et de l'humilité. Favorise l'élévation spirituelle, la concentration et la méditation.");
            p1.setPrice(25.0);
            p1.setStone("Améthyste");
            p1.setType(ProductType.PHYSICAL);
            p1.setImageUrl("assets/images/alexey-demidov-QRnUMyfhpgA-unsplash.jpg");

            Product p2 = new Product();
            p2.setName("Bracelet Œil de Tigre");
            p2.setDescription("Pierre de protection. Renvoie les énergies négatives vers son émetteur.");
            p2.setPrice(22.0);
            p2.setStone("Œil de Tigre");
            p2.setType(ProductType.PHYSICAL);
            p2.setImageUrl("assets/images/alexey-demidov-WTKBeM7rGQE-unsplash.jpg");

            Product p3 = new Product();
            p3.setName("Guidance Spirituelle");
            p3.setDescription("Séance de guidance spirituelle personnalisée de 1h.");
            p3.setPrice(60.0);
            p3.setType(ProductType.ENERGY_CARE);
            p3.setSessionCount(1);
            p3.setImageUrl("assets/images/wellness-285590_1280.jpg");

            // Produit avec variantes
            Product p4 = new Product();
            p4.setName("Coaching Transformation");
            p4.setDescription("Accompagnement complet pour transformer votre vie.");
            p4.setPrice(150.0); // Prix "à partir de"
            p4.setType(ProductType.COACHING);
            p4.setImageUrl("assets/images/hoylee-song-TsbJvGJ0RwY-unsplash.jpg");

            ProductVariant v1 = new ProductVariant();
            v1.setLabel("Découverte (1 mois)");
            v1.setPrice(150.0);
            v1.setDurationMonths(1);
            v1.setSessionCount(2);
            v1.setProduct(p4);

            ProductVariant v2 = new ProductVariant();
            v2.setLabel("Transformation (3 mois)");
            v2.setPrice(400.0);
            v2.setDurationMonths(3);
            v2.setSessionCount(6);
            v2.setProduct(p4);

            p4.setVariants(List.of(v1, v2));

            productRepository.saveAll(List.of(p1, p2, p3, p4));
            System.out.println("Données produits insérées !");
        }

        // Initialisation Admin
        if (userRepository.findByEmail("admin@universdesames.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@universdesames.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // Mot de passe par défaut
            admin.setFirstName("Admin");
            admin.setLastName("System");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Compte Admin créé : admin@universdesames.com / admin123");
        }
    }
}
