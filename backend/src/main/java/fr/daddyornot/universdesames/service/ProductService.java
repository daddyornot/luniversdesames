package fr.daddyornot.universdesames.service;

import fr.daddyornot.universdesames.model.Product;
import fr.daddyornot.universdesames.model.ProductSize;
import fr.daddyornot.universdesames.model.ProductType;
import fr.daddyornot.universdesames.model.ProductVariant;
import fr.daddyornot.universdesames.model.dto.ProductDTO;
import fr.daddyornot.universdesames.model.dto.ProductSizeDTO;
import fr.daddyornot.universdesames.model.dto.ProductVariantDTO;
import fr.daddyornot.universdesames.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsByType(ProductType type) {
        return productRepository.findByType(type).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getServices() {
        return productRepository.findByTypeNot(ProductType.PHYSICAL).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
    }

    @Transactional
    public ProductDTO saveProduct(ProductDTO productDTO) {
        Product product;
        if (productDTO.id() != null) {
            product = productRepository.findById(productDTO.id())
                    .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
        } else {
            product = new Product();
        }

        product.setName(productDTO.name());
        product.setDescription(productDTO.description());
        product.setPrice(productDTO.price());
        product.setStones(productDTO.stones());
        product.setImageUrl(productDTO.imageUrl());
        product.setType(productDTO.type());
        product.setSessionCount(productDTO.sessionCount());
        product.setDurationMonths(productDTO.durationMonths());

        // Gestion des variantes
        product.getVariants().clear();
        if (productDTO.variants() != null) {
            productDTO.variants().forEach(variantDTO -> {
                ProductVariant variant = new ProductVariant();
                variant.setLabel(variantDTO.label());
                variant.setPrice(variantDTO.price());
                variant.setDurationMonths(variantDTO.durationMonths());
                variant.setSessionCount(variantDTO.sessionCount());
                variant.setProduct(product);
                product.getVariants().add(variant);
            });
        }

        // Gestion des tailles
        product.getSizes().clear();
        if (productDTO.sizes() != null) {
            productDTO.sizes().forEach(sizeDTO -> {
                ProductSize size = new ProductSize();
                size.setLabel(sizeDTO.label());
                size.setDescription(sizeDTO.description());
                size.setProduct(product);
                product.getSizes().add(size);
            });
        }

        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    private ProductDTO convertToDto(Product product) {
        List<ProductVariantDTO> variantDTOs = product.getVariants().stream()
                .map(v -> new ProductVariantDTO(v.getId(), v.getLabel(), v.getPrice(), v.getDurationMonths(), v.getSessionCount()))
                .collect(Collectors.toList());

        List<ProductSizeDTO> sizeDTOs = product.getSizes().stream()
                .map(s -> new ProductSizeDTO(s.getId(), s.getLabel(), s.getDescription()))
                .collect(Collectors.toList());

        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStones(),
                product.getImageUrl(),
                product.getType(),
                product.getSessionCount(),
                product.getDurationMonths(),
                variantDTOs,
                sizeDTOs
        );
    }
}
