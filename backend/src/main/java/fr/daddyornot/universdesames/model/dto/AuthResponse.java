package fr.daddyornot.universdesames.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record AuthResponse(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "JWT Token")
    String token,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String email,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String firstName,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String lastName,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, example = "ROLE_ADMIN")
    String role
) {
}
