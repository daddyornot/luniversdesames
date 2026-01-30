package fr.daddyornot.universdesames.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record UserDTO(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    Long id,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String email,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String firstName,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String lastName,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String phone,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String address,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String city,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String postalCode,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String country
) {}
