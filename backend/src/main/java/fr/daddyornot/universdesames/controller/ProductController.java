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
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/physical")
    public ResponseEntity<List<ProductDTO>> getAllPhysicalProducts() {
        return ResponseEntity.ok(productService.getProductsByType(ProductType.PHYSICAL));
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
    @Secured("ROLE_ADMIN")
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.saveProduct(productDTO));
    }

    @PutMapping("/{id}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        ProductDTO toSave = new ProductDTO(
                id,
                productDTO.name(),
                productDTO.description(),
                productDTO.price(),
                productDTO.stones(),
                productDTO.imageUrl(),
                productDTO.type(),
                productDTO.sessionCount(),
                productDTO.durationMonths(),
                productDTO.variants(),
                productDTO.sizes(),
                productDTO.bufferTimeMinutes(),
                productDTO.isSubscription(),
                productDTO.recurringInterval()
        );
        return ResponseEntity.ok(productService.saveProduct(toSave));
    }

    @DeleteMapping("/{id}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
