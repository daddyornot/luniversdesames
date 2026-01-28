package fr.daddyornot.universdesames.config;

import fr.daddyornot.universdesames.model.*;
import fr.daddyornot.universdesames.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final ProductSizeRepository productSizeRepository;
    private final StoneRepository stoneRepository; // Nouveau repo
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // DELETE ALL (Attention en prod, à commenter ou sécuriser)
        // orderRepository.deleteAll();
        // productRepository.deleteAll();
        // productSizeRepository.deleteAll();
        // stoneRepository.deleteAll();
        // userRepository.deleteAll();

        // Initialisation des Tailles de Référence
        if (productSizeRepository.count() == 0) {
            createSize("XS", "15cm, poignet très fin");
            createSize("S", "16cm, poignet fin");
            createSize("M", "17cm, poignet standard");
            createSize("L", "18cm, poignet fort");
            createSize("XL", "19cm, poignet très fort");
            createSize("Unique", "Taille ajustable");
            System.out.println("Tailles de référence créées !");
        }

        // Initialisation des Pierres de Référence
        if (stoneRepository.count() == 0) {
            createStone("Améthyste", "Pierre de la sagesse et de l'humilité. Favorise l'élévation spirituelle.");
            createStone("Quartz", "Amplificateur d'énergie et de pensée.");
            createStone("Œil de Tigre", "Pierre de protection contre les énergies négatives.");
            createStone("Labradorite", "Pierre de protection des thérapeutes.");
            createStone("Pierre de Lune", "Pierre de la féminité et de l'intuition.");
            System.out.println("Pierres de référence créées !");
        }

        // Initialisation Produits
        if (productRepository.count() == 0) {
            ProductSize sizeS = productSizeRepository.findAll().stream().filter(s -> s.getLabel().equals("S")).findFirst().orElseThrow();
            ProductSize sizeM = productSizeRepository.findAll().stream().filter(s -> s.getLabel().equals("M")).findFirst().orElseThrow();
            ProductSize sizeUnique = productSizeRepository.findAll().stream().filter(s -> s.getLabel().equals("Unique")).findFirst().orElseThrow();

            Stone amethyste = stoneRepository.findByName("Améthyste").orElseThrow();
            Stone quartz = stoneRepository.findByName("Quartz").orElseThrow();
            Stone oeilTigre = stoneRepository.findByName("Œil de Tigre").orElseThrow();

            Product p1 = new Product();
            p1.setName("Bracelet Améthyste");
            p1.setDescription("Pierre de la sagesse et de l'humilité. Favorise l'élévation spirituelle, la concentration et la méditation.");
            p1.setPrice(25.0);
            p1.setStones(List.of(amethyste, quartz)); // ManyToMany
            p1.setType(ProductType.PHYSICAL);
            p1.setImageUrl("assets/images/alexey-demidov-QRnUMyfhpgA-unsplash.jpg");
            p1.setSizes(List.of(sizeS, sizeM)); // ManyToMany

            Product p2 = new Product();
            p2.setName("Bracelet Œil de Tigre");
            p2.setDescription("Pierre de protection. Renvoie les énergies négatives vers son émetteur.");
            p2.setPrice(22.0);
            p2.setStones(List.of(oeilTigre));
            p2.setType(ProductType.PHYSICAL);
            p2.setImageUrl("assets/images/alexey-demidov-WTKBeM7rGQE-unsplash.jpg");
            p2.setSizes(List.of(sizeUnique));

            Product p3 = new Product();
            p3.setName("Guidance Spirituelle");
            p3.setDescription("Séance de guidance spirituelle personnalisée de 1h.");
            p3.setPrice(60.0);
            p3.setType(ProductType.ENERGY_CARE);
            p3.setSessionCount(1);
            p3.setImageUrl("assets/images/wellness-285590_1280.jpg");
            p3.setBufferTimeMinutes(15);

            // Produit avec variantes
            Product p4 = new Product();
            p4.setName("Coaching Transformation");
            p4.setDescription("Accompagnement complet pour transformer votre vie.");
            p4.setPrice(150.0); // Prix "à partir de"
            p4.setType(ProductType.COACHING);
            p4.setImageUrl("assets/images/hoylee-song-TsbJvGJ0RwY-unsplash.jpg");
            p4.setBufferTimeMinutes(30);

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

            // --- NOUVEAU PRODUIT ABONNEMENT ---
            Product p5 = new Product();
            p5.setName("Cercle des Âmes (Abonnement)");
            p5.setDescription("Accès illimité aux méditations guidées et 1 soin collectif par mois.");
            p5.setPrice(29.90);
            p5.setType(ProductType.ENERGY_CARE);
            p5.setImageUrl("assets/images/astrology-993127_1280.jpg");
            p5.setSubscription(true);
            p5.setRecurringInterval("month");

            productRepository.saveAll(List.of(p1, p2, p3, p4, p5));
            System.out.println("Données produits insérées !");
        }

        // Initialisation Admin
        if (userRepository.findByEmail("admin@universdesames.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@universdesames.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("System");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Compte Admin créé : admin@universdesames.com / admin123");
        }
    }

    private void createSize(String label, String description) {
        ProductSize size = new ProductSize();
        size.setLabel(label);
        size.setDescription(description);
        productSizeRepository.save(size);
    }

    private void createStone(String name, String description) {
        Stone stone = new Stone();
        stone.setName(name);
        stone.setDescription(description);
        stoneRepository.save(stone);
    }
}
