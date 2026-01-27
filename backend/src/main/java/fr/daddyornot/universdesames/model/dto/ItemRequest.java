package fr.daddyornot.universdesames.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.ZonedDateTime;

public record ItemRequest(
    @NotNull(message = "L'ID du produit est requis")
    Long productId,

    @Min(value = 1, message = "La quantité minimum est de 1")
    Integer quantity,

    ZonedDateTime appointmentDate // Optionnel, uniquement pour les services
) {
}
