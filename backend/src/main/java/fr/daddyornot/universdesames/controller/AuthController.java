package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.User;
import fr.daddyornot.universdesames.model.dto.AuthResponse;
import fr.daddyornot.universdesames.model.dto.LoginRequest;
import fr.daddyornot.universdesames.model.dto.RegisterRequest;
import fr.daddyornot.universdesames.model.dto.UserDTO;
import fr.daddyornot.universdesames.service.JwtUtils;
import fr.daddyornot.universdesames.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    private final UserService userService;

    @PostMapping("/register")
    @Operation(operationId = "register", summary = "Inscription d'un nouvel utilisateur", responses = {
            @ApiResponse(responseCode = "200", description = "Utilisateur enregistré avec succès",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "400", description = "Données invalides", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        userService.register(registerRequest);
        return ResponseEntity.ok().body(Map.of("message", "Utilisateur enregistré avec succès !"));
    }

    @PostMapping("/login")
    @Operation(operationId = "login", summary = "Authentification", responses = {
        @ApiResponse(
            responseCode = "200",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = AuthResponse.class)
            )
        ),
        @ApiResponse(responseCode = "401", description = "Identifiants incorrects", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password())
        );

        String jwt = jwtUtils.generateToken(authentication.getName());
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(new AuthResponse(jwt, user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole()));
    }

    @GetMapping("/profile")
    @Operation(operationId = "getCurrentUserProfile", summary = "Récupère le profil de l'utilisateur connecté", responses = {
            @ApiResponse(responseCode = "200", description = "Profil récupéré avec succès", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserDTO.class))),
            @ApiResponse(responseCode = "403", description = "Non authentifié", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<UserDTO> getProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getProfile(authentication.getName()));
    }

    @PutMapping("/profile")
    @Operation(operationId = "updateCurrentUserProfile", summary = "Met à jour le profil connecté", responses = {
            @ApiResponse(responseCode = "200", description = "Profil mis à jour", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserDTO.class))),
            @ApiResponse(responseCode = "403", description = "Non authentifié", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<UserDTO> updateProfile(Authentication authentication, @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateProfile(authentication.getName(), userDTO));
    }
}
