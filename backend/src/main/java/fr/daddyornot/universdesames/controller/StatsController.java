package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.dto.DashboardStats;
import fr.daddyornot.universdesames.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Secured("ROLE_ADMIN")
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/dashboard")
    @Operation(operationId = "getDashboardStats", summary = "Statistiques du dashboard (Admin)", responses = {
            @ApiResponse(responseCode = "200", description = "Statistiques récupérées",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = DashboardStats.class))),
            @ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<DashboardStats> getDashboardStats(@RequestParam(defaultValue = "CURRENT_MONTH") String period) {
        return ResponseEntity.ok(statsService.getStats(period));
    }
}
