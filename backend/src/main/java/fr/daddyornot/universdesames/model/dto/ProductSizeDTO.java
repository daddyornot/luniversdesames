package fr.daddyornot.universdesames.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record ProductSizeDTO(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    Long id,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, example = "S, M...")
    String label,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, example = "14cm - Poignet fin")
    String description
) {}
