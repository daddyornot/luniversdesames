package fr.daddyornot.universdesames.model.dto;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "Représentation complète d'une commande pour le frontend")
public record OrderDTO(

        @NotNull
        @Schema(description = "ID unique de la commande", example = "1024")
        Long id,

        @NotNull
        @Schema(description = "Numéro de facture unique", example = "FAC-2024-001")
        String invoiceNumber,

        @NotBlank
        @Email
        @Schema(description = "Email du client lors de la commande", example = "client@exemple.com", requiredMode = Schema.RequiredMode.REQUIRED)
        String customerEmail,

        @NotBlank
        @Schema(description = "Nom complet du client", example = "Jean Dupont", requiredMode = Schema.RequiredMode.REQUIRED)
        String customerName,

        @NotNull
        @Schema(description = "Adresse de facturation")
        String billingAddress,

        @NotNull
        @Schema(description = "Ville de facturation")
        String billingCity,

        @NotNull
        @Schema(description = "Code postal de facturation")
        String billingPostalCode,

        @NotNull
        @Schema(description = "Pays de facturation", example = "France")
        String billingCountry,

        @NotNull
        @Schema(description = "Montant total TTC", example = "85.50", requiredMode = Schema.RequiredMode.REQUIRED)
        Double totalAmount,

        @NotNull
        @Schema(description = "Date et heure de création de la commande")
        LocalDateTime createdAt,

        @NotNull
        @ArraySchema(schema = @Schema(description = "Liste des articles commandés"))
        List<OrderItemDTO> items,

        // --- Champs Shipping (SendCloud) ---
        @Schema(description = "ID du colis SendCloud", example = "12345678")
        String sendCloudParcelId,

        @Schema(description = "Numéro de suivi du transporteur", example = "390012345678")
        String trackingNumber,

        @Schema(description = "Lien direct vers la page de suivi", example = "https://tracking.me/123")
        String trackingUrl,

        @Schema(description = "Statut de livraison", allowableValues = {"Created", "Announced", "Shipped", "Delivered"}, example = "Shipped")
        String shippingStatus,

        @Schema(description = "URL vers l'étiquette de transport PDF")
        String shippingLabelUrl
) {
}
