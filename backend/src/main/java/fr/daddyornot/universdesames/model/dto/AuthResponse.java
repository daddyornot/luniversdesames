package fr.daddyornot.universdesames.model.dto;

public record AuthResponse(
    String token,
    String email
    // Optionnel, pour afficher "Bonjour [Prénom]" sur le front
) {
}
