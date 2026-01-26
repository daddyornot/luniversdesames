package fr.daddyornot.universdesames.model.dto;

import fr.daddyornot.universdesames.model.ProductType;

import java.util.List;

public record ProductDTO(
    Long id,
    String name,
    String description,
    Double price,
    List<String> stones,
    String imageUrl,
    ProductType type,
    Integer sessionCount,
    Integer durationMonths,
    List<ProductVariantDTO> variants,
    List<ProductSizeDTO> sizes
) {
}
