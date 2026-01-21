package fr.daddyornot.universdesames.model.dto;

public record UserDTO(
    Long id,
    String email,
    String firstName,
    String lastName,
    String phone,
    String address,
    String city,
    String postalCode,
    String country
) {}
