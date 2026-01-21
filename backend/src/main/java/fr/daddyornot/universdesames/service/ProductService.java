package fr.daddyornot.universdesames.service;

import fr.daddyornot.universdesames.model.Product;
import fr.daddyornot.universdesames.model.ProductType;
import fr.daddyornot.universdesames.model.ProductVariant;
import fr.daddyornot.universdesames.model.dto.ProductDTO;
import fr.daddyornot.universdesames.model.dto.ProductVariantDTO;
import fr.daddyornot.universdesames.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<ProductDTO> getProductsByType(ProductType type) {
        return productRepository.findByType(type)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<ProductDTO> getServices() {
        return productRepository.findByTypeNot(ProductType.PHYSICAL)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public ProductDTO getProductById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
        return mapToDTO(p);
    }

    @Transactional
    public ProductDTO saveProduct(ProductDTO dto) {
        Product p = new Product();
        if (dto.id() != null) {
            p = productRepository.findById(dto.id())
                    .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
        }

        p.setName(dto.name());
        p.setDescription(dto.description());
        p.setPrice(dto.price());
        p.setStone(dto.stone());
        p.setImageUrl(dto.imageUrl());
        p.setType(dto.type());
        p.setSessionCount(dto.sessionCount());
        p.setDurationMonths(dto.durationMonths());

        // Gestion des variantes
        if (dto.variants() != null) {
            p.getVariants().clear(); // On remplace tout (simplification)
            for (ProductVariantDTO vDto : dto.variants()) {
                ProductVariant v = new ProductVariant();
                v.setLabel(vDto.label());
                v.setPrice(vDto.price());
                v.setSessionCount(vDto.sessionCount());
                v.setDurationMonths(vDto.durationMonths());
                v.setProduct(p);
                p.getVariants().add(v);
            }
        }

        Product saved = productRepository.save(p);
        return mapToDTO(saved);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    private ProductDTO mapToDTO(Product p) {
        List<ProductVariantDTO> variants = p.getVariants().stream()
                .map(v -> new ProductVariantDTO(v.getId(), v.getLabel(), v.getPrice(), v.getSessionCount(), v.getDurationMonths()))
                .toList();

        return new ProductDTO(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getStone(),
                p.getImageUrl(),
                p.getType(),
                p.getSessionCount(),
                p.getDurationMonths(),
                variants
        );
    }
}
