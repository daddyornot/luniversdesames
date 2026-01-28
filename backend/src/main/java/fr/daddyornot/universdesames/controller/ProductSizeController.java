package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.dto.ProductSizeDTO;
import fr.daddyornot.universdesames.service.ProductSizeService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sizes")
@RequiredArgsConstructor
public class ProductSizeController {
    private final ProductSizeService productSizeService;

    @GetMapping
    @Operation(operationId = "getAllSizes")
    public ResponseEntity<List<ProductSizeDTO>> getAllSizes() {
        return ResponseEntity.ok(productSizeService.getAllSizes());
    }

    @PostMapping
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "createSize")
    public ResponseEntity<ProductSizeDTO> createSize(@RequestBody ProductSizeDTO dto) {
        return ResponseEntity.ok(productSizeService.createSize(dto));
    }

    @DeleteMapping("/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "deleteSizeById")
    public ResponseEntity<Void> deleteSize(@PathVariable Long id) {
        productSizeService.deleteSize(id);
        return ResponseEntity.noContent().build();
    }
}
