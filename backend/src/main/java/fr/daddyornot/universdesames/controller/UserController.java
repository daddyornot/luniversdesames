package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.dto.RegisterRequest;
import fr.daddyornot.universdesames.model.dto.UserDTO;
import fr.daddyornot.universdesames.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
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
    @Operation(operationId = "getAllUsers")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping
    @Operation(operationId = "createUser")
    public ResponseEntity<Void> createUser(@Valid @RequestBody RegisterRequest request) {
        userService.register(request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @Operation(operationId = "deleteUserById")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
