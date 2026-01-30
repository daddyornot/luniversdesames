package fr.daddyornot.universdesames.model.dto;

import fr.daddyornot.universdesames.model.ProductType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record ProductDTO(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "ID unique du produit", example = "1")
    Long id,

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, example = "Bracelet Améthyste")
    String name,

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "Description détaillée en HTML ou texte brut")
    String description,

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, example = "29.99")
    Double price,

    @Schema(description = "Liste des pierres associées")
    List<StoneDTO> stones,

    @Schema(example = "https://storage.googleapis.com/bucket/image.jpg")
    String imageUrl,

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    ProductType type,

    @Schema(description = "Nombre de séances (pour les soins/coaching)")
    Integer sessionCount,

    @Schema(description = "Durée de validité en mois")
    Integer durationMonths,

    @Schema(description = "Liste des variantes associées à un service (prix, durée, nb de séances..)")
    List<ProductVariantDTO> variants,
    @Schema(description = "Liste des tailles associées et disponibles pour un produit (S, M, L...)")
    List<ProductSizeDTO> sizes,

    @Schema(description = "Temps de repos entre deux rendez-vous (minutes)")
    Integer bufferTimeMinutes,

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    Boolean isSubscription,

    @Schema(allowableValues = {"month", "year", "week"}, example = "month")
    String recurringInterval
) {}
