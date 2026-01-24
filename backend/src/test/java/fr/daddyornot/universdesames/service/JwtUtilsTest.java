package fr.daddyornot.universdesames.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        // On injecte une clé secrète pour le test (normalement via @Value)
        ReflectionTestUtils.setField(jwtUtils, "secretKey", "maSuperCleSecretePourLesTestsUnitairesDePlusDe256Bits");
        ReflectionTestUtils.setField(jwtUtils, "expirationTime", 3600000L); // 1h
        jwtUtils.init(); // Important pour initialiser la clé HMAC
    }

    @Test
    void shouldGenerateAndValidateToken() {
        String email = "test@test.com";
        
        // Generate
        String token = jwtUtils.generateToken(email);
        assertNotNull(token);

        // Validate
        assertTrue(jwtUtils.validateToken(token));
        assertEquals(email, jwtUtils.getEmailFromToken(token));
    }

    @Test
    void shouldFailValidation_WhenTokenIsInvalid() {
        assertFalse(jwtUtils.validateToken("invalid.token.here"));
    }
}
