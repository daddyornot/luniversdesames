package fr.daddyornot.universdesames.model.dto;

public record RegisterRequest(String email, String lastName, String firstName, String password) {
}
