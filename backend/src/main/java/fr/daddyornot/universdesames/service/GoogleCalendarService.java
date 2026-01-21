package fr.daddyornot.universdesames.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleCalendarService {

    private static final String APPLICATION_NAME = "Univers des Ames";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String TIMEZONE = "Europe/Paris";

    @Value("${google.calendar.primary-id}")
    private String primaryCalendarId;

    @Value("#{'${google.calendar.check-ids}'.split(',')}") 
    private List<String> calendarsToCheck;

    @Value("${google.credentials.path}")
    private String credentialsPath;

    @PostConstruct
    public void debugCalendars() {
        try {
            System.out.println("=== DEBUG GOOGLE CALENDAR ACCESS ===");
            Calendar service = getCalendarService();
            
            CalendarList calendarList = service.calendarList().list().execute();
            List<CalendarListEntry> items = calendarList.getItems();

            if (items.isEmpty()) {
                System.out.println("⚠️ AUCUN calendrier trouvé ! Le robot n'a accès à rien.");
            } else {
                System.out.println("✅ Calendriers accessibles par le robot :");
                for (CalendarListEntry calendar : items) {
                    System.out.println("- " + calendar.getSummary() + " (ID: " + calendar.getId() + ")");
                }
            }
            
            System.out.println("--- Vérification des calendriers configurés ---");
            if (calendarsToCheck != null) {
                for (String calId : calendarsToCheck) {
                    checkAccess(service, calId.trim());
                }
            }
            
            System.out.println("====================================");
        } catch (Exception e) {
            System.err.println("❌ Erreur critique lors du test d'accès : " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void checkAccess(Calendar service, String calendarId) {
        try {
            service.calendars().get(calendarId).execute();
            System.out.println("✅ Accès OK : " + calendarId);
        } catch (Exception e) {
            System.err.println("❌ ÉCHEC d'accès : " + calendarId + " (" + e.getMessage() + ")");
        }
    }

    private Calendar getCalendarService() throws GeneralSecurityException, IOException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        
        List<String> scopes = List.of(
                "https://www.googleapis.com/auth/calendar",
                "https://www.googleapis.com/auth/calendar.events"
        );

        InputStream credentialStream = getCredentialInputStream();
        
        GoogleCredential credential = GoogleCredential.fromStream(credentialStream)
                .createScoped(scopes);

        return new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    private InputStream getCredentialInputStream() throws IOException {
        try {
            return new FileInputStream(credentialsPath);
        } catch (IOException e) {
            try {
                return new ClassPathResource(credentialsPath).getInputStream();
            } catch (IOException ex) {
                try {
                    return new ClassPathResource("credentials.json").getInputStream();
                } catch (IOException ex2) {
                    throw new IOException("Impossible de trouver le fichier credentials.json");
                }
            }
        }
    }

    public List<String> getAvailableSlots(LocalDateTime start, LocalDateTime end, Integer bufferMinutes) {
        try {
            Calendar service = getCalendarService();

            ZonedDateTime zonedStart = start.atZone(ZoneId.of(TIMEZONE));
            ZonedDateTime zonedEnd = end.atZone(ZoneId.of(TIMEZONE));

            FreeBusyRequest request = new FreeBusyRequest();
            request.setTimeMin(new DateTime(zonedStart.toInstant().toEpochMilli()));
            request.setTimeMax(new DateTime(zonedEnd.toInstant().toEpochMilli()));
            request.setTimeZone(TIMEZONE);
            
            List<FreeBusyRequestItem> items = new ArrayList<>();
            if (calendarsToCheck != null) {
                for (String calId : calendarsToCheck) {
                    items.add(new FreeBusyRequestItem().setId(calId.trim()));
                }
            }
            request.setItems(items);

            FreeBusyResponse response = service.freebusy().query(request).execute();
            
            List<TimePeriod> allBusyPeriods = new ArrayList<>();
            
            if (calendarsToCheck != null) {
                for (String calId : calendarsToCheck) {
                    String cleanId = calId.trim();
                    if (response.getCalendars().get(cleanId) != null) {
                        List<TimePeriod> busy = response.getCalendars().get(cleanId).getBusy();
                        if (busy != null) {
                            allBusyPeriods.addAll(busy);
                        }
                    }
                }
            }

            return calculateFreeSlots(start, end, allBusyPeriods, bufferMinutes);

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    public void createEvent(String summary, String description, LocalDateTime start, LocalDateTime end, String attendeeEmail) {
        try {
            Calendar service = getCalendarService();

            Event event = new Event()
                    .setSummary(summary)
                    .setDescription(description);

            ZonedDateTime zonedStart = start.atZone(ZoneId.of(TIMEZONE));
            ZonedDateTime zonedEnd = end.atZone(ZoneId.of(TIMEZONE));

            EventDateTime startEvent = new EventDateTime()
                    .setDateTime(new DateTime(zonedStart.toInstant().toEpochMilli()))
                    .setTimeZone(TIMEZONE);
            event.setStart(startEvent);

            EventDateTime endEvent = new EventDateTime()
                    .setDateTime(new DateTime(zonedEnd.toInstant().toEpochMilli()))
                    .setTimeZone(TIMEZONE);
            event.setEnd(endEvent);

            if (attendeeEmail != null && !attendeeEmail.isEmpty()) {
                EventAttendee[] attendees = new EventAttendee[] {
                    new EventAttendee().setEmail(attendeeEmail)
                };
                event.setAttendees(List.of(attendees));
            }

            service.events().insert(primaryCalendarId, event).execute();
            System.out.println("Événement créé sur le calendrier : " + primaryCalendarId);

        } catch (Exception e) {
            System.err.println("Erreur lors de la création de l'événement Google Calendar : " + e.getMessage());
        }
    }

    private List<String> calculateFreeSlots(LocalDateTime start, LocalDateTime end, List<TimePeriod> busyPeriods, Integer bufferMinutes) {
        List<String> freeSlots = new ArrayList<>();
        LocalDateTime currentSlot = start;
        ZoneId zone = ZoneId.of(TIMEZONE);

        while (currentSlot.plusHours(1).isBefore(end) || currentSlot.plusHours(1).isEqual(end)) {
            // On calcule la plage nécessaire : [Début - Buffer] à [Fin + Buffer]
            long requiredStart = currentSlot.minusMinutes(bufferMinutes).atZone(zone).toInstant().toEpochMilli();
            long requiredEnd = currentSlot.plusHours(1).plusMinutes(bufferMinutes).atZone(zone).toInstant().toEpochMilli();

            boolean isBusy = false;
            
            if (busyPeriods != null) {
                for (TimePeriod busy : busyPeriods) {
                    long busyStart = busy.getStart().getValue();
                    long busyEnd = busy.getEnd().getValue();

                    // Si la plage nécessaire chevauche une période occupée
                    if (requiredStart < busyEnd && requiredEnd > busyStart) {
                        isBusy = true;
                        break;
                    }
                }
            }

            if (!isBusy) {
                freeSlots.add(currentSlot.atZone(zone).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
            }

            currentSlot = currentSlot.plusHours(1);
        }

        return freeSlots;
    }
}
