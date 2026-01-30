package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.dto.StoneDTO;
import fr.daddyornot.universdesames.service.StoneService;
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
@RequestMapping("/api/stones")
@RequiredArgsConstructor
public class StoneController {
    private final StoneService stoneService;

    @GetMapping
    @Operation(operationId = "getAllStones", summary = "Lister les pierres", responses = {
            @ApiResponse(responseCode = "200", description = "Liste des pierres",
                    content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = StoneDTO.class))))
    })
    public ResponseEntity<List<StoneDTO>> getAllStones() {
        return ResponseEntity.ok(stoneService.getAllStones());
    }

    @PostMapping
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "createStone", summary = "Créer une pierre (Admin)", responses = {
            @ApiResponse(responseCode = "200", description = "Pierre créée",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = StoneDTO.class))),
            @ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<StoneDTO> createStone(@RequestBody StoneDTO dto) {
        return ResponseEntity.ok(stoneService.createStone(dto));
    }

    @DeleteMapping("/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "deleteStoneById", summary = "Supprimer une pierre (Admin)", responses = {
            @ApiResponse(responseCode = "204", description = "Pierre supprimée"),
            @ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<Void> deleteStone(@PathVariable Long id) {
        stoneService.deleteStone(id);
        return ResponseEntity.noContent().build();
    }
}
