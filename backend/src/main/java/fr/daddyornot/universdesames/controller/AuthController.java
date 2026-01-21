package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.User;
import fr.daddyornot.universdesames.model.dto.AuthResponse;
import fr.daddyornot.universdesames.model.dto.LoginRequest;
import fr.daddyornot.universdesames.model.dto.RegisterRequest;
import fr.daddyornot.universdesames.service.JwtUtils;
import fr.daddyornot.universdesames.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService userService; // Ajout du service

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        userService.register(registerRequest);
        // Le front s'attend potentiellement à un JSON, même simple
        return ResponseEntity.ok().body(Map.of("message", "Utilisateur enregistré avec succès !"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password())
        );

        String jwt = jwtUtils.generateToken(authentication.getName());

        // On récupère l'utilisateur pour renvoyer son prénom au Front
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(new AuthResponse(jwt, user.getEmail(), user.getFirstName()));
    }
}