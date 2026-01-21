package fr.daddyornot.universdesames.model.dto;

public record ProductVariantDTO(
    Long id,
    String label,
    Double price,
    Integer sessionCount,
    Integer durationMonths
) {}
