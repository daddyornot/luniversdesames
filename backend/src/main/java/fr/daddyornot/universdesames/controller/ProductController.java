package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.ProductType;
import fr.daddyornot.universdesames.model.dto.ProductDTO;
import fr.daddyornot.universdesames.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts(@RequestParam(required = false) ProductType type) {
        if (type != null) {
            return ResponseEntity.ok(productService.getProductsByType(type));
        }
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/services")
    public ResponseEntity<List<ProductDTO>> getAllServices() {
        return ResponseEntity.ok(productService.getServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    // @Secured("ROLE_ADMIN") // À décommenter quand vous aurez géré les rôles
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.saveProduct(productDTO));
    }

    @PutMapping("/{id}")
    // @Secured("ROLE_ADMIN")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        // On s'assure que l'ID du DTO correspond à l'URL
        ProductDTO toSave = new ProductDTO(
                id,
                productDTO.name(),
                productDTO.description(),
                productDTO.price(),
                productDTO.stone(),
                productDTO.imageUrl(),
                productDTO.type(),
                productDTO.sessionCount(),
                productDTO.durationMonths(),
                productDTO.variants()
        );
        return ResponseEntity.ok(productService.saveProduct(toSave));
    }

    @DeleteMapping("/{id}")
    // @Secured("ROLE_ADMIN")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
