package fr.daddyornot.universdesames.service;

import fr.daddyornot.universdesames.model.Product;
import fr.daddyornot.universdesames.model.dto.ProductDTO;
import fr.daddyornot.universdesames.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<ProductDTO> getAllBracelets() {
        return productRepository.findByCategory("bracelet")
                .stream()
                .map(p -> new ProductDTO(p.getId(), p.getName(), p.getDescription(),
                        p.getPrice(), p.getStone(), p.getImageUrl(), p.getCategory()))
                .toList();
    }

    public ProductDTO getProductById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
        return new ProductDTO(p.getId(), p.getName(), p.getDescription(),
                p.getPrice(), p.getStone(), p.getImageUrl(), p.getCategory());
    }
}