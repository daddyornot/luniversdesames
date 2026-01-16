package fr.daddyornot.universdesames.model.dto;

public record ProductDTO(
        Long id,
        String name,
        String description,
        Double price,
        String stone,
        String imageUrl,
        String category
) {}