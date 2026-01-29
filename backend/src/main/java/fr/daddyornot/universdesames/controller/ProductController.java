package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.ProductType;
import fr.daddyornot.universdesames.model.dto.ProductDTO;
import fr.daddyornot.universdesames.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    @Operation(operationId = "getAllProducts",
        responses = {
            @ApiResponse(responseCode = "200", content = @Content(mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = ProductDTO.class))))
        }
    )
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/physical")
    @Operation(operationId = "getAllPhysicalProducts",
        responses = {
            @ApiResponse(responseCode = "200", content = @Content(mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = ProductDTO.class))))
        }
    )
    public ResponseEntity<List<ProductDTO>> getAllPhysicalProducts() {
        return ResponseEntity.ok(productService.getProductsByType(ProductType.PHYSICAL));
    }

    @GetMapping("/services")
    @Operation(operationId = "getAllServices",
        responses = {
            @ApiResponse(responseCode = "200", content = @Content(mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = ProductDTO.class))))
        }
    )
    public ResponseEntity<List<ProductDTO>> getAllServices() {
        return ResponseEntity.ok(productService.getServices());
    }

    @GetMapping("/{id}")
    @Operation(operationId = "getProductById",
        responses = {
            @ApiResponse(responseCode = "200", content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ProductDTO.class))),
        }
    )
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "createProduct",
        responses = {
            @ApiResponse(responseCode = "200", content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ProductDTO.class))),
        }
    )
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.saveProduct(productDTO));
    }

    @PutMapping("/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "updateProduct",
        responses = {
            @ApiResponse(responseCode = "200", content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ProductDTO.class))),
        }
    )
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
    @Operation(operationId = "deleteProductById")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
