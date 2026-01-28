package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.dto.StoneDTO;
import fr.daddyornot.universdesames.service.StoneService;
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
    public ResponseEntity<List<StoneDTO>> getAllStones() {
        return ResponseEntity.ok(stoneService.getAllStones());
    }

    @PostMapping
    @Secured("ROLE_ADMIN")
    public ResponseEntity<StoneDTO> createStone(@RequestBody StoneDTO dto) {
        return ResponseEntity.ok(stoneService.createStone(dto));
    }

    @DeleteMapping("/{id}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<Void> deleteStone(@PathVariable Long id) {
        stoneService.deleteStone(id);
        return ResponseEntity.noContent().build();
    }
}
