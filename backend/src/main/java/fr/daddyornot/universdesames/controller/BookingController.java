package fr.daddyornot.universdesames.controller;

import com.google.api.services.calendar.model.Event;
import fr.daddyornot.universdesames.service.GoogleCalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {

    private final GoogleCalendarService googleCalendarService;

    @GetMapping("/slots")
    public ResponseEntity<List<String>> getAvailableSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false, defaultValue = "0") Integer bufferMinutes) {
        
        LocalDateTime start = date.atTime(9, 0);
        LocalDateTime end = date.atTime(18, 0);

        return ResponseEntity.ok(googleCalendarService.getAvailableSlots(start, end, bufferMinutes));
    }

    @GetMapping("/events")
    @Secured("ROLE_ADMIN") // À décommenter quand la sécurité sera active
    public ResponseEntity<List<Event>> getEvents(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        return ResponseEntity.ok(googleCalendarService.getEvents(start.atStartOfDay(), end.atTime(23, 59)));
    }
}
