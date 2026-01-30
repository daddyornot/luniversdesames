package fr.daddyornot.universdesames.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record LoginRequest(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String email,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String password
) {
}
