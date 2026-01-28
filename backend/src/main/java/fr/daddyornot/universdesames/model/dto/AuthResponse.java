package fr.daddyornot.universdesames.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record AuthResponse(
    @Schema(description = "JWT Token")
    String token,
    String email,
    String firstName,
    String lastName,
    @Schema(example = "ROLE_ADMIN")
    String role
) {}
