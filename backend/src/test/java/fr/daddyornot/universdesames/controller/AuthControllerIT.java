package fr.daddyornot.universdesames.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.daddyornot.universdesames.config.JwtFilter;
import fr.daddyornot.universdesames.config.WebSecurityConfig;
import fr.daddyornot.universdesames.model.User;
import fr.daddyornot.universdesames.model.dto.LoginRequest;
import fr.daddyornot.universdesames.repository.UserRepository;
import fr.daddyornot.universdesames.service.JwtUtils;
import fr.daddyornot.universdesames.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import({WebSecurityConfig.class, JwtFilter.class})
class AuthControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private AuthenticationManager authenticationManager; // Mock du manager Spring Security

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldLoginSuccessfully() throws Exception {
        // GIVEN
        LoginRequest loginRequest = new LoginRequest("user@test.com", "password");
        
        Authentication authMock = mock(Authentication.class);
        User userMock = new User();
        userMock.setEmail("user@test.com");
        userMock.setFirstName("John");
        userMock.setRole("USER");
        
        when(authMock.getName()).thenReturn("user@test.com");
        when(authMock.getPrincipal()).thenReturn(userMock);
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authMock);
        
        when(jwtUtils.generateToken("user@test.com")).thenReturn("fake-jwt-token");

        // WHEN & THEN
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"))
                .andExpect(jsonPath("$.email").value("user@test.com"));
    }
}
