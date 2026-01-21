package fr.daddyornot.universdesames.model.dto;

public record RegisterRequest(
    String email, 
    String password,
    String firstName, 
    String lastName,
    String phone,
    String address,
    String city,
    String postalCode,
    String country
) {}
