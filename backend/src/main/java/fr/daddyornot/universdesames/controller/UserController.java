package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.dto.RegisterRequest;
import fr.daddyornot.universdesames.model.dto.UserDTO;
import fr.daddyornot.universdesames.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Secured("ROLE_ADMIN")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(operationId = "getAllUsers", summary = "Récupère tous les utilisateurs (Admin)", responses = {
            @ApiResponse(responseCode = "200", description = "Liste des utilisateurs",
                    content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = UserDTO.class)))),
            @ApiResponse(responseCode = "403", description = "Accès refusé (Admin uniquement)", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping
    @Operation(operationId = "createUser", summary = "Créer un utilisateur (Admin)", responses = {
            @ApiResponse(responseCode = "200", description = "Utilisateur créé"),
            @ApiResponse(responseCode = "400", description = "Données invalides", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<Void> createUser(@Valid @RequestBody RegisterRequest request) {
        userService.register(request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @Operation(operationId = "deleteUserById", summary = "Supprimer un utilisateur (Admin)", responses = {
            @ApiResponse(responseCode = "204", description = "Utilisateur supprimé"),
            @ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
