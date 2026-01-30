package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.dto.ProductSizeDTO;
import fr.daddyornot.universdesames.service.ProductSizeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
    @Operation(operationId = "getAllSizes", summary = "Lister les tailles", responses = {
            @ApiResponse(responseCode = "200", description = "Liste des tailles",
                    content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ProductSizeDTO.class))))
    })
    public ResponseEntity<List<ProductSizeDTO>> getAllSizes() {
        return ResponseEntity.ok(productSizeService.getAllSizes());
    }

    @PostMapping
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "createSize", summary = "Créer une taille (Admin)", responses = {
            @ApiResponse(responseCode = "200", description = "Taille créée",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProductSizeDTO.class))),
            @ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<ProductSizeDTO> createSize(@RequestBody ProductSizeDTO dto) {
        return ResponseEntity.ok(productSizeService.createSize(dto));
    }

    @DeleteMapping("/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "deleteSizeById", summary = "Supprimer une taille (Admin)", responses = {
            @ApiResponse(responseCode = "204", description = "Taille supprimée"),
            @ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<Void> deleteSize(@PathVariable Long id) {
        productSizeService.deleteSize(id);
        return ResponseEntity.noContent().build();
    }
}
