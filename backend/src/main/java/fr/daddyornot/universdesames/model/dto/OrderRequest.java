package fr.daddyornot.universdesames.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record OrderRequest(
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Le format de l'email est invalide")
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, example = "client@email.com")
    String customerEmail,

    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 50, message = "Le nom doit contenir entre 2 et 50 caractères")
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, example = "Jean Dupont")
    String customerName,

    @NotEmpty(message = "La commande ne peut pas être vide")
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "Contenu du panier")
    List<@Valid ItemRequest> items
) {
}
