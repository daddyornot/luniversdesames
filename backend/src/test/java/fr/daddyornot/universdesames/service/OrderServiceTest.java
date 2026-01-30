package fr.daddyornot.universdesames.service;

import fr.daddyornot.universdesames.model.Order;
import fr.daddyornot.universdesames.model.Product;
import fr.daddyornot.universdesames.model.User;
import fr.daddyornot.universdesames.model.dto.ItemRequest;
import fr.daddyornot.universdesames.model.dto.OrderRequest;
import fr.daddyornot.universdesames.repository.OrderRepository;
import fr.daddyornot.universdesames.repository.ProductRepository;
import fr.daddyornot.universdesames.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private EmailService emailService;
    @Mock
    private GoogleCalendarService googleCalendarService;

    @InjectMocks
    private OrderService orderService;

    @Test
    void shouldCreateOrderSuccessfully() throws MessagingException {
        // GIVEN
        String userEmail = "test@test.com";
        User user = new User();
        user.setEmail(userEmail);
        user.setAddress("123 Rue Test");

        Product product = new Product();
        product.setId(1L);
        product.setPrice(50.0);
        product.setName("Soin Reiki");

        OrderRequest request = new OrderRequest(
                userEmail,
                "Test User",
                List.of(new ItemRequest(1L, 2, null, null)) // 2 articles à 50€
        );

        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            o.setId(123L); // Simule l'ID généré par la BDD
            return o;
        });

        // WHEN
        Order result = orderService.saveOrder(request, userEmail);

        // THEN
        assertNotNull(result);
        assertEquals(100.0, result.getTotalAmount()); // 2 * 50.0
        assertEquals("123 Rue Test", result.getBillingAddress()); // Adresse copiée
        
        // Vérifie que l'email a été envoyé
        verify(emailService, times(1)).sendHtmlEmail(any(), any(), any(), any());
        // Vérifie qu'aucun RDV n'a été créé (pas de date)
        verify(googleCalendarService, never()).createEvent(any(), any(), any(), any(), any());
    }

    @Test
    void shouldCreateCalendarEventWhenDateProvided() {
        // GIVEN
        String userEmail = "test@test.com";
        User user = new User();
        Product product = new Product();
        product.setId(1L);
        product.setPrice(50.0);
        product.setName("Guidance");

        ZonedDateTime rdvDate = ZonedDateTime.now().plusDays(1);

        OrderRequest request = new OrderRequest(
                userEmail,
                "Test User",
                List.of(new ItemRequest(1L, 1, rdvDate, null))
        );

        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        // WHEN
        orderService.saveOrder(request, userEmail);

        // THEN
        // Vérifie que le service de calendrier a bien été appelé
        verify(googleCalendarService, times(1)).createEvent(
                contains("RDV : Guidance"), // Vérifie le titre
                any(),
                eq(rdvDate.toLocalDateTime()),
                any(),
                eq(userEmail)
        );
    }
}
