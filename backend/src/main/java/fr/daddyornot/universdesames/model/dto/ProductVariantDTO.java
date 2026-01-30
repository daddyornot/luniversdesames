package fr.daddyornot.universdesames.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record ProductVariantDTO(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    Long id,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String label,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    Double price,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    Integer sessionCount,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    Integer durationMonths
) {}
