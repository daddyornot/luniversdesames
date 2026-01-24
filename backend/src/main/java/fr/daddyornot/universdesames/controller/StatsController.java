package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.model.dto.DashboardStats;
import fr.daddyornot.universdesames.service.StatsService;
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
    public ResponseEntity<DashboardStats> getDashboardStats(@RequestParam(defaultValue = "CURRENT_MONTH") String period) {
        return ResponseEntity.ok(statsService.getStats(period));
    }
}
