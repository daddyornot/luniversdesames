package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.dto.AuthResponse;
import fr.daddyornot.universdesames.model.dto.LoginRequest;
import fr.daddyornot.universdesames.service.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // 1. Vérifier email et password
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password())
        );

        // 2. Si c'est bon, générer le token
        String jwt = jwtUtils.generateToken(authentication.getName());

        // 3. Renvoyer le token au Front
        return ResponseEntity.ok(new AuthResponse(jwt, authentication.getName()));
    }
}
