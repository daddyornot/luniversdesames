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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
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
    private static final Logger log = LoggerFactory.getLogger(GoogleCalendarService.class);

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
            log.info("=== DEBUG GOOGLE CALENDAR ACCESS ===");
            Calendar service = getCalendarService();
            
            CalendarList calendarList = service.calendarList().list().execute();
            List<CalendarListEntry> items = calendarList.getItems();

            if (items.isEmpty()) {
                log.warn("⚠️ AUCUN calendrier trouvé ! Le robot n'a accès à rien. Vérifiez le partage.");
            } else {
                log.info("✅ Calendriers accessibles par le robot :");
                for (CalendarListEntry calendar : items) {
                    log.info("- {} (ID: {})", calendar.getSummary(), calendar.getId());
                }
            }
            
            log.info("--- Vérification des calendriers configurés ---");
            if (calendarsToCheck != null) {
                for (String calId : calendarsToCheck) {
                    checkAccess(service, calId.trim());
                }
            }
            
            log.info("====================================");
        } catch (Exception e) {
            log.error("❌ Erreur critique lors du test d'accès : {}", e.getMessage(), e);
        }
    }

    private void checkAccess(Calendar service, String calendarId) {
        try {
            service.calendars().get(calendarId).execute();
            log.info("✅ Accès OK : {}", calendarId);
        } catch (Exception e) {
            log.error("❌ ÉCHEC d'accès : {} ({})", calendarId, e.getMessage());
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
        log.info("Tentative de chargement des credentials depuis : {}", credentialsPath);
        File credentialFile = new File(credentialsPath);

        if (credentialFile.exists()) {
            log.info("Fichier trouvé à {}.", credentialsPath);
            if (credentialFile.isFile()) {
                log.info("C'est un fichier. Taille : {} octets.", credentialFile.length());
                if (credentialFile.canRead()) {
                    log.info("Le fichier est lisible. Tentative de lecture du contenu...");
                    try (InputStream is = new FileInputStream(credentialFile)) {
                        byte[] buffer = new byte[100];
                        int bytesRead = is.read(buffer);
                        log.info("Contenu lu ({} octets) : {}", bytesRead, new String(buffer, 0, bytesRead));
                    } catch (IOException e) {
                        log.error("Erreur lors de la lecture du fichier : {}", e.getMessage(), e);
                        throw new IOException("Impossible de lire le fichier credentials.json à " + credentialsPath, e);
                    }
                    return new FileInputStream(credentialFile);
                } else {
                    log.error("Le fichier n'est PAS lisible à {}. Vérifiez les permissions.", credentialsPath);
                    throw new IOException("Permissions insuffisantes pour lire le fichier credentials.json à " + credentialsPath);
                }
            } else if (credentialFile.isDirectory()) {
                log.error("Le chemin {} est un répertoire, pas un fichier. Contenu du répertoire :", credentialsPath);
                try {
                    Files.list(Paths.get(credentialsPath)).forEach(path -> log.error("- {}", path.getFileName()));
                } catch (IOException e) {
                    log.error("Erreur lors de la liste du répertoire : {}", e.getMessage());
                }
                throw new IOException("Le chemin spécifié est un répertoire : " + credentialsPath);
            }
        } else {
            log.warn("Fichier NON trouvé à {}. Tentative de chargement depuis le classpath.", credentialsPath);
            try {
                ClassPathResource classPathResource = new ClassPathResource(credentialsPath);
                if (classPathResource.exists()) {
                    log.info("Fichier trouvé dans le classpath à {}.", credentialsPath);
                    return classPathResource.getInputStream();
                }
            } catch (IOException e) {
                log.warn("Fichier NON trouvé dans le classpath à {}. Erreur: {}", credentialsPath, e.getMessage());
            }

            log.warn("Fichier NON trouvé dans le classpath avec le chemin complet. Tentative de chargement de 'credentials.json' seul dans le classpath.");
            try {
                ClassPathResource classPathResource = new ClassPathResource("credentials.json");
                if (classPathResource.exists()) {
                    log.info("Fichier 'credentials.json' trouvé dans le classpath.");
                    return classPathResource.getInputStream();
                }
            } catch (IOException e) {
                log.warn("Fichier 'credentials.json' NON trouvé dans le classpath. Erreur: {}", e.getMessage());
            }
        }
        throw new IOException("Impossible de trouver le fichier credentials.json (ni sur le disque, ni dans le classpath). Path configuré : " + credentialsPath);
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
            log.error("Erreur lors de la récupération des créneaux disponibles : {}", e.getMessage(), e);
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
            log.info("Événement créé sur le calendrier : {}", primaryCalendarId);

        } catch (Exception e) {
            log.error("Erreur lors de la création de l'événement Google Calendar : {}", e.getMessage(), e);
        }
    }

    public List<Event> getEvents(LocalDateTime start, LocalDateTime end) {
        try {
            Calendar service = getCalendarService();
            ZonedDateTime zonedStart = start.atZone(ZoneId.of(TIMEZONE));
            ZonedDateTime zonedEnd = end.atZone(ZoneId.of(TIMEZONE));

            Events events = service.events().list(primaryCalendarId)
                    .setTimeMin(new DateTime(zonedStart.toInstant().toEpochMilli()))
                    .setTimeMax(new DateTime(zonedEnd.toInstant().toEpochMilli()))
                    .setOrderBy("startTime")
                    .setSingleEvents(true)
                    .execute();

            return events.getItems();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des événements : {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    private List<String> calculateFreeSlots(LocalDateTime start, LocalDateTime end, List<TimePeriod> busyPeriods, Integer bufferMinutes) {
        List<String> freeSlots = new ArrayList<>();
        LocalDateTime currentSlot = start;
        ZoneId zone = ZoneId.of(TIMEZONE);

        while (currentSlot.plusHours(1).isBefore(end) || currentSlot.plusHours(1).isEqual(end)) {
            long requiredStart = currentSlot.minusMinutes(bufferMinutes).atZone(zone).toInstant().toEpochMilli();
            long requiredEnd = currentSlot.plusHours(1).plusMinutes(bufferMinutes).atZone(zone).toInstant().toEpochMilli();

            boolean isBusy = false;

            if (busyPeriods != null) {
                for (TimePeriod busy : busyPeriods) {
                    long busyStart = busy.getStart().getValue();
                    long busyEnd = busy.getEnd().getValue();

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
