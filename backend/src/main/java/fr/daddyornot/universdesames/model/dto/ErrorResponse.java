package fr.daddyornot.universdesames.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record ErrorResponse(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    LocalDateTime timestamp,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    int status,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String error,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String message,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String path
) {}
