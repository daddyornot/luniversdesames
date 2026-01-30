package fr.daddyornot.universdesames.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.ZonedDateTime;

@Schema(description = "Détails d'un article dans une commande")
public record OrderItemDTO(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "ID de l'article de commande", example = "101")
    Long id,

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "ID du produit correspondant", example = "1")
    Long productId,

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "Nom du produit au moment de l'achat", example = "Bracelet Améthyste")
    String productName,

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "Quantité achetée", example = "2")
    Integer quantity,

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "Prix unitaire du produit au moment de l'achat", example = "25.0")
    Double priceAtPurchase,

    @Schema(description = "Date du rendez-vous (pour les services)", example = "2026-01-27T09:00:00+01:00", nullable = true)
    ZonedDateTime appointmentDate,

    @Schema(description = "Label de la taille sélectionnée (pour les produits physiques)", example = "M", nullable = true)
    String sizeLabel,

    @Schema(description = "Description de la taille sélectionnée", example = "17cm, poignet standard", nullable = true)
    String sizeDescription
) {
}
