package fr.daddyornot.universdesames.service;

import fr.daddyornot.universdesames.model.User;
import fr.daddyornot.universdesames.model.dto.RegisterRequest;
import fr.daddyornot.universdesames.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void register(RegisterRequest request) {
        User user = new User();
        user.setEmail(request.email());
        user.setFirstName(request.firstName());

        // On ne stocke jamais "123456", mais "$2a$10$..."
        user.setPassword(passwordEncoder.encode(request.password()));

        userRepository.save(user);
    }
}
