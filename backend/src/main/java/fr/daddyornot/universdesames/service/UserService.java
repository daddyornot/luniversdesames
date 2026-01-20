package fr.daddyornot.universdesames.service;

import fr.daddyornot.universdesames.model.User;
import fr.daddyornot.universdesames.model.dto.RegisterRequest;
import fr.daddyornot.universdesames.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void register(RegisterRequest request) {
        // 1. Vérifier si l'email existe déjà
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Cet email est déjà utilisé.");
        }

        // 2. Créer l'entité User
        User user = new User();
        user.setEmail(request.email());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());

        // 3. Hacher le mot de passe (IMPORTANT)
        user.setPassword(passwordEncoder.encode(request.password()));

        // 4. Sauvegarder
        userRepository.save(user);
    }
}