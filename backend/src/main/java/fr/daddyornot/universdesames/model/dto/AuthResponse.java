package fr.daddyornot.universdesames.model.dto;

public record AuthResponse(
        String token,
        String email,
        String firstName,
        String lastName
) {
}
