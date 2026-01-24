package fr.daddyornot.universdesames.service;

import fr.daddyornot.universdesames.model.User;
import fr.daddyornot.universdesames.model.dto.RegisterRequest;
import fr.daddyornot.universdesames.model.dto.UserDTO;
import fr.daddyornot.universdesames.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldRegisterUserSuccessfully() {
        // GIVEN
        RegisterRequest request = new RegisterRequest(
                "new@test.com", "password123", "John", "Doe",
                "0600000000", "1 Rue Test", "Paris", "75000", "France"
        );

        when(userRepository.findByEmail(request.email())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.password())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        // WHEN
        userService.register(request);

        // THEN
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldThrowException_WhenEmailAlreadyExists() {
        // GIVEN
        RegisterRequest request = new RegisterRequest(
                "existing@test.com", "password123", "John", "Doe",
                null, null, null, null, null
        );

        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(new User()));

        // WHEN & THEN
        assertThrows(RuntimeException.class, () -> userService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldUpdateProfile() {
        // GIVEN
        String email = "user@test.com";
        User existingUser = new User();
        existingUser.setEmail(email);
        existingUser.setFirstName("OldName");

        UserDTO updateDto = new UserDTO(
                1L, email, "NewName", "NewLast",
                "0699999999", "New Address", "Lyon", "69000", "France"
        );

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        // WHEN
        UserDTO result = userService.updateProfile(email, updateDto);

        // THEN
        assertEquals("NewName", result.firstName());
        assertEquals("Lyon", result.city());
    }
}
