package fr.daddyornot.universdesames.repository;

import fr.daddyornot.universdesames.model.Product;
import fr.daddyornot.universdesames.model.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByType(ProductType type);
}
