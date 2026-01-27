package fr.daddyornot.universdesames.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.daddyornot.universdesames.config.JwtFilter;
import fr.daddyornot.universdesames.config.WebSecurityConfig;
import fr.daddyornot.universdesames.model.ProductType;
import fr.daddyornot.universdesames.model.dto.ProductDTO;
import fr.daddyornot.universdesames.repository.UserRepository;
import fr.daddyornot.universdesames.service.JwtUtils;
import fr.daddyornot.universdesames.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
@Import({WebSecurityConfig.class, JwtFilter.class}) // Import de la config sécu pour que @Secured fonctionne
class ProductControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductService productService;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private JwtUtils jwtUtils; // Nécessaire car injecté dans JwtFilter

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldReturnAllProducts_PublicAccess() throws Exception {
        // GIVEN
        ProductDTO p1 = new ProductDTO(1L, "Pierre", "Desc", 10.0, List.of("Quartz"), "img.jpg", ProductType.PHYSICAL, null, null, null, null, null, null, null);
        given(productService.getAllProducts()).willReturn(List.of(p1));

        // WHEN & THEN
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Pierre"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
        // Simule un admin connecté
    void shouldCreateProduct_WhenAdmin() throws Exception {
        // GIVEN
        ProductDTO newProduct = new ProductDTO(null, "Nouveau", "Desc", 20.0, null, "img.jpg", ProductType.PHYSICAL, null, null, null, null, null, null, null);
        given(productService.saveProduct(any())).willReturn(new ProductDTO(1L, "Nouveau", "Desc", 20.0, null, "img.jpg", ProductType.PHYSICAL, null, null, null, null, null, null, null));

        // WHEN & THEN
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newProduct)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser(roles = "USER")
        // Simule un simple utilisateur
    void shouldForbidCreateProduct_WhenNotAdmin() throws Exception {
        // GIVEN
        ProductDTO newProduct = new ProductDTO(null, "Nouveau", "Desc", 20.0, null, "img.jpg", ProductType.PHYSICAL, null, null, null, null, null, null, null);

        // WHEN & THEN
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newProduct)))
                .andExpect(status().isForbidden()); // 403 attendu
    }

    // Helper pour matcher n'importe quel objet
    private ProductDTO any() {
        return org.mockito.ArgumentMatchers.any();
    }
}
