package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.dto.StoneDTO;
import fr.daddyornot.universdesames.service.StoneService;
import io.swagger.v3.oas.annotations.Operation;
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
    @Operation(operationId = "getAllStones")
    public ResponseEntity<List<StoneDTO>> getAllStones() {
        return ResponseEntity.ok(stoneService.getAllStones());
    }

    @PostMapping
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "createStone")
    public ResponseEntity<StoneDTO> createStone(@RequestBody StoneDTO dto) {
        return ResponseEntity.ok(stoneService.createStone(dto));
    }

    @DeleteMapping("/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "deleteStoneById")
    public ResponseEntity<Void> deleteStone(@PathVariable Long id) {
        stoneService.deleteStone(id);
        return ResponseEntity.noContent().build();
    }
}
