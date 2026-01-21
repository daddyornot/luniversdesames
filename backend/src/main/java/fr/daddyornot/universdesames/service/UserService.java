package fr.daddyornot.universdesames.service;

import fr.daddyornot.universdesames.model.User;
import fr.daddyornot.universdesames.model.dto.RegisterRequest;
import fr.daddyornot.universdesames.model.dto.UserDTO;
import fr.daddyornot.universdesames.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Cet email est déjà utilisé.");
        }

        User user = new User();
        user.setEmail(request.email());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPassword(passwordEncoder.encode(request.password()));
        
        // Nouveaux champs
        user.setPhone(request.phone());
        user.setAddress(request.address());
        user.setCity(request.city());
        user.setPostalCode(request.postalCode());
        user.setCountry(request.country());

        userRepository.save(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public UserDTO getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return mapToDTO(user);
    }

    public UserDTO updateProfile(String email, UserDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setPhone(dto.phone());
        user.setAddress(dto.address());
        user.setCity(dto.city());
        user.setPostalCode(dto.postalCode());
        user.setCountry(dto.country());

        return mapToDTO(userRepository.save(user));
    }

    private UserDTO mapToDTO(User user) {
        return new UserDTO(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhone(),
            user.getAddress(),
            user.getCity(),
            user.getPostalCode(),
            user.getCountry()
        );
    }
}
